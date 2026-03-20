import React, { useEffect, useRef, useState, useMemo, } from "react";
import { useSelector, useDispatch } from "react-redux";
import ServiceDoYouNeed from "./ServiceDoYouNeed/ServiceDoYouNeed";
import ViewPhoneNumber from "./ViewPhoneNumber/ViewPhoneNumber";
import QuestionModal from "./QuestionModal/QuestionModal";
import DescribeYourRequestModal from "./DescribeYourRequest/DescribeYourRequestModal";
import SeeMyMatchesModal from "./SeeMyMatches/SeeMyMatchesModal";
import { setBuyerStep, getAutoBid, setbuyerRequestData } from "../../../../store/Buyer/BuyerSlice";
// import { getBarkToken } from "../../../../utils/getCookies";

function ReqBuyerRegistration({
    onClose,
    cancelHeading,
    cancelPara,
    setSelectedService = () => { },
    setFromImageModal = () => { },
    service_Id,
    serviceName,
}) {
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const questionModalRef = useRef();
    const hasFetched = useRef(false);

    // const [resetEmailFormTrigger, setResetEmailFormTrigger] = useState(false);
    // const [resetServiceFormTrigger, setResetServiceFormTrigger] = useState(false);
    // const [resetQaFormTrigger, setResetQasFormTrigger] = useState(false);
    const [shouldClose, setShouldClose] = useState(false);
    const [getServiceState, setGetServiceState] = useState(null);
    const [questionIndex, setQuestionIndex] = useState(0);

    const dispatch = useDispatch();

    const { buyerStep, questionanswerData, questionLoader, buyerRequest, requestId,
        requestUserId, autoBidData } =
        useSelector((state) => state.buyer || {});

    const serviceData = autoBidData?.[0];
    const sellers = serviceData?.sellers || [];
    const hasSellers = sellers.length > 0;

    const stepFlow = useMemo(() => {
        return hasSellers
            ? [1, 2, 3, 4, 5]
            : [1, 2, 3, 4];
    }, [hasSellers]);

    const nextStep = () => {
        const currentIndex = stepFlow.indexOf(buyerStep);
        if (currentIndex < stepFlow.length - 1) {
            dispatch(setBuyerStep(stepFlow[currentIndex + 1]));
        }
    };

    useEffect(() => {
        if (!service_Id) return;

        if (buyerRequest?.service_id !== service_Id) {
            dispatch(
                setbuyerRequestData({ service_id: service_Id })
            );
        }
    }, [service_Id, buyerRequest?.service_id, dispatch]);

    const previousStep = () => {
        const currentIndex = stepFlow.indexOf(buyerStep);
        if (currentIndex > 0) {
            dispatch(setBuyerStep(stepFlow[currentIndex - 1]));
        }
    };
    const getService = (service) => {
        setGetServiceState(service);
    };

    useEffect(() => {
        const pendingModal = JSON.parse(localStorage.getItem("pendingBuyerModal"));
        if (pendingModal?.shouldOpen) {
            localStorage.removeItem("pendingBuyerModal");
        } else {
            const initialStep = 1
            dispatch(setBuyerStep(initialStep));
        }
    }, [dispatch]);

    useEffect(() => {
        if (shouldClose) {
            dispatch(setBuyerStep(1));
            onClose?.();
        }
    }, [shouldClose]);

    if (!buyerStep) return null;

    useEffect(() => {
        if (buyerStep === 2 && questionModalRef.current) {
            questionModalRef.current.resetQuestions?.();
        }
    }, [buyerStep]);

    // const confirmClose = () => {
    //     setShowConfirmModal(false);
    //     setShouldClose(true);
    //     setResetEmailFormTrigger(true);
    //     setResetServiceFormTrigger(true);
    //     setResetQasFormTrigger(true);
    //     onClose?.();
    // };
    const handleClose = () => {
        if (typeof setSelectedService === "function") setSelectedService(null);
        if (typeof setFromImageModal === "function") setFromImageModal(false);
        if (typeof onClose === "function") onClose?.();
    };

    const totalQuestions = questionanswerData?.length || 0;

    const baseSteps = stepFlow.length;

    const totalSteps =
        totalQuestions > 0
            ? baseSteps - 1 + totalQuestions
            : baseSteps;

    // console.log("totalSteps", totalSteps, baseSteps, stepFlow)

    let currentPosition = 0;

    const stepIndex = stepFlow.indexOf(buyerStep);

    if (buyerStep === 2 && totalQuestions > 0) {
        const baseIndex = stepFlow.indexOf(2);
        currentPosition = baseIndex + questionIndex + 1;
    } else if (totalQuestions > 0 && stepIndex > stepFlow.indexOf(2)) {
        currentPosition = stepIndex + totalQuestions;
    } else {
        currentPosition = stepIndex + 1;
    }

    let progressPercent = Math.round(
        (currentPosition / totalSteps) * 100
    );

    if (buyerStep === 1) {
        progressPercent = Math.max(progressPercent, 10);
    }

    if (stepIndex === stepFlow.length - 1) {
        progressPercent = 100;
    }

    // Call API once
    useEffect(() => {
        if (!hasFetched.current && requestId && requestUserId) {
            dispatch(
                getAutoBid({
                    user_id: requestUserId,
                    lead_id: requestId,
                })
            );
            hasFetched.current = true;
        }
    }, [dispatch, requestId, requestUserId]);

    return (
        <>
            {buyerStep === 1 && (
                <ServiceDoYouNeed
                    nextStep={nextStep}
                    previousStep={previousStep}
                    onClose={handleClose}
                    formData={buyerRequest}
                    setShowConfirmModal={setShowConfirmModal}
                    serviceId={getServiceState?.id || service_Id}
                    serviceName={getServiceState?.name || serviceName}
                    progressPercent={progressPercent}
                    getService={getService}
                />
            )}
            {buyerStep === 2 && (
                <QuestionModal
                    ref={questionModalRef}
                    questions={questionanswerData}
                    serviceName={getServiceState?.name || serviceName}
                    serviceId={getServiceState?.id || service_Id}
                    nextStep={nextStep}
                    previousStep={previousStep}
                    onClose={handleClose}
                    loading={questionLoader}
                    setShowConfirmModal={setShowConfirmModal}
                    formData={buyerRequest}
                    onQuestionChange={setQuestionIndex}
                    progressPercent={progressPercent}
                />
            )}

            {buyerStep === 3 && (
                <ViewPhoneNumber
                    nextStep={nextStep}
                    previousStep={previousStep}
                    onClose={handleClose}
                    formData={buyerRequest}
                    progressPercent={progressPercent}
                />
            )}

            {buyerStep === 4 && (
                <DescribeYourRequestModal
                    nextStep={nextStep}
                    previousStep={previousStep}
                    onClose={handleClose}
                    setShowConfirmModal={setShowConfirmModal}
                    progressPercent={progressPercent}
                    sellers={sellers}
                />
            )}

            {buyerStep === 5 && hasSellers && (
                <SeeMyMatchesModal
                    onClose={handleClose}
                    nextStep={nextStep}
                    previousStep={previousStep}
                    setShowConfirmModal={setShowConfirmModal}
                    progressPercent={progressPercent}
                />
            )}

            {/* {showConfirmModal && (
                <ConfirmationModal
                    isOpen={showConfirmModal}
                    cancelHeading={cancelHeading}
                    cancelPara={cancelPara}
                    onConfirm={confirmClose}
                    serviceId={service_Id}
                    onClose={() => setShowConfirmModal(false)}
                />
            )} */}
        </>
    );
}

export default ReqBuyerRegistration;