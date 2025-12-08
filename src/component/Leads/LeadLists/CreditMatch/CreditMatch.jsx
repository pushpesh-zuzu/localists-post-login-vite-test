import { useEffect, useRef, useState } from "react";
import styles from "./CreditMatch.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getCreditPlanList,
  totalCreditData,
} from "../../../../store/LeadSetting/leadSettingSlice";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../../../utils";
import AddCardModal from "../../../MyCredit/MyPaymentDetails/AddCardModal";
import CheckCircle from "../../../../assets/Icons/CheckCircle.svg";

const CreditMatch = () => {
  const [autoTopUp, setAutoTopUp] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const buyCreditLoader = useSelector(
    (state) => state.myCredit.buyCreditLoader
  );
  const { userToken } = useSelector((state) => state.auth);
  const { registerData } = useSelector((state) => state.findJobs);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { creditPlanList, leadRequestList, totalCredit } = useSelector(
    (state) => state.leadSetting
  );
  const handleBuyNow = (item) => {
    navigate("/settings/billing/my-credits");
  };
  const filterData = creditPlanList?.filter((item, index) => index === 0);
  const leadTotalCredit = leadRequestList?.filter((item, index) => index === 0);

  useEffect(() => {
    dispatch(getCreditPlanList());

    const data = {
      user_id: userToken?.remember_tokens
        ? userToken?.remember_tokens
        : registerData?.remember_tokens,
    };
    dispatch(totalCreditData(data));
  }, [dispatch]);

  const triggerRef = useRef(null);
  const stickyRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.boundingClientRect.top <= 0) {
          stickyRef.current.classList.add(styles.fixedTop);
        } else {
          stickyRef.current.classList.remove(styles.fixedTop);
        }
      },
      {
        root: null,
        threshold: 0,
      }
    );

    const trigger = triggerRef.current;
    if (trigger) observer.observe(trigger);

    return () => {
      if (trigger) observer.unobserve(trigger);
    };
  }, []);

  return (
    <>
      {filterData?.length > 0 && (
        <>
          <div className={styles._container}>
            <h2 className={styles._heading}>
              AI-Verified Leads.{" "}
              <span className={styles._highlight}>No Subscriptions.</span> Win
              new jobs today.
            </h2>

            <div className={styles._featuresWrapper}>
              <div className={styles._featureItem}>
                <img src={CheckCircle} alt="check" className={styles._icon} />
                <span>Browse AI verified leads for free</span>
              </div>

              <div className={styles._divider}></div>

              <div className={styles._featureItem}>
                <img src={CheckCircle} alt="check" className={styles._icon} />
                <span>Only pay when you connect</span>
              </div>

              <div className={styles._divider}></div>

              <div className={styles._featureItem}>
                <img src={CheckCircle} alt="check" className={styles._icon} />
                <span>Buy credits anytime — zero commitments</span>
              </div>

              <div className={styles._divider}></div>

              <div className={styles._featureItem}>
                <img src={CheckCircle} alt="check" className={styles._icon} />
                <span>Buy credits and win jobs now</span>
              </div>
            </div>

            <button
              className={styles._buyBtn}
              onClick={() => handleBuyNow(filterData[0])}
            >
              Buy Credits
            </button>
          </div>
        </>
      )}

      <div>
        <div className={styles.creditMatchContainer}>
          <div ref={triggerRef} style={{ height: "1px" }}></div>

          <div
            ref={stickyRef}
            className={styles.creditsLeftContainer}
            onClick={() => handleBuyNow()}
          >
            <button className={styles.creditsButton}>
              You have {totalCredit?.total_credit ?? "0"} Credits Left
            </button>
          </div>
        </div>
      </div>

      {buyCreditLoader && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            color: "#fff",
            fontSize: "1.2rem",
          }}
        >
          <div style={{ marginTop: "25vh", textAlign: "center" }}>
            <svg
              className={styles.gearSpinner}
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 100 100"
              fill="white"
            >
              <path d="M94 56.5v-13l-10.6-2.3c-.8-2.7-2-5.2-3.5-7.6l5.8-9.3-9.2-9.2-9.3 5.8c-2.4-1.5-5-2.7-7.6-3.5L56.5 6h-13l-2.3 10.6c-2.7.8-5.2 2-7.6 3.5l-9.3-5.8-9.2 9.2 5.8 9.3c-1.5 2.4-2.7 5-3.5 7.6L6 43.5v13l10.6 2.3c.8 2.7 2 5.2 3.5 7.6l-5.8 9.3 9.2 9.2 9.3-5.8c2.4 1.5 5 2.7 7.6 3.5L43.5 94h13l2.3-10.6c2.7-.8 5.2-2 7.6-3.5l9.3 5.8 9.2-9.2-5.8-9.3c1.5-2.4 2.7-5 3.5-7.6L94 56.5zM50 65a15 15 0 1 1 0-30 15 15 0 0 1 0 30z" />
            </svg>

            <p>Processing Payment...</p>
          </div>
        </div>
      )}

      {isAddModalOpen && (
        <AddCardModal
          onClose={() => setIsAddModalOpen(false)}
          newLeadApi={true}
          newLeadData={filterData}
          noLeadApiCall={true}
          onPaymentSuccess={() => {
            showToast("success", "Payment completed successfully!");
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          }}
        />
      )}
    </>
  );
};

export default CreditMatch;
