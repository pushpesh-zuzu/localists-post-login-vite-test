import { useEffect, useState, useRef } from "react";
import styles from "./BuyerRegistration.module.css";
import WhatServiceYouNeed from "./WhatServiceYouNeed/WhatServiceYouNeed";
import QuestionModal from "../../../common/questionModal/QuestionModal";
import { useDispatch, useSelector } from "react-redux";
import { setBuyerStep } from "../../../../store/Buyer/BuyerSlice";
import ViewYourMatches from "./ViewYourMatches/ViewYourMatches";
import DescribeYourRequest from "./DescribeYourRequest/DescribeYourRequest";
import EmailMatch from "./EmailMatch/EmailMatch";
import BidsList from "./BidsList/BidsList";
import ConfirmationModal from "../../../common/ConfirmationModal/ConfirmationModal";
import OtpVerification from "./OtpVerification/OtpVerification";
import NumberVerifiedModal from "./NumberVerified/NumberVerified";
import ReEnterMobileNumber from "../../../common/ReEnterMobileNumber/ReEnterMobileNumber";
import { getBarkToken } from "../../../../utils/getCookies";

const BuyerRegistration = ({
  closeModal,
  postcode,
  city,
  postalCodeValidate,
  cancelHeading,
  cancelPara,
  setSelectedService = () => {},
  setFromImageModal = () => {},
  service_Id,
  service_Name,
  serviceName
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const questionModalRef = useRef();

  const [resetEmailFormTrigger, setResetEmailFormTrigger] = useState(false);
  const [resetServiceFormTrigger, setResetServiceFormTrigger] = useState(false);
  const [resetQaFormTrigger, setResetQasFormTrigger] = useState(false);
  const [shouldClose, setShouldClose] = useState(false);
  const [getServiceState, setGetServiceState] = useState(null);
  const [email, setEmails] = useState("");
  const [reEnterMobile, setReEnterMobile] = useState(2);
  const dispatch = useDispatch();
  const { questionanswerData, questionLoader, buyerRequest, buyerStep } =
    useSelector((state) => state.buyer);

  const { userToken } = useSelector((state) => state.auth);
  const { authToken } = useSelector((state) => state.findJobs);
  const isAdminOrRemembered = authToken || userToken?.remember_tokens || getBarkToken();

  const stepFlow = isAdminOrRemembered
    ? [2, 3, 6, 7, 8]
    : [1, 2, 3, 4, 5, 7, 8];

  const nextStep = () => {
    const currentIndex = stepFlow.indexOf(buyerStep);
    if (currentIndex < stepFlow.length - 1) {
      dispatch(setBuyerStep(stepFlow[currentIndex + 1]));
    }
  };

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
      const initialStep = isAdminOrRemembered ? 2 : 1;
      dispatch(setBuyerStep(initialStep));
    }
  }, [dispatch, isAdminOrRemembered]);
  useEffect(() => {
    if (buyerStep) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [buyerStep]);

  useEffect(() => {
    if (shouldClose) {
      dispatch(setBuyerStep(1));
      closeModal();
    }
  }, [shouldClose]);

  const handleClose = () => {
    if (typeof setSelectedService === "function") setSelectedService(null);
    if (typeof setFromImageModal === "function") setFromImageModal(false);
    if (typeof closeModal === "function") closeModal();
  };

  useEffect(() => {
    if (buyerStep === 2) {
      questionModalRef.current?.resetQuestions?.();
    }
  }, [buyerStep]);
  const confirmClose = () => {
    setShowConfirmModal(false);
    setShouldClose(true);
    setResetEmailFormTrigger(true);
    setResetServiceFormTrigger(true);
    setResetQasFormTrigger(true);
    closeModal();
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        {buyerStep === 1 && (
          <EmailMatch
            nextStep={nextStep}
            previousStep={previousStep}
            onClose={handleClose}
            formData={buyerRequest}
            setEmails={setEmails}
            setShowConfirmModal={setShowConfirmModal}
            resetTrigger={resetEmailFormTrigger}
          />
        )}
        {buyerStep === 2 && (
          <WhatServiceYouNeed
            nextStep={nextStep}
            formData={buyerRequest}
            serviceId={getServiceState?.id || service_Id}
            serviceName={getServiceState?.name || service_Name || serviceName}
            onClose={handleClose}
            pincodes={postcode}
            setShowConfirmModal={setShowConfirmModal}
            postalCodeIsValidate={postalCodeValidate}
            resetServiceTrigger={resetServiceFormTrigger}
            getService={getService}
          />
        )}

        {buyerStep === 3 && (
          <QuestionModal
            ref={questionModalRef}
            questions={questionanswerData}
            serviceName={getServiceState?.name || service_Name}
            nextStep={nextStep}
            previousStep={previousStep}
            onClose={handleClose}
            loading={questionLoader}
            setShowConfirmModal={setShowConfirmModal}
            formData={buyerRequest}
            resetQaTrigger={resetQaFormTrigger}
            setResetQasFormTrigger={setResetQasFormTrigger}
          />
        )}

        {buyerStep === 4 && reEnterMobile === 2 && (
          <OtpVerification
            nextStep={nextStep}
            previousStep={previousStep}
            formData={buyerRequest}
            open={true}
            city={city}
            isThankuPageOnlyShow={true}
            setReEnterMobile={setReEnterMobile}
          />
        )}
        {reEnterMobile === 1 && (
          <ReEnterMobileNumber
            setReEnterMobile={setReEnterMobile}
            onClose={() => setReEnterMobile(2)}
          />
        )}
        {buyerStep === 5 && (
          <NumberVerifiedModal
            nextStep={nextStep}
            previousStep={previousStep}
            open={true}
            setShowConfirmModal={setShowConfirmModal}
          />
        )}
        {buyerStep === 6 && (
          <ViewYourMatches
            nextStep={nextStep}
            previousStep={previousStep}
            onClose={handleClose}
            formData={buyerRequest}
          />
        )}
        {buyerStep === 7 && (
          <DescribeYourRequest
            nextStep={nextStep}
            onClose={handleClose}
            setShowConfirmModal={setShowConfirmModal}
          />
        )}

        {buyerStep === 8 && (
          <BidsList
            nextStep={nextStep}
            previousStep={previousStep}
            onClose={handleClose}
          />
        )}

        {showConfirmModal && (
          <ConfirmationModal
            cancelHeading={cancelHeading}
            cancelPara={cancelPara}
            onConfirm={confirmClose}
            onCancel={() => setShowConfirmModal(false)}
            setShowConfirmModal={setShowConfirmModal}
          />
        )}
      </div>
    </div>
  );
};

export default BuyerRegistration;
