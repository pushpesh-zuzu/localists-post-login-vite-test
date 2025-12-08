import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./ViewYourMatches.module.css";
import {
  clearSetbuyerRequestData,
  createRequestData,
} from "../../../../../store/Buyer/BuyerSlice";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { showToast } from "../../../../../utils";
import { clearBuyerRegisterFormData } from "../../../../../store/FindJobs/findJobSlice";

const ViewYourMatches = ({
  onClose,
  nextStep,
  previousStep,
  setShowConfirmModal,
}) => {
  const {
    buyerRequest,
    requestLoader,
    citySerach,
    requestDataList,
    createRequestToken,
  } = useSelector((state) => state.buyer);
  const dispatch = useDispatch();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState(false);
  const { userToken } = useSelector((state) => state.auth);
  useEffect(() => {
    if (requestDataList?.phone) {
      setPhoneNumber(requestDataList?.phone.replace(/^\+44/, ""));
    } else if (userToken?.phone) {
      setPhoneNumber(userToken?.phone.replace(/^\+44/, ""));
    }
  }, [requestDataList?.phone, userToken?.phone]);
  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setPhoneNumber(value);
    setError(false);
  };
  const handleSubmit = () => {
    if (phoneNumber.startsWith("0")) {
      showToast("error", "Please enter phone number without '0'.");
      return;
    }

    if (phoneNumber.length !== 10) {
      setError(true);
      return;
    }

    const formData = new FormData();
    formData.append("service_id", buyerRequest?.service_id);
    formData.append("postcode", buyerRequest?.postcode);
    formData?.append("city", citySerach);
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

  const handleCloseClick = () => {
    onClose();
    dispatch(clearSetbuyerRequestData());
    dispatch(clearBuyerRegisterFormData());
 
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div
          className={styles.closeButton}
          onClick={handleCloseClick}
          disabled={requestLoader}
        >
          &times;
        </div>
        <div className={styles.header}>
          <h2>View your matches now!</h2>
        </div>

        <div className={styles.infoWrapper}>
          <label htmlFor="phoneNumber" className={styles.label}>
            Please enter your phone numbers
          </label>

          <div className={styles.phoneWrapper}>
            <input
              type="text"
              id="phoneNumber"
              placeholder="+44 Phone Number"
              className={styles.input}
              maxLength={14} 
              value={"+44 " + phoneNumber}
              onChange={(e) => {
                let value = e.target.value;

                value = value.replace(/\D/g, "");

                if (value.startsWith("44")) {
                  value = value.slice(2);
                }

                if (value.length === 10 && value === "0") {
                  showToast("error", "Please enter phone number without '0'.");
                  return;
                }
                setPhoneNumber(value);

                if (value.length <= 10) {
                  setPhoneNumber(value);
                }

                setError(false);
              }}
              style={{ borderColor: error ? "red" : "" }}
            />

            {error && (
              <span className={styles.errorMessage}>
                Please enter a valid 10-digit phone number.
              </span>
            )}
          </div>

          <div className={styles.checkboxContainer}>
            <input
              type="checkbox"
              id="consent"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />
            <label htmlFor="consent">
              I'm happy to receive this online or remotely.
            </label>
          </div>

          <div className={styles.buttonContainer}>
            <button
              className={styles.backButton}
              onClick={previousStep}
              disabled={requestLoader}
            >
              Back
            </button>
            <button className={styles.nextButton} onClick={handleSubmit}>
              {requestLoader ? (
                <Spin
                  indicator={
                    <LoadingOutlined spin style={{ color: "white" }} />
                  }
                />
              ) : (
                "View Matches"
              )}{" "}
            </button>
          </div>
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
    </div>
  );
};

export default ViewYourMatches;
