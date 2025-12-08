import { useEffect, useState } from "react";
import styles from "./AddCardModal.module.css";
import VisaImg from "../../../assets/Images/Setting/VisaImg.svg";
import MasterImg from "../../../assets/Images/Setting/masterCard.svg";
import Amex from "../../../assets/Images/Setting/AmericanImg.svg";
import StripeProvider from "./StripeProvider";
import CardPaymentForm from "./CardForm";

const AddCardModal = ({
  onClose,
  detail,
  topup,
  closeModal,
  details,
  newLeadApi,
  noLeadApiCall,
  newLeadData,
}) => {
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvc: "",
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const getPaymentId = async (Id) => {};
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>

        <StripeProvider>
          <CardPaymentForm
            onPaymentMethodCreated={getPaymentId}
            onClose={onClose}
            data={detail}
            topup={topup}
            closeModal={closeModal}
            details={details}
            newLeadApi={newLeadApi}
            noLeadApiCall={noLeadApiCall}
            newLeadData={newLeadData}
          />
        </StripeProvider>

        <div className={styles.footerNote}>
          <div>
            <p>🔒 Your Payment Is Secure</p>
            <span>
              Your card details are safely stored for future purchases. You can
              update or manage your payment info anytime in your settings. You
              can also securely add multiple cards.
            </span>
          </div>
          <div className={styles.cards}>
            <img src={VisaImg} alt="Visa" />
            <img src={MasterImg} alt="Mastercard" />
            <img src={Amex} alt="Amex" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCardModal;
