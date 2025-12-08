import { useEffect, useState } from "react";
import styles from "./ConfirmationModal.module.css";
import { useDispatch, useSelector } from "react-redux";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useLocation, useParams } from "react-router-dom";
import { registerQuoteCustomer } from "../../../store/Buyer/BuyerSlice";
import { clearAuthData } from "../../../utils";
import { extractAllParams } from "../../../utils/decodeURLParams";
import useUserInfo from "../../../utils/getUserIp";
// import { showToast } from "../../../../../utils";

const ConfirmationModal = ({
  onCancel,
  formData,
  onConfirm,
  cancelHeading = "Are you sure that you want to leave?",
  cancelPara = `We're asking a few questions so we can find you the right pros, and
          send you quotes fast and free!`,
}) => {
  const [Input, setInput] = useState("");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  const item = useParams();
  const dispatch = useDispatch();
  const { buyerRequest, requestLoader, citySerach } = useSelector(
    (state) => state.buyer
  );
  const { userToken } = useSelector((state) => state.auth);
  const { selectedServices } = useSelector((state) => state.findJobs);
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (Input.trim() !== "") {
        dispatch(
          searchService({
            search: Input,
            serviceid: formData?.service_id.toString(),
          })
        );
      }
    }, 500);

    return () => {
      clearTimeout(delayDebounce);
    };
  }, [Input, dispatch]);

  const validateForm = () => {
    let newErrors = {};

    if (!formData.miles2) {
      newErrors.miles2 = "Please select a distance range.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  useEffect(() => {
    if (selectedServices.length > 0) {
      setErrors((prev) => ({ ...prev, service_id: undefined }));
    }
  }, [selectedServices]);

  useEffect(() => {
    if (show) {
      window.scroll(0, 0);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [show]);
  const { search } = useLocation();
  const allParams = extractAllParams(search || window.location.search);
  const { ip, url } = useUserInfo();

  const campaignid = allParams.gad_campaignid || "";
  const keyword = allParams.keyword || "";
  const gclid = allParams.gclid || "";
  const campaign = allParams.utm_campaign || "";
  const adGroup = allParams.AgId || "";
  const targetID = allParams.utm_term || "";
  const msclickid = allParams.utm_msclkid || "";
  const utm_source = allParams.utm_source || "";

  const handleSubmit = () => {
    if (!userToken) {
      const updatedAnswers = buyerRequest?.questions || [];
      const formData = new FormData();
      formData.append("name", buyerRequest?.name);
      formData.append("email", buyerRequest?.email);
      formData.append("phone", buyerRequest?.phone);
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
      formData.append("entry_url", url);
      formData.append("user_ip_address ", ip);
      formData.append("form_status", 0);

      dispatch(registerQuoteCustomer(formData)).then((result) => {
        if (result) {
          localStorage.removeItem("barkToken");
          localStorage.removeItem("barkUserToken");
          localStorage.removeItem("registerDataToken");
          localStorage.removeItem("registerTokens");
          localStorage.removeItem("createRequestToken");
          clearAuthData();
          onConfirm();
        }
      });
    } else {
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2 className={styles.heading}>{cancelHeading}</h2>
        <p className={styles.description}>{cancelPara}</p>
        <div className={styles.buttonGroup}>
          <button
            className={styles.backButton}
            onClick={onCancel}
            disabled={requestLoader}
          >
            Back
          </button>
          <button className={styles.continueButton} onClick={handleSubmit}>
            {requestLoader ? (
              <Spin
                indicator={<LoadingOutlined spin style={{ color: "white" }} />}
              />
            ) : (
              "Leave"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
