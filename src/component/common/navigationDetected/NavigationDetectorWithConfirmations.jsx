import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { extractAllParams } from "../../../utils/decodeURLParams";
import { useLocation } from "react-router";
import { registerQuoteCustomer } from "../../../store/Buyer/BuyerSlice";
import useUserInfo from "../../../utils/getUserIp";

const NavigationDetectorWithConfirmations = () => {
  const dispatch = useDispatch();
  const userToken = useSelector((state) => state.auth.userToken);
  const { buyerRequest, citySerach } = useSelector((state) => state.buyer);
  const { search } = useLocation();
  const allParams = extractAllParams(search || window.location.search);

  const campaignid = allParams.gad_campaignid || "";
  const keyword = allParams.keyword || "";
  const gclid = allParams.gclid || "";
  const campaign = allParams.utm_campaign || "";
  const adGroup = allParams.AgId || "";
  const targetID = allParams.utm_term || "";
  const msclickid = allParams.utm_msclkid || "";
  const utm_source = allParams.utm_source || "";
  const { ip, url } = useUserInfo();

  const latestData = useRef({
    userToken,
    buyerRequest,
    citySerach,
  });

  useEffect(() => {
    latestData.current = { userToken, buyerRequest, citySerach };
  }, [userToken, buyerRequest, citySerach]);

  const hasSent = useRef(false);

  const submitFormData = () => {
    const { userToken, buyerRequest, citySerach } = latestData.current;
    if (hasSent.current || userToken) return;
    hasSent.current = true;

    const updatedAnswers = Array.isArray(buyerRequest?.questions)
      ? buyerRequest.questions.filter(Boolean) // remove undefined/null items
      : [];

    const hasQuestionNo = updatedAnswers.some(
      (q) => q && typeof q === "object" && "question_no" in q
    );

    const answersToSend = hasQuestionNo
      ? updatedAnswers.map((q) => {
          if (!q || typeof q !== "object") return q;
          const { question_no, ...rest } = q;
          return rest;
        })
      : updatedAnswers;
    const formData = new FormData();
    const isEverythingEmpty =
      !buyerRequest?.name?.trim() &&
      !buyerRequest?.email?.trim() &&
      !buyerRequest?.phone?.trim() &&
      !buyerRequest?.postcode?.trim() &&
      buyerRequest.questions.length === 0;

    if (isEverythingEmpty) {
      return;
    }

    formData.append("name", buyerRequest?.name);
    formData.append("email", buyerRequest?.email);
    formData.append("phone", buyerRequest?.phone);
    formData.append("questions", JSON.stringify(answersToSend));
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
    formData.append("entry_url", buyerRequest.url || "");
    formData.append("user_ip_address", buyerRequest.ip || "");

    dispatch(registerQuoteCustomer(formData))
      .then(() => {
        localStorage.removeItem("barkToken");
        localStorage.removeItem("barkUserToken");
        localStorage.removeItem("registerDataToken");
        localStorage.removeItem("registerTokens");
        localStorage.removeItem("createRequestToken");
      })
      .catch((error) => {
        console.error("❌ API Call failed:", error);
      });
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (hasSent.current) return;
      submitFormData();
      hasSent.current = true;
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("pagehide", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleBeforeUnload);
    window.addEventListener("blur", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("pagehide", handleBeforeUnload);
      window.removeEventListener("visibilitychange", handleBeforeUnload);
      window.removeEventListener("blur", handleBeforeUnload);
    };
  }, []);
  return null;
};

export default NavigationDetectorWithConfirmations;
