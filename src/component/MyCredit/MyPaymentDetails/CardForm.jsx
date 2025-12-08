import { useState } from "react";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import styles from "../MyCredit.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  addBuyCreditApi,
  AddSellerCardDetailsApi,
  getInvoiceBillingListApi,
  getSellerCardApi,
} from "../../../store/MyProfile/MyCredit/MyCreditSlice";
import { showToast } from "../../../utils";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import CVVImg from "../../../assets/Images/Setting/CVVImg.svg";
import {
  getAddManualBidData,
  getLeadRequestList,
  totalCreditData,
} from "../../../store/LeadSetting/leadSettingSlice";

const ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "16px",
      color: "#32325d",
      "::placeholder": { color: "#aab7c4" },
    },
    invalid: { color: "#fa755a" },
  },
};

const CardPaymentForm = ({
  onPaymentMethodCreated,
  onClose,
  data,
  topup,
  closeModal,
  details,
  newLeadApi,
  noLeadApiCall = false,
  newLeadData,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { registerData } = useSelector((state) => state.findJobs);
  const { userToken } = useSelector((state) => state.auth);
  const { sellerBillingLoader } = useSelector((state) => state.myCredit);
  const item = data?.map((item) => item)[0] || {};
  const items = newLeadData?.[0] || {};

  const addManualBidData = () => {
    const formData = new FormData();
    formData.append("buyer_id", details?.customer_id);
    formData.append(
      "user_id",
      userToken?.remember_tokens
        ? userToken?.remember_tokens
        : registerData?.remember_tokens
    );
    formData.append("bid", details?.credit_score);
    formData.append("lead_id", details?.id);
    formData.append("bidtype", "purchase_leads");
    formData.append("service_id", details?.service_id);
    formData.append("distance", "0");

    dispatch(getAddManualBidData(formData)).then((result) => {
      if (result) {
        showToast("success", result?.message);
      }

      const data = {
        user_id: userToken?.remember_tokens
          ? userToken?.remember_tokens
          : registerData?.remember_tokens,
      };

      dispatch(totalCreditData(data));
      dispatch(getLeadRequestList(data));
    });
  };

  const handleBuyNow = () => {
    let credits = items?.no_of_leads ? items.no_of_leads : item?.no_of_leads;

    const price = items?.price ? items.price : item?.price;
    const no_of_leads = items?.no_of_leads
      ? items.no_of_leads
      : item?.no_of_leads;
    const name = items?.name ? items.name : item?.name;
    const billing_vat_register =
      items?.billing_vat_register ?? item?.billing_vat_register;

    const vatTotal =
      billing_vat_register === 0 ? 0 : Math.floor((price * 20) / 100);

    // ✅ If coupon exists and is percentage-based
    if (typeof addcoupanList === "string" && addcoupanList.includes("%")) {
      const discountPercent = parseFloat(addcoupanList.replace("%", ""));
      const discountAmount = Math.floor((no_of_leads * discountPercent) / 100);
      credits = no_of_leads + discountAmount;
    }

    const creditData = {
      amount: price,
      credits: credits,
      details: name,
      total_amount: (price + vatTotal) * 100,
      vat: vatTotal,
      top_up: topup ? 1 : 0,
    };

    dispatch(addBuyCreditApi(creditData)).then((result) => {
      if (result?.success) {
        showToast("success", result?.message);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
        dispatch(getInvoiceBillingListApi());
        const data = {
          user_id: userToken?.remember_tokens
            ? userToken.remember_tokens
            : registerData?.remember_tokens,
        };
        dispatch(totalCreditData(data));
        closeModal();

        if (!noLeadApiCall) {
          addManualBidData();
        }
      } else if (result?.success === false) {
        setCreditModal(true);
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!stripe || !elements) return;

    const cardNumberElement = elements.getElement(CardNumberElement);
    const cardExpiryElement = elements.getElement(CardExpiryElement);
    const cardCvcElement = elements.getElement(CardCvcElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardNumberElement,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      const card = paymentMethod.card;

      const data = {
        card_number: card?.last4,
        expiry_date: `${card?.exp_month}/${card?.exp_year}`,
        cvc: "xxx",
        stripe_payment_method_id: paymentMethod?.id,
      };

      dispatch(AddSellerCardDetailsApi(data)).then((result) => {
        if (result) {
          showToast("success", result?.message);
          onClose();
          dispatch(getSellerCardApi());
          if (newLeadApi) {
            handleBuyNow();
          }
        }
      });

      onPaymentMethodCreated(paymentMethod.id);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.title}>Card details</h2>

      <div className={styles.field}>
        <label className={styles.label}>Card Number</label>
        <CardNumberElement
          options={ELEMENT_OPTIONS}
          className={styles.cardInput}
        />
      </div>

      <div className={styles.row}>
        <div className={styles.halfField}>
          <label className={styles.label}>Expiry Date</label>
          <CardExpiryElement
            options={ELEMENT_OPTIONS}
            className={styles.cardInput}
          />
        </div>
        <div className={styles.halfField}>
          <label className={styles.label}>CVC</label>
          <div className={styles.cvvInputWrapper}>
            <CardCvcElement
              options={ELEMENT_OPTIONS}
              className={styles.cardInput}
            />
            <img src={CVVImg} alt="CVV" className={styles.cvvIcon} />
          </div>
        </div>
      </div>
      <div>{error && <div className={styles.error}>{error}</div>}</div>
      <div className={styles.actions}>
        <button type="button" className={styles.cancelBtn} onClick={onClose}>
          Cancel
        </button>
        <button
          type="submit"
          className={styles.submitBtn}
          disabled={!stripe || loading}
        >
          {sellerBillingLoader ? (
            <Spin
              indicator={<LoadingOutlined spin style={{ color: "white" }} />}
            />
          ) : (
            "Add card"
          )}
        </button>
      </div>
    </form>
  );
};

export default CardPaymentForm;
