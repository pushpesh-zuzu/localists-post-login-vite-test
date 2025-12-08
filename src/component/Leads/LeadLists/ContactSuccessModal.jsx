import styles from "./ContactSuccessModal.module.css";
import Mailbtn from "../../../assets/Images/MyResponse/mail-02.svg";
import smsBtn from "../../../assets/Images/MyResponse/annotation.svg";
import phoneBtn from "../../../assets/Images/MyResponse/phone.svg";
import whatsappBtn from "../../../assets/Images/MyResponse/WhatsappBtn.svg";
import { showToast } from "../../../utils";
import { sellerResponseStatusApi } from "../../../store/LeadSetting/leadSettingSlice";
import { useDispatch, useSelector } from "react-redux";

const ContactSuccessModal = ({
  isOpen,
  onClose,
  details,
  repliesBtn,
  detail,
  requestId,
}) => {
  const dispatch = useDispatch();

  const { registerData } = useSelector((state) => state.findJobs);
  const { userToken } = useSelector((state) => state.auth);
  // const userData = userToken?.user_id ? userToken?.user_id : userToken?.id ? userToken?.id : registerData?.user_id ? registerData?.user_id : registerData?.id
  const userData =
    userToken?.user_id ||
    userToken?.id ||
    registerData?.user_id ||
    registerData?.id;

  if (!isOpen) return null;

  const formatPhoneNumber = (number) => {
    if (!number) return "";
    let clean = number.toString().replace(/\D/g, "");
    if (clean.startsWith("44")) {
      return `+${clean}`;
    } else if (clean.startsWith("0")) {
      return `+44${clean.substring(1)}`;
    } else {
      return `+44${clean}`;
    }
  };

  const handleResponseChange = (clickName) => {
    let responseStatus = {
      lead_id: null,
      seller_id: null,
      buyer_id: null,
      type: null,
      response_type: null,
    };

    if (requestId) {
      responseStatus = {
        lead_id: repliesBtn?.lead_id,
        seller_id: repliesBtn?.id,
        buyer_id: userData,
        type: null,
        response_type: "buyer",
      };
    } else {
      responseStatus = {
        lead_id: details?.id || detail?.id || repliesBtn?.lead_id,
        seller_id: userData || repliesBtn?.id,
        buyer_id:
          details?.customer_id ||
          detail?.customer_id ||
          (repliesBtn ? userToken?.id || registerData?.id : null),
        type: null,
        response_type: "seller",
      };
    }

    let url = null;
    const rawPhone = details?.phone || detail?.phone || repliesBtn?.phone || "";
    const phoneNumber = formatPhoneNumber(rawPhone);

    const email =
      details?.customer?.email || detail?.email || repliesBtn?.email || "";
    if (clickName?.name === "mobile") {
      responseStatus.type = "mobile";
      url = `tel:${phoneNumber}`;
    } else if (clickName?.name === "Whatsapp") {
      responseStatus.type = "Whatsapp";
      url = `https://wa.me/${phoneNumber}`;
    } else if (clickName?.name === "email") {
      responseStatus.type = "email";
      url = `mailto:${email}`;
    } else if (clickName?.name === "sms") {
      responseStatus.type = "sms";
      url = `sms:${phoneNumber}`;
    }

    dispatch(sellerResponseStatusApi(responseStatus)).then((result) => {
      if (result) {
        showToast("success", result?.message);
        if (url) {
          // window.open(url);
          window.location.href = url;
        }
        onClose();
      }
    });
  };

  return (
    <>
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <button className={styles.closeBtn} onClick={onClose}>
            ×
          </button>

          <h2 className={styles.title}>
            <span className={styles.excellentText}> Excellent! </span> You're
            ready
            <br />
            to contact{" "}
            {/* {repliesBtn?.name
              ? repliesBtn?.name
              : details?.customer?.name || detail?.name} */}
            {detail?.business_profile_name ||
              repliesBtn?.business_profile_name ||
              details?.customer?.name}
          </h2>

          <div className={styles.actions}>
            {[
              {
                label: "Give Them A call",
                name: "mobile",
                btn: "Call Now",
                icon: phoneBtn,
              },
              {
                label: "Send a WhatsApp",
                name: "Whatsapp",
                btn: "WhatsApp",
                icon: whatsappBtn,
              },
              {
                label: "Send an Email",
                name: "email",
                btn: "Email",
                icon: Mailbtn,
              },
              { label: "Send an SMS", name: "sms", btn: "SMS", icon: smsBtn },
            ]
              .filter((item) => !(repliesBtn && item.btn === "Send Estimate"))
              .map((item, idx) => (
                <div key={idx} className={styles.actionItem}>
                  <button
                    className={styles.actionBtn}
                    onClick={() => handleResponseChange(item)}
                  >
                    <img src={item?.icon} alt="..." width={18} height={18} />{" "}
                    {item.btn}
                  </button>
                </div>
              ))}
          </div>

          <p className={styles.skipLink} onClick={onClose}>
            Skip, I will contact them later
          </p>

          {!repliesBtn && <div className={styles.footer}></div>}
        </div>
      </div>
    </>
  );
};
export default ContactSuccessModal;
