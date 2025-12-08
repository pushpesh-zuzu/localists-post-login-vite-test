import { useRef, useState } from "react";
import styles from "../buyerPanel/PlaceNewRequest/BuyerRegistration/OtpVerification/OtpVerification.module.css";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "../../utils";
import { sellerPhoneNumberVerifyDataApi } from "../../store/MyProfile/myProfileSlice";

const OtpModal = ({ open, onClose, phoneData }) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);
  const dispatch = useDispatch();
  if (!open) return null;

  const handleChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text/plain").slice(0, 4);
    const newOtp = [...otp];

    pasteData.split("").forEach((char, i) => {
      if (i < 4) {
        newOtp[i] = char;
      }
    });

    setOtp(newOtp);

    const lastFilledIndex = pasteData.length - 1;
    if (lastFilledIndex < 3) {
      inputRefs.current[lastFilledIndex + 1].focus();
    } else {
      inputRefs.current[3].focus();
    }
  };
  const handleSubmit = () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length < 4) {
      showToast("error", "Please enter a valid 4-digit OTP.");
      return;
    }

    const data = {
      phone_number: phoneData,
      otp: enteredOtp,
    };

    dispatch(sellerPhoneNumberVerifyDataApi(data)).then((result) => {
      if (result?.success) {
        showToast("success", result?.message);
        onClose();
      } else {
        showToast("error", result?.message || "OTP verification failed");
      }
    });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.title}>OTP Verification</h2>
        <div className={styles.VerifyText}>Please verify your account</div>

        <div className={styles.otpInputs}>
          {[0, 1, 2, 3].map((index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              className={styles.otpInput}
              value={otp[index]}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              ref={(el) => (inputRefs.current[index] = el)}
              autoFocus={index === 0}
            />
          ))}
        </div>

        <p className={styles.instruction}>
          Please enter the code sent by SMS to
          <br />
          <span>{phoneData}</span>
        </p>

        <button className={styles.submitBtn} onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default OtpModal;
