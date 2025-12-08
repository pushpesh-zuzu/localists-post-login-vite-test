import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./EmailMatch.module.css";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { checkEmailIdApi } from "../../../../../store/FindJobs/findJobSlice";
import { showToast } from "../../../../../utils";
import {
  registerQuoteCustomer,
  setbuyerRequestData,
} from "../../../../../store/Buyer/BuyerSlice";
import { useLocation } from "react-router";
import useUserInfo from "../../../../../utils/getUserIp";
import { validateEmail } from "../../../../../utils/validateEmail";
import { useEmailCheck } from "../../../../../utils/emailExist";

const EmailMatch = ({
  onClose,
  nextStep,
  setEmails,
  setShowConfirmModal,
  resetTrigger,
  isStartWithQuestionModal = false,
  isPPCPages = false,
  hideCloseButton = false,
}) => {
  const dispatch = useDispatch();
  const { registerLoader, buyerRegisterFormData, errorMessage } = useSelector(
    (state) => state.findJobs
  );
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const { ip, url } = useUserInfo();
  const campaignid = params.get("campaignid");
  const keyword = params.get("keyword");
  const gclid = params.get("gclid");
  const campaign = params.get("utm_campaign");
  const adGroup = params.get("AgId");
  const targetID = params.get("utm_term");
  const msclickid = params.get("utm_msclkid");
  const utm_source = params.get("utm_source");
  const { userToken } = useSelector((state) => state.auth);

  const [inputType, setInputType] = useState("text");

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const { isEmailAvailable } = useEmailCheck(email);

  const [errors, setErrors] = useState({
    email: false,
    name: false,
    phone: false,
  });
  const { requestLoader, buyerRequest, citySerach } = useSelector(
    (state) => state.buyer
  );
  const handleEmailFocus = () => {
    setInputType("email");
  };
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setErrors((prev) => ({ ...prev, email: false }));
    dispatch(
      setbuyerRequestData({
        ...buyerRequest,
        name,
        email: e.target.value,
        phone,
      })
    );
  };

  useEffect(() => {
    if (!isEmailAvailable) {
      setEmail("");
      dispatch(
        setbuyerRequestData({
          ...buyerRequest,
          name,
          email: "",
          phone,
        })
      );
    }
  }, [isEmailAvailable]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (name || email || phone) {
        const savedData = {
          name: name || "",
          email: email || "",
          phone: phone || "",
          questions: buyerRequest?.questions || [],
          service_id: buyerRequest?.service_id || "",
          city: citySerach || "",
          postcode: buyerRequest?.postcode || "",
          campaignid: campaignid || "",
          gclid: gclid || "",
          campaign: campaign || "",
          adgroup: adGroup || "",
          targetid: targetID || "",
          msclickid: msclickid || "",
          utm_source: utm_source || "",
          keyword: keyword || "",
          form_status: 0,
        };

        localStorage.setItem("unsentQuoteData", JSON.stringify(savedData));

        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [
    name,
    email,
    phone,
    buyerRequest,
    citySerach,
    campaignid,
    gclid,
    campaign,
    adGroup,
    targetID,
    msclickid,
    utm_source,
    keyword,
  ]);
  useEffect(() => {
    const savedData = localStorage.getItem("unsentQuoteData");

    if (savedData) {
      const formData = JSON.parse(savedData);

      const dataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "questions") {
          dataToSend.append("questions", JSON.stringify(value || []));
        } else {
          dataToSend.append(key, value);
        }
      });

      dispatch(registerQuoteCustomer(dataToSend)).then((result) => {
        if (result) {
          localStorage.removeItem("unsentQuoteData");
        }
      });
    }
  }, [dispatch]);

  const handleEmailBlur = async () => {
    if (!email) {
      setInputType("text");
    }

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
    dispatch(
      setbuyerRequestData({
        ...buyerRequest,
        name: e.target.value,
        email,
        phone,
      })
    );
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      setPhone(value);
      setErrors((prev) => ({ ...prev, phone: false }));
      dispatch(
        setbuyerRequestData({ ...buyerRequest, name, email, phone: value })
      );
    }
  };

  const handleSubmit = () => {
    if (phone.startsWith("0")) {
      showToast("error", "Please enter phone number without '0'");
      return;
    }

    const newErrors = {
      email:
        !isPPCPages &&
        (!email || !validateEmail(email)),
      name: !name.trim(),
      phone: !phone || !/^\d{10}$/.test(phone),
    };

    if (!isPPCPages && newErrors.email && !emailErrorMessage) {
      setEmailErrorMessage("Please enter a valid email address.");
    }

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((e) => e);
    if (hasError || (!isPPCPages && !isEmailValid)) return;

    if (!isPPCPages && setEmails) {
      setEmails(email);
    }

    const finalEmail = isPPCPages ? buyerRequest?.email || "" : email;

    dispatch(setbuyerRequestData({ name, email: finalEmail, phone }));
    const updatedAnswers = buyerRequest?.questions || [];

    if (isStartWithQuestionModal) {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", finalEmail);
      formData.append("phone", phone);
      formData.append("questions", JSON.stringify(updatedAnswers));
      formData.append("service_id", buyerRequest?.service_id || "");
      formData.append("city", citySerach || "");
      formData.append("postcode", buyerRequest?.postcode || "");
      formData.append("campaignid", campaignid || "");
      formData.append("gclid", gclid || "");
      formData.append("campaign", campaign || "");
      formData.append("adgroup", adGroup || "");
      formData.append("targetid", targetID || "");
      formData.append("msclickid", msclickid || "");
      formData.append("utm_source", utm_source || "");
      formData.append("keyword", keyword || "");
      formData.append("form_status", 1);
      formData.append("entry_url", url);
      formData.append("user_ip_address ", ip);

      dispatch(registerQuoteCustomer(formData)).then((result) => {
        if (result) {
          nextStep();
        }
      });
    } else {
      nextStep();
      setbuyerRequestData({
        ...buyerRequest,
        name: name,
        city: email,
        phone: phone,
      });
    }
  };

  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (errorMessage) {
      setShowError(true);
      const timer = setTimeout(() => {
        setShowError(false);
      }, 9000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  useEffect(() => {
    if (resetTrigger) {
      setName("");
      setPhone("");
      setEmail("");
      setErrors(null);
      setResetEmailFormTrigger(false);
    }
  }, [resetTrigger]);

  const handleCloseClick = () => {
    if (!userToken?.remember_tokens) {
      dispatch(setbuyerRequestData({ name, email, phone }));
      setShowConfirmModal(true);
    } else {
      onClose();
    }
  };

  const handleLeave = () => {
    const formData = new FormData();
    formData.append("name", name || "");
    formData.append("email", email || "");
    formData.append("phone", phone || "");
    formData.append("questions", JSON.stringify(buyerRequest?.questions || []));
    formData.append("service_id", buyerRequest?.service_id || "");
    formData.append("city", citySerach || "");
    formData.append("postcode", buyerRequest?.postcode || "");
    formData.append("campaignid", campaignid || "");
    formData.append("gclid", gclid || "");
    formData.append("campaign", campaign || "");
    formData.append("adgroup", adGroup || "");
    formData.append("targetid", targetID || "");
    formData.append("msclickid", msclickid || "");
    formData.append("utm_source", utm_source || "");
    formData.append("keyword", keyword || "");
    formData.append("form_status", 0);

    dispatch(registerQuoteCustomer(formData)).then((res) => {
      if (res?.success) {
        localStorage.removeItem("unsentQuoteData");
        window.location.reload();
      }
    });
  };

  useEffect(() => {
    dispatch(setbuyerRequestData({ name, email, phone }));
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (name || email || phone) {
        e.preventDefault();
        e.returnValue = "";
        dispatch(setbuyerRequestData({ name, email, phone }));
      }
    };

    const handleBeforeRouteChange = (event) => {
      if (name || email || phone) {
        event.preventDefault();
        dispatch(setbuyerRequestData({ name, email, phone }));
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handleBeforeRouteChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handleBeforeRouteChange);
    };
  }, [name, email, phone]);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {!hideCloseButton && (
          <button
            className={styles.closeButton}
            onClick={handleCloseClick}
            disabled={registerLoader}
          >
            &times;
          </button>
        )}
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
          {/* Hidden trap fields for auto-fill prevention - ADDED THESE */}
          <input
            type="text"
            name="username"
            style={{ display: "none", position: "absolute", left: "-9999px" }}
            autoComplete="new-password"
            tabIndex="-1"
          />
          <input
            type="password"
            name="password"
            style={{ display: "none", position: "absolute", left: "-9999px" }}
            autoComplete="new-password"
            tabIndex="-1"
          />

          <label className={styles.label}>Name</label>
          <input
            type="text"
            placeholder="Your Name"
            autoComplete="new-password"
            className={`${styles.input} ${
              errors?.name ? styles.inputError : ""
            }`}
            value={name}
            onChange={handleNameChange}
            name="user_full_name" 
            id="user_full_name"
          />
          {errors?.name && (
            <span style={{ color: "red" }} className={styles.errorMessage}>
              Name is required.
            </span>
          )}

          {!isPPCPages && (
            <>
              <label htmlFor="user_email_address" className={styles.label}>
                Email
              </label>
              <input
                type={inputType}
                placeholder="Email"
                className={`${styles.input} ${
                  errors?.email ? styles.inputError : ""
                }`}
                value={email}
                onChange={handleEmailChange}
                onFocus={handleEmailFocus} 
                onBlur={handleEmailBlur} 
                autoComplete="new-password" 
                name="user_email_address" 
                id="user_email_address"
              />
              {errors?.email && (
                <span style={{ color: "red" }} className={styles.errorMessage}>
                  Please enter a valid email address.
                </span>
              )}
            </>
          )}

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
              autoComplete="new-password" 
              name="user_contact_number" 
              id="user_contact_number"
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
              disabled={registerLoader || requestLoader}
              style={{
                marginLeft: "auto",
              }}
            >
              {registerLoader || requestLoader ? (
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

export default EmailMatch;
