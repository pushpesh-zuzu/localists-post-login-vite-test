import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./WelcomeEmailModal.module.css";
import { checkEmailIdApi } from "../../../../../store/FindJobs/findJobSlice";
import { setbuyerRequestData } from "../../../../../store/Buyer/BuyerSlice";
import logo from "../../../../../assets/Images/logo.png";
import fullRightArrow from "../../../../../assets/Icons/fullRightArrow.png";

const WelcomeEmailModal = ({
  onClose,
  nextStep,
  setShowConfirmModal,
  resetTrigger,
  welcomModalTitle = "",
  welcomModalButtonText = "",
}) => {
  const dispatch = useDispatch();
  const { registerLoader } = useSelector((state) => state.findJobs);
  const { userToken } = useSelector((state) => state.auth);
  const { buyerRequest } = useSelector((state) => state.buyer);

  const [email, setEmail] = useState(buyerRequest?.email || "");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [errors, setErrors] = useState({ email: false });
  useEffect(() => {
    if (buyerRequest?.email) {
      setEmail(buyerRequest.email);
    }
  }, [buyerRequest?.email]);

  const handleCloseClick = () => {
    if (!userToken?.remember_tokens) {
      dispatch(setbuyerRequestData({ email }));
      setShowConfirmModal(true);
    } else {
      onClose();
    }
  };

  // Reset functionality
  useEffect(() => {
    if (resetTrigger) {
      setEmail("");
      setErrors({ email: false });
      setEmailErrorMessage("");
    }
  }, [resetTrigger]);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.closeButton}
          onClick={handleCloseClick}
          disabled={registerLoader}
        >
          &times;
        </button>

        <div className={styles.header}>
          <img src={logo} className={styles.logo} alt="Localist Logo" />
        </div>

        <div className={`${styles.info} ${styles.desktopInfoText}`}>
          <p>Answer A Few Quick Questions & We’ll Match You</p>
          <p>With The Best Local {welcomModalTitle}</p>
          <p>For Your Needs</p>
        </div>
        <div className={`${styles.info} ${styles.mobileInfoText}`}>
          <p>
            Answer A Few Quick Questions & We’ll Match You With The Best Local{" "}
            {welcomModalTitle} For Your Needs{" "}
          </p>
        </div>

        <div className={styles.buttonContainer}>
          <button className={styles.nextButtonMobile} onClick={nextStep}>
            Find {welcomModalButtonText}
            <img
              className={styles.arrow}
              src={fullRightArrow}
              alt="arrow"
            />{" "}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeEmailModal;
