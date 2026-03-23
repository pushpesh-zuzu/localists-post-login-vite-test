import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../Modal/Modal";
import InputField from "../UI/InputField";
import { setbuyerRequestData, questionAnswerData } from "../../../../../store/Buyer/BuyerSlice";
import { getBarkToken } from "../../../../../utils/getCookies";
import styles from "./ServiceDoYouNeed.module.css";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { searchService, setService } from "../../../../../store/FindJobs/findJobSlice";
import { getCityName, setcitySerach } from "../../../../../store/Buyer/BuyerSlice";
import CheckIcon from "../../../../../assets/Icons/greenCheckBox.jpeg";


function ServiceDoYouNeed({
    onClose,
    nextStep,
    setShowConfirmModal,
    isStartWithQuestionModal = false,
    isPPCPages = false,
    serviceId,
    serviceName,
    progressPercent,
    getService
}) {
    const dispatch = useDispatch();
    const { buyerStep, buyerRequest, citySerach, requestLoader } = useSelector(
        (state) => state.buyer,
    );
    const { service, searchServiceLoader } = useSelector(
        (state) => state.findJobs
    );

    const [input, setInput] = useState("");
    const [selectedService, setSelectedService] = useState(null);
    const [pincode, setPincode] = useState("");
    const [city, setCity] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [checkingPostcode, setCheckingPostcode] = useState(false);
    const [postalCodeValidate, setPostalCodeValidate] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [errors, setErrors] = useState({
        service: "",
        pincode: "",
    });

    useEffect(() => {
        if (input.trim() !== "") {
            const delay = setTimeout(() => {
                dispatch(searchService({ search: input }));
            }, 500);

            return () => clearTimeout(delay);
        } else {
            dispatch(setService([]));
        }
    }, [input, dispatch]);

    useEffect(() => {
        if (serviceName && isInitialLoad) {
            setInput(serviceName);

            if (service?.length > 0) {
                const match = service.find(
                    (item) =>
                        item.name.toLowerCase().trim() ===
                        serviceName.toLowerCase().trim()
                );

                if (match) {
                    setSelectedService(match);
                    setIsDropdownOpen(false);
                    setIsInitialLoad(false);
                }
            }
        }
    }, [serviceName, service, isInitialLoad]);

    useEffect(() => {
        if (serviceName) {
            dispatch(searchService({ search: serviceName }));
        }
    }, [serviceName, dispatch]);

    const handleSelectService = (item) => {
        setInput(item.name);
        setSelectedService(item);
        setIsDropdownOpen(false);
        setErrors((prev) => ({ ...prev, service: "" }));
    };

    const validatePostcode = async (value) => {
        if (!value) return;

        setCheckingPostcode(true);
        try {
            const res = await dispatch(getCityName({ postcode: value }));
            const data = res?.unwrap ? await res.unwrap() : res;

            if (data?.data?.valid) {
                setCity(data.data.city);
                dispatch(setcitySerach(data.data.city));
                setPostalCodeValidate(true);
                setErrors((prev) => ({ ...prev, pincode: "" }));
            } else {
                setPostalCodeValidate(false);
                setErrors((prev) => ({
                    ...prev,
                    pincode: "Please enter a valid postcode!",
                }));
            }
        } catch {
            setPostalCodeValidate(false);
            setErrors((prev) => ({
                ...prev,
                pincode: "Please enter a valid postcode!",
            }));
        } finally {
            setCheckingPostcode(false);
        }
    };

    useEffect(() => {
        if (pincode.length >= 3) {
            const delay = setTimeout(() => validatePostcode(pincode), 600);
            return () => clearTimeout(delay);
        }
    }, [pincode]);

    const handleCloseClick = () => {
        dispatch(setbuyerRequestData({
            ...buyerRequest,
            postcode: "",
            city: "",
        }));
        if (!getBarkToken()) {
            // dispatch(setbuyerRequestData({}));
            setShowConfirmModal(true);
        } else {
            onClose();
        }
    };

    const handleSubmit = () => {
        let newErrors = {};

        if (!selectedService) newErrors.service = "Please select a service!";
        if (!pincode) newErrors.pincode = "Postcode is required!";

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return;

        dispatch(
            setbuyerRequestData({
                service_id: selectedService?.id || serviceId,
            })
        );
        dispatch(
            questionAnswerData({
                service_id: selectedService?.id || serviceId || service?.[0]?.id,
            })
        );
        if (getService && selectedService) {
            getService(selectedService);
        }
        nextStep();
    };

    return (
        <Modal
            isOpen={true}
            onClose={handleCloseClick}
            title="What service do you need?"
            onNext={handleSubmit}
            buyerStep={buyerStep}
            fixedHeight={true}
            showProgressBar={true}
            progressPercent={progressPercent}
            overlayClassName={styles.overlay}
            containerClassName={styles.container}
            buttonGroupClassName={styles.buttonGroup}
            titleClassName={styles.titleLeft}
        >
            <div className={styles.scrollFixWrapper}>
                <div className={styles.contentWrapper}>
                    <div style={{ position: "relative", width: "100%" }}>
                        <InputField
                            label="What service do you need?"
                            value={input}
                            onChange={(e) => {
                                const value = e.target.value;
                                setInput(value);
                                setSelectedService(null);
                                setIsInitialLoad(false);

                                if (value.trim() === "") {
                                    setIsDropdownOpen(false);
                                } else {
                                    setIsDropdownOpen(true);
                                }
                            }}
                            error={errors.service}
                            placeholder="e.g, Landscaping Driveways"
                            labelStyle={{ marginTop: 0 }}
                        />

                        {isDropdownOpen && input.trim() !== "" && (
                            <div className={styles.searchResults}>
                                {searchServiceLoader ? (
                                    <Spin indicator={<LoadingOutlined spin />} />
                                ) : service?.length > 0 ? (
                                    service.map((item) => (
                                        <p
                                            key={item.id}
                                            className={styles.searchItem}
                                            onClick={() => handleSelectService(item)}
                                        >
                                            {item.name}
                                        </p>
                                    ))
                                ) : (
                                    <p className={styles.noData}>No services found</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Postcode Input */}
                    {!isPPCPages && (
                        <div style={{
                            position: "relative", width: "100%", marginBottom: "2px",
                        }}>
                            <InputField
                                label="Where do you need it?"
                                value={pincode}
                                onChange={(e) => {
                                    setPincode(e.target.value);
                                    setPostalCodeValidate(false);
                                }}
                                error={errors.pincode}
                                placeholder="Enter Postcode (No Spaces)"
                                style={{ marginBottom: "2px" }}
                            />

                            {checkingPostcode ? (
                                <Spin
                                    indicator={<LoadingOutlined spin />}
                                    size="small"
                                    className={styles.loaderIcon}
                                />
                            ) : postalCodeValidate ? (
                                <img src={CheckIcon} alt="Success" className={styles.checkIcon} />
                            ) : null}

                        </div>
                    )}

                </div>
            </div>
        </Modal >
    );
}

export default ServiceDoYouNeed;