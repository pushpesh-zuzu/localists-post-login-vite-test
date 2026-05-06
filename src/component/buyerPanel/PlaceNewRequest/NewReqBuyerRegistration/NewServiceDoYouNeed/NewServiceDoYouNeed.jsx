import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setbuyerRequestData, questionAnswerData } from "../../../../../store/Buyer/BuyerSlice";
import { getBarkToken } from "../../../../../utils/getCookies";
import styles from "./NewServiceDoYouNeed.module.css";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { getCityName, setcitySerach } from "../../../../../store/Buyer/BuyerSlice";
import CheckIcon from "../../../../../assets/Icons/greenCheckBox.jpeg";
// import RequestInputField from "../../../UI/RequestInputField";
import RequestBuyerModal from "../../ReqBuyerRegistration/Modal/RequestBuyerModal";
import { searchService,setService } from "../../../../../store/FindJobs/findJobSlice";
import RequestInputField from "../../ReqBuyerRegistration/UI/RequestInputField";


function NewServiceDoYouNeed({
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

    const normalizePostcode = (postcode) =>
        postcode.replace(/\s+/g, "").toUpperCase();

    const isValidUKPostcode = (postcode) =>
        /^([A-Z]{1,2}\d[A-Z\d]?)(\s?\d[A-Z]{2})$/i.test(postcode.trim());

    const isFullPostcode = (postcode) => {
        const cleaned = normalizePostcode(postcode);
        return cleaned.length >= 5 && cleaned.length <= 7;
    };

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

    const handleSubmit = async () => {
        let newErrors = {};
        const cleaned = normalizePostcode(pincode);

        if (!selectedService) newErrors.service = "Please select a service!";
        if (!pincode) {
            newErrors.pincode = "Postcode is required!";
        } else if (!isFullPostcode(cleaned)) {
            newErrors.pincode = "Please enter full postcode!";
        } else if (!isValidUKPostcode(pincode)) {
            newErrors.pincode = "Please enter a valid postcode!";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return;

        setCheckingPostcode(true);
        try {
            const res = await dispatch(getCityName({ postcode: cleaned }));
            const data = res?.unwrap ? await res.unwrap() : res;

            if (data?.data?.valid) {
                setCity(data.data.city);
                dispatch(setcitySerach(data.data.city));
                setPostalCodeValidate(true);
                setErrors((prev) => ({ ...prev, pincode: "" }));

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
                setTimeout(() => {
                    nextStep();
                }, 500);
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

    return (
        <RequestBuyerModal
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
            onBackDisable
        >
            <div className={styles.scrollFixWrapper}>
                <div className={styles.contentWrapper}>
                    <div style={{ position: "relative", width: "100%" }}>
                        <RequestInputField
                            errorGap="10px"
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
                            <RequestInputField
                                errorGap="10px"
                                label="Where do you need it?"
                                value={pincode}
                                onChange={(e) => {
                                    const value = e.target.value.toUpperCase().slice(0, 10);

                                    setPincode(value);
                                    setPostalCodeValidate(false);
                                    setCity("");
                                    setErrors((prev) => ({ ...prev, pincode: "" }));
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
        </RequestBuyerModal >
    );
}

export default NewServiceDoYouNeed;