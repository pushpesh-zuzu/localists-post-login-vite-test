import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./ReEnterMobileNumber.module.css";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { checkEmailIdApi } from "../../../store/FindJobs/findJobSlice";
import { showToast } from "../../../utils";
import {
  setbuyerRequestData,
  updateMobile,
} from "../../../store/Buyer/BuyerSlice";

const ReEnterMobileNumber = ({ onClose, setReEnterMobile }) => {
  const dispatch = useDispatch();
  const { registerLoader, errorMessage } = useSelector(
    (state) => state.findJobs
  );
  const { requestLoader, buyerRequest, requestUserId } = useSelector(
    (state) => state.buyer
  );

  const [email, setEmail] = useState(buyerRequest?.email);
  const [name, setName] = useState(buyerRequest?.name);
  const [phone, setPhone] = useState(buyerRequest?.phone);

  const [isEmailValid, setIsEmailValid] = useState(true);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [errors, setErrors] = useState({
    email: false,
    name: false,
    phone: false,
  });

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setErrors((prev) => ({ ...prev, email: false }));
  };

  const handleEmailBlur = async () => {
    if (!email) return;

    try {
      const res = await dispatch(checkEmailIdApi({ email }));

      if (res?.success) {
        setErrors((prev) => ({ ...prev, email: false }));
        setIsEmailValid(true);
        setEmailErrorMessage("");
      } else {
        setEmail("");
        if (setEmails) setEmails("");
        setIsEmailValid(false);
        setEmailErrorMessage("Email is already registered.");
      }
    } catch (err) {
      console.error("Error checking email:", err);
      setErrors((prev) => ({ ...prev, email: false }));
      setIsEmailValid(false);
      setEmailErrorMessage("Something went wrong. Please try again.");
    }
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    setErrors((prev) => ({ ...prev, name: false }));
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      setPhone(value);
      setErrors((prev) => ({ ...prev, phone: false }));
    }
  };

  const handleSubmit = () => {
    if (phone.startsWith("0")) {
      showToast("error", "Please enter phone number without '0'");
      return;
    }

    const newErrors = {
      email: !email || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email),
      name: !name.trim(),
      phone: !phone || !/^\d{10}$/.test(phone),
    };

    if (newErrors.email && !emailErrorMessage) {
      setEmailErrorMessage("Please enter a valid email address.");
    }

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((e) => e);
    if (hasError || !isEmailValid) return;

    dispatch(setbuyerRequestData({ name, email: email, phone }));
    const formData = new FormData();
    formData.append("phone", phone);
    formData.append("user_id", requestUserId);
    dispatch(updateMobile(formData)).then((result) => {
      if (result) {
        showToast(
          "success",
          result?.message || "Phone Number updated Successfully"
        );
      }
      setReEnterMobile(2);
    });
  };

  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (errorMessage) {
      setShowError(true);
      const timer = setTimeout(() => {
        setShowError(false);
      }, 9000); // show for 2 seconds

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          disabled={registerLoader}
        >
          &times;
        </button>

        <div className={styles.header}>
          <h2>YOU ARE ONLY ONE STEP FROM COMPARING FREE QUOTES!</h2>
          <p style={{ color: "#000" }}>
            Your phone number and email are safe with us.
          </p>
          <p style={{ color: "#000" }}>
            We'll only use them to help you connect with trusted, verified
            professionals.
          </p>
        </div>

        <div className={styles.infoWrapper}>
          <label className={styles.label}>Name</label>
          <input
            type="text"
            placeholder="Your Name"
            className={`${styles.input} ${
              errors?.name ? styles.inputError : ""
            }`}
            value={name}
            disabled
            onChange={handleNameChange}
          />
          {errors?.name && (
            <span style={{ color: "red" }} className={styles.errorMessage}>
              Name is required.
            </span>
          )}

          <>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              type="email"
              placeholder="Email"
              className={`${styles.input} ${
                errors?.email ? styles.inputError : ""
              }`}
              value={email}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              disabled
            />
            {errors?.email && (
              <span style={{ color: "red" }} className={styles.errorMessage}>
                Please enter a valid email address.
              </span>
            )}
          </>

          <label className={styles.label}>Phone Number</label>

          <div
            className={`${styles.phoneWrapper} ${
              errors?.phone ? styles.error44 : ""
            }`}
          >
            <input
              type="tel"
              placeholder="Phone Number"
              className={`${styles.phoneInput} ${
                errors?.phone ? styles.inputError : ""
              }`}
              value={phone}
              maxLength={10}
              onChange={handlePhoneChange}
            />
            {errors?.phone && (
              <span style={{ color: "red" }} className={styles.errorMessage}>
                Please enter a valid 10-digit phone number.
              </span>
            )}
          </div>

          <div className={styles.buttonContainer}>
            <button
              className={styles.nextButton}
              onClick={handleSubmit}
              disabled={requestLoader}
              style={{
                marginLeft: "auto",
              }}
            >
              {requestLoader ? (
                <Spin
                  indicator={
                    <LoadingOutlined spin style={{ color: "white" }} />
                  }
                />
              ) : (
                "Continue"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReEnterMobileNumber;
