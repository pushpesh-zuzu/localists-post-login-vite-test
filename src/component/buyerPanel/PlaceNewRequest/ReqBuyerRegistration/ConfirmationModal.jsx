"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../ReqBuyerRegistration/Modal/Modal";
// import useUserInfo from "@/utils/getUserIp";
// import { extractAllParams } from "@/utils/decodeURLParams";
// import {
//     clearSetbuyerRequestData,
//     registerQuoteCustomer,
// } from "@/lib/store/buyerslice/buyerSlice";
// import { getBarkToken } from "@/utils/CookiesHelper";
// import { clearBuyerRegisterFormData } from "@/lib/store/findjobslice";
// import Paragraph2 from "../../UI/Typography/Paragraph2";
// import { useSearchParams } from "react-router-dom";
// import { extractAllParams } from "../../../utils/decodeURLParams";
// import { clearSetbuyerRequestData,registerQuoteCustomer, } from "../../../store/Buyer/BuyerSlice";
// import { getBarkToken } from "../../../utils/getCookies";

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    cancelHeading = "Are you sure that you want to leave?",
    cancelPara = `We're asking a few questions so we can find you the right pros, and send you quotes fast and free!`,
    serviceId
}) => {


    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const { search } = useSearchParams();

    const { buyerRequest, citySerach } = useSelector((state) => state.buyer);

    // Extract URL parameters
    const urlString = typeof window !== "undefined" ? window.location.search : "";
    // const { ip, url } = useUserInfo();
    const allParams = extractAllParams(urlString || search);
    const campaignid = allParams.campaign_id || "";
    const keyword = allParams.keyword || "";
    const gclid = allParams.gclid || "";
    const msclkid = allParams.msclkid || "";
    const adgroup_id = allParams.adgroup_id;
    const platform_source = allParams.source || "";
    const campaign = allParams.campaign || "";
    const adgroup = allParams.adgroup || "";
    const matchtype = allParams.matchtype || "";
    const device = allParams.device || "";
    const loc_physical_ms = allParams.loc_physical_ms || "";
    const utm_search_term = allParams.utm_search_term || "";


    // Handle body overflow
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            window.scrollTo(0, 0);
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    const handleSubmit = async () => {
        if (!getBarkToken()) {
            setLoading(true);
            try {
                const updatedAnswers = buyerRequest?.questions || [];
                const formData = new FormData();

                formData.append("name", buyerRequest?.name || "");
                formData.append("email", buyerRequest?.email || "");
                formData.append("phone", buyerRequest?.phone || "");
                formData.append("questions", JSON.stringify(updatedAnswers));
                formData.append("service_id", buyerRequest?.service_id || serviceId || "");
                formData.append("city", citySerach || "");
                formData.append("postcode", buyerRequest?.postcode || "");
                formData.append("campaignid", campaignid || "");
                formData.append("gclid", gclid || "");
                formData.append("campaign", campaign || "");
                formData.append("adgroup", adgroup || "");
                formData.append("msclickid", msclkid || "");
                formData.append("adgroup_id", adgroup_id || "");
                formData.append("matchtype", matchtype || "");
                formData.append("device", device || "");
                formData.append("loc_physical_ms", loc_physical_ms || "");
                formData.append("utm_search_term", utm_search_term || "");
                formData.append("platform_source", platform_source);
                formData.append("keyword", keyword || "");

                formData.append("entry_url", url);
                formData.append("user_ip_address", ip);
                formData.append("form_status", "0");

                const result = await dispatch(registerQuoteCustomer(formData));

                // console.log("result", result)
                // console.log("succespayload", result?.payload?.success)
                // console.log("finish", result?.success)


                if (result?.success || result?.payload?.success) {
                    // Clear local storage
                    if (typeof window !== "undefined") {
                        localStorage.removeItem("barkToken");
                        localStorage.removeItem("barkUserToken");
                        localStorage.removeItem("registerDataToken");
                        localStorage.removeItem("registerTokens");
                        localStorage.removeItem("createRequestToken");
                    }

                    // clearAuthData();
                    dispatch(clearSetbuyerRequestData());
                    dispatch(clearBuyerRegisterFormData());

                    onConfirm?.();
                }
            } catch (error) {
                console.error("Error in confirmation modal:", error);
            } finally {
                setLoading(false);
            }
        } else {
            onConfirm?.();
        }
    };

    if (!isOpen) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            showButtons={true}
            radius="rounded-[20px]"
            zIndex="z-[1000005]"
            usePortal={true}   // THIS IS THE KEY
            title={cancelHeading}
            maxWidth="max-w-[90%] md:max-w-[80%] lg:max-w-[760px]"
            maxHeight="max-h-[80vh] lg:max-h-[90vh]"
            padding="pb-[20px] md:pb-[30px] lg:pb-[30px]"
            fixedHeight={true}
            titleClassName="text-center"
            onNext={() => handleSubmit()}
            onBack={onClose}
            buttongroup="lg:mx-[75.4px] md:mx-[63px] mx-[18px]"
            nextButtonText={loading ? "Leaving..." : "Leave"}
            disabled={loading}
        >
            <div className="mx-auto max-w-[90%] md:max-w-[80%] lg:max-w-[608px] text-center">
                {/* Description */}
                {/* <Paragraph2 className="text-base font-medium text-[#253238]">{cancelPara}</Paragraph2> */}
            </div>
        </Modal>
    );
};

export default ConfirmationModal;
