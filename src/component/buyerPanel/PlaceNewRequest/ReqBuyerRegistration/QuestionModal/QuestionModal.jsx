import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./QuestionModal.module.css";
import useUserInfo from "../../../../../utils/getUserIp";
import Modal from ".././Modal/Modal";
import QuestionOptionsBox from "./QuestionOptionsBox";
import {
    setbuyerRequestData,
    clearSetbuyerRequestData,
    registerQuoteCustomer,
    setBuyerStep,
} from "../../../../../store/Buyer/BuyerSlice";
import { Spin } from "antd";
import { extractAllParams } from "../../../../../utils/decodeURLParams";
import { getBarkToken } from "../../../../../utils/getCookies";
import { clearBuyerRegisterFormData } from "../../../../../store/FindJobs/findJobSlice";
import InputField from "../UI/InputField";
// import { LoadingOutlined } from "@ant-design/icons";
import { useLocation } from "react-router";

const QuestionModal = ({
    questions = [],
    serviceName,
    serviceId,
    onClose,
    nextStep,
    previousStep,
    loading = false,
    setShowConfirmModal,
    isStartWithQuestionModal = false,
    onQuestionChange,
    progressPercent,
}) => {
    const dispatch = useDispatch();
    const { buyerStep, buyerRequest, requestLoader, citySerach, questionanswerData } =
        useSelector((state) => state.buyer);
    const { userToken, adminToken } = useSelector((state) => state.auth);
    const { service, registerData } = useSelector((state) => state.findJobs);
    const { ip, url } = useUserInfo();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState([]);
    const [otherText, setOtherText] = useState("");
    const [error, setError] = useState("");
    const [questionHistory, setQuestionHistory] = useState([0]);

    // Get URL params
    const { search } = useLocation();
    const allParams =
        typeof window !== "undefined" &&
        extractAllParams(search || window.location.search);
    const campaignid = allParams.campaign_id || "";
    const keyword = allParams.keyword || "";
    const gclid = allParams.gclid || "";
    const campaign = allParams.campaign || "";
    const adgroup = allParams.adgroup || "";
    const targetID = allParams.targetID || "";
    const msclickid = allParams.msclickid || "";
    const utm_source = allParams.utm_source || "";

    useEffect(() => {
        if (questions.length > 0 && currentQuestion === -1) {
            setCurrentQuestion(0);
        }
    }, [questions, currentQuestion]);

    useEffect(() => {
        if (onQuestionChange) {
            onQuestionChange(currentQuestion);
        }
    }, [currentQuestion]);

    useEffect(() => {
        if (questions.length > 0 && buyerRequest?.questions?.length > 0) {
            const savedAnswer = buyerRequest.questions[currentQuestion]?.ans || [];

            const savedArray =
                typeof savedAnswer === "string"
                    ? savedAnswer.split(",").map((a) => a.trim())
                    : savedAnswer;

            setSelectedOption(savedArray);
            const otherVal = savedArray.find(
                (ans) =>
                    ans.toLowerCase() !== "yes" &&
                    ans.toLowerCase() !== "no" &&
                    ans.toLowerCase() !== "maybe"
            );
            setOtherText(
                savedArray.includes("Something else (please describe)")
                    ? otherVal || ""
                    : ""
            );
        }
    }, [currentQuestion, buyerRequest, questions]);

    useEffect(() => {
        setSelectedOption([]);
        setOtherText("");
    }, [currentQuestion]);

    const totalQuestions = questions?.length;

    const formattedQuestions = questions.map((q) => ({
        ...q,
        parsedAnswers: Array.isArray(q.answer)
            ? q.answer
            : (() => {
                try {
                    return JSON.parse(q.answer);
                } catch (e) {
                    return [];
                }
            })(),
    }));

    const questionIndexMap = {};
    formattedQuestions.forEach((q, index) => {
        questionIndexMap[q.question_no] = index;
    });

    const handleNext = (directValue = null) => {
        const finalSelection = directValue ? [directValue] : selectedOption;

        if (finalSelection.length === 0) {
            setError("Please select at least one option.");
            return;
        }

        if (
            finalSelection.includes("Something else (please describe)") &&
            (!otherText.trim() ||
                otherText.trim().toLowerCase() ===
                "something else (please describe)")
        ) {
            setError("Please enter a value for 'Other' option.");
            return;
        }

        const finalAnswer = finalSelection.map((opt) =>
            opt.toLowerCase() === "something else (please describe)"
                ? otherText
                : opt
        );

        const updatedAnswer = {
            ques: questions[currentQuestion]?.questions,
            ans: finalAnswer.join(", "),
        };

        const previousAnswers = buyerRequest?.questions || [];

        const existingIndex = previousAnswers.findIndex(
            (item) => item?.ques === updatedAnswer.ques
        );

        let updatedAnswers;
        if (existingIndex !== -1) {
            updatedAnswers = [...previousAnswers];
            updatedAnswers[existingIndex] = updatedAnswer;
        } else {
            updatedAnswers = [...previousAnswers, updatedAnswer];
        }

        dispatch(setbuyerRequestData({ questions: updatedAnswers }));

        const selectedObj =
            formattedQuestions[currentQuestion]?.parsedAnswers.find(
                (a) => a.option === finalSelection[0]
            );

        const nextQ = selectedObj?.next_question;

        if (nextQ === "last") {
            if (isStartWithQuestionModal) {
                dispatch(
                    setbuyerRequestData({
                        service_id: serviceId || service?.id || buyerRequest?.service_id,
                        serviceName: serviceName || buyerRequest?.serviceName,
                        postcode: buyerRequest?.postcode,
                        city: citySerach,
                        questions: updatedAnswers,
                    })
                );
                nextStep();
            } else if (adminToken || registerData?.remember_tokens || getBarkToken()) {
                nextStep();
            } else {
                const formData = new FormData();
                formData.append("name", buyerRequest?.name);
                formData.append("email", buyerRequest?.email);
                formData.append("phone", buyerRequest?.phone);
                formData.append("questions", JSON.stringify(updatedAnswers));
                formData.append("service_id", buyerRequest?.service_id || serviceId || "");
                formData?.append("city", citySerach);
                formData.append("postcode", buyerRequest?.postcode);
                formData.append("form_status", "1");
                formData.append("campaignid", campaignid || "");
                formData.append("gclid", gclid || "");
                formData.append("campaign", campaign || "");
                formData.append("adgroup", adgroup || "");
                formData.append("targetid", targetID || "");
                formData.append("msclickid", msclickid || "");
                formData.append("utm_source", utm_source || "");
                formData.append("keyword", keyword || "");
                formData.append("entry_url", url);
                formData.append("user_ip_address ", ip);

                dispatch(registerQuoteCustomer(formData)).then((result) => {
                    if (result) {
                        nextStep();
                    }
                });
            }
        } else if (nextQ && questionIndexMap[nextQ] !== undefined) {
            setQuestionHistory((prev) => [...prev, questionIndexMap[nextQ]]);
            setCurrentQuestion(questionIndexMap[nextQ]);
        } else {
            if (currentQuestion < totalQuestions - 1) {
                setQuestionHistory((prev) => [...prev, currentQuestion + 1]);
                setCurrentQuestion(currentQuestion + 1);
            } else {
                nextStep();
            }
        }

        setSelectedOption([]);
        setOtherText("");
        setError("");
    };

    const handleBack = () => {
        setError("");
        if (currentQuestion === 0) {
            dispatch(setbuyerRequestData({ questions: [] }));

            setCurrentQuestion(0);
            setQuestionHistory([0]);
            setSelectedOption([]);
            setOtherText("");

            previousStep();
            return;
        }
        if (questionHistory.length > 1) {
            const newHistory = [...questionHistory];
            newHistory.pop();
            const prevIndex = newHistory[newHistory.length - 1];

            const questionText = formattedQuestions[prevIndex]?.questions;

            const indexInAnswers = buyerRequest?.questions?.findIndex(
                (q) => q?.ques === questionText
            );

            if (indexInAnswers !== -1) {
                const updatedAnswers = buyerRequest.questions.slice(0, indexInAnswers);
                dispatch(setbuyerRequestData({ questions: updatedAnswers }));
            }

            setQuestionHistory(newHistory);
            setCurrentQuestion(prevIndex);
        } else {
            previousStep();
        }
    };

    const handleCloseClick = () => {
        if (questionanswerData?.length === 0) {
            onClose?.();
            dispatch(clearSetbuyerRequestData());
            dispatch(clearBuyerRegisterFormData());
        } else {
            if (!userToken?.remember_tokens && !registerData?.remember_tokens || !getBarkToken()) {
                setShowConfirmModal(true);
            } else {
                onClose?.();
                dispatch(clearSetbuyerRequestData());
                dispatch(clearBuyerRegisterFormData());
            }
        }
    };

    return (
        <Modal
            isOpen={true}
            onClose={handleCloseClick}
            title={formattedQuestions[currentQuestion]?.questions}
            onNext={() => handleNext()}
            onBack={handleBack}
            buyerStep={buyerStep}
            fixedHeight={true}
            showProgressBar={true}
            showButtons={true}
            progressPercent={progressPercent}
            overlayClassName={styles.overlay}
            containerClassName={styles.container}
            buttonGroupClassName={styles.buttonGroup}
            titleClassName={styles.titleCenter}
            disabled={requestLoader}
        >
            <div className={styles.contentBox}>
                {loading ? (
                    <div className={styles.loaderWrapper}>
                        <Spin size="large" />
                    </div>
                ) : questions.length > 0 ? (
                    <>
                        <div className={styles.optionsGrid}>
                            {formattedQuestions[currentQuestion]?.parsedAnswers.map(
                                (opt, index) => {
                                    const optionType =
                                        formattedQuestions[currentQuestion]?.option_type;
                                    const isSingle = optionType === "single";
                                    const isSelected = selectedOption.includes(opt.option);

                                    const handleSelect = () => {
                                        if (isSingle) {
                                            setSelectedOption([opt.option]);
                                            setError("");
                                            handleNext(opt.option);
                                        } else {
                                            setSelectedOption((prev) =>
                                                prev.includes(opt.option)
                                                    ? prev.filter((o) => o !== opt.option)
                                                    : [...prev, opt.option]
                                            );
                                            setError("");
                                        }
                                    };

                                    return (
                                        <div key={index}>
                                            <QuestionOptionsBox
                                                label={opt.option}
                                                isSelected={isSelected}
                                                onSelect={handleSelect}
                                            />
                                        </div>
                                    );
                                }
                            )}
                        </div>

                        {formattedQuestions[currentQuestion]?.parsedAnswers.some(
                            (opt) => opt.option === "Something else (please describe)"
                        ) &&
                            selectedOption.includes("Something else (please describe)") && (
                                <div className={styles.otherInputWrapper}
                                    style={{ marginBottom: error ? "0px" : "20px" }}>
                                    <InputField
                                        placeholder="Please Enter..."
                                        value={otherText}
                                        onChange={(e) => {
                                            setOtherText(e.target.value);
                                            setError("");
                                        }}
                                    />
                                </div>
                            )}
                        {error && (
                            <p className={styles.validationError}>{error}</p>
                        )}
                    </>
                ) : (
                    <div className={styles.emptyState}>
                        <h2>No questions available</h2>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default QuestionModal;