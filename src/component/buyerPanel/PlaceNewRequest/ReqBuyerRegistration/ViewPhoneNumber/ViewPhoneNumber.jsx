import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../Modal/Modal";
import InputField from "../UI/InputField";
import styles from "./ViewPhoneNumber.module.css";

import {
    clearSetbuyerRequestData,
    createRequestData,
    setbuyerRequestData,
} from "../../../../../store/Buyer/BuyerSlice";
import { clearBuyerRegisterFormData } from "../../../../../store/FindJobs/findJobSlice";
import { showToast } from "../../../../../utils";

import {
    formatUKPhoneNumber,
    validateUKPhoneNumber,
} from "../../../../../utils/formatUKPhoneNumber";

function ViewPhoneNumber({
    onClose,
    nextStep,
    previousStep,
    progressPercent,
}) {
    const dispatch = useDispatch();

    const {
        buyerStep,
        buyerRequest,
        citySerach,
        requestLoader,
        requestDataList,
    } = useSelector((state) => state.buyer);

    const { userToken } = useSelector((state) => state.auth);

    const [phoneNumber, setPhoneNumber] = useState("");
    const [consent, setConsent] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (requestDataList?.phone) {
            setPhoneNumber(formatUKPhoneNumber(requestDataList.phone));
        } else if (userToken?.phone) {
            setPhoneNumber(formatUKPhoneNumber(userToken.phone));
        }
    }, [requestDataList?.phone, userToken?.phone]);

    const handleInputChange = (e) => {
        let value = e.target.value.replace(/\D/g, "");

        if (value.startsWith("44")) {
            value = value.slice(2);
        }

        setPhoneNumber(value);
        setError(false);
    };

    const handleSubmit = () => {
        if (phoneNumber.length !== 11) {
            setError(true);
            return;
        }

        if (!validateUKPhoneNumber(phoneNumber)) return;

        const formData = new FormData();
        formData.append("service_id", buyerRequest?.service_id);
        formData.append("postcode", buyerRequest?.postcode);
        formData.append("city", citySerach);
        formData.append("questions", JSON.stringify(buyerRequest?.questions));
        formData.append("phone", phoneNumber);
        formData.append("recevive_online", consent ? 1 : 0);
        formData.append("form_status", 1);

        dispatch(createRequestData(formData)).then((result) => {
            if (result?.success) {
                showToast("success", result?.message);
                nextStep();
            }
        });
    };

    const handleBack = () => {
        dispatch(setbuyerRequestData({ questions: [] }));
        previousStep();
    };

    const handleCloseClick = () => {
        onClose();
        dispatch(clearSetbuyerRequestData());
        dispatch(clearBuyerRegisterFormData());
    };

    return (
        <Modal
            isOpen={true}
            onClose={handleCloseClick}
            title="View your matches now!"
            onNext={handleSubmit}
            onBack={handleBack}
            nextButtonText="View Matches"
            disabled={requestLoader}
            buyerStep={buyerStep}
            fixedHeight={true}
            showProgressBar={true}
            showButtons={true}
            progressPercent={progressPercent}
            overlayClassName={styles.overlay}
            containerClassName={styles.container}
            buttonGroupClassName={styles.buttonGroup}
            titleClassName={styles.titleLeft}
        >
            <div className={styles.contentWrapper}>
                <InputField
                    label="Your Phone Number"
                    placeholder="Enter Your Phone Number"
                    value={phoneNumber}
                    onChange={handleInputChange}
                    labelStyle={{ marginTop: 0 }}
                />

                {error && (
                    <p className={styles.errorMessage}>
                        Please enter a valid 11-digit phone number.
                    </p>
                )}

                <div className={styles.checkboxContainer}>
                    <label className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            checked={consent}
                            onChange={(e) => setConsent(e.target.checked)}
                        />
                        <span className={styles.customCheckbox}></span>
                        <span className={styles.checkboxText}>
                            I'm happy to receive this online or remotely.
                        </span>
                    </label>
                </div>

                <p className={styles.disclaimer}>
                    Localists will provide your information to up to 5 professionals who
                    may contact you about your project in accordance with our privacy
                    policy. By submitting this form, you consent that such professionals
                    may call or text you on the phone number you provided to offer their
                    services (these calls may be made using automated phone technology).
                    Consent is not a condition of purchasing or receiving any of the
                    services.
                </p>
            </div>
        </Modal>
    );
}

export default ViewPhoneNumber;