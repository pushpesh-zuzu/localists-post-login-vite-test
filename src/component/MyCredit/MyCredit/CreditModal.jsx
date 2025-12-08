import { useEffect, useState } from "react";
import styles from "./CreditModal.module.css";
import useWindowHeight from "../../../utils/customHeigth";
import { addBuyCreditApi } from "../../../store/MyProfile/MyCredit/MyCreditSlice";
import { totalCreditData } from "../../../store/LeadSetting/leadSettingSlice";
import { showToast } from "../../../utils";
import { useSelector, useDispatch } from "react-redux";
import AddCardModal from "../../MyCredit/MyPaymentDetails/AddCardModal";

const CreditModal = ({ onClose }) => {
  const [creditValue, setCreditValue] = useState(50);
  const [responseValue, setResponseValue] = useState(50);
  const { userToken } = useSelector((state) => state.auth);
  const { registerData } = useSelector((state) => state.findJobs);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCreditData, setSelectedCreditData] = useState(null);
  const dispatch = useDispatch();

  const responseToCreditMap = {
    50: 950,
    60: 1140,
    70: 1330,
    80: 1520,
    90: 1710,
    100: 1900,
    110: 2090,
    120: 2280,
    130: 2470,
    140: 2660,
    150: 2850,
    160: 3040,
    170: 3230,
    180: 3420,
    190: 3610,
    200: 3800,
  };

  useEffect(() => {
    setCreditValue(50);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleSliderChange = (e) => {
    let value = Number(e.target.value);
    if (value < 50) {
      value = 50;
    }
    setResponseValue(value);
  };

  const customHeigth = useWindowHeight();
  const credits = responseToCreditMap[responseValue] || 0;
  const price = Math.trunc(credits * 1.45);

  const getSliderBackground = (value, min, max) => {
    const percentage = ((value - min) / (max - min)) * 100;
    return `linear-gradient(to right, var(--primary-color) 0%, var(--primary-color) ${percentage}%, #e4e4e4 ${percentage}%, #e4e4e4 100%)`;
  };

  const handleBuyNow = (item) => {
    let Credits = item.no_of_leads;
    const vatTotal = Math.floor((price * 20) / 100);
    if (typeof addcoupanList === "string" && addcoupanList.includes("%")) {
      const discountPercent = parseFloat(addcoupanList.replace("%", ""));
      const discountAmount = Math.floor(
        (item.no_of_leads * discountPercent) / 100
      );
      Credits = item.no_of_leads + discountAmount;
    }
    const creditData = {
      amount: price,
      credits: credits,
      details: `Purchase ${credits} credits`,
      total_amount: (price + vatTotal) * 100,
      vat: vatTotal,
      top_up: 1,
    };
    setSelectedCreditData(creditData);
    dispatch(addBuyCreditApi(creditData)).then((result) => {
      if (result?.success) {
        window.dataLayer.push({
          event: "payment_success",
          paymentId: result?.data?.invoice_number, // paymentId from backend
          currency: "GBP",
          value: price,
          item_Name: "custom",
          item_id: null,
        });
        showToast("success", result?.message);
        const data = {
          user_id: userToken?.remember_tokens
            ? userToken?.remember_tokens
            : registerData?.remember_tokens,
        };
        dispatch(totalCreditData(data));
        onClose();
      } else if (result?.success === false) {
        setIsAddModalOpen(true);
      }
    });
  };

  return (
    <>
      <div className={styles.modalOverlay}>
        <div
          className={styles.modalContent}
          style={{ height: customHeigth <= 820 ? customHeigth - 20 : "auto" }}
        >
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
          <div className={styles.title}>
            <h2>Flexible Pricing to Grow Your Business</h2>
            <p className={styles.subtitle}>
              Choose a credit pack that fits your goals and budget
            </p>
          </div>

          <div className={styles.infoBar}>
            <span className={styles.credits}>Credits: {credits}</span>
            <span className={styles.responses}>
              Responses: Approximately {responseValue}
            </span>
            <span className={styles.cost}>Cost: £{price} (ex VAT)</span>
          </div>

          <div className={styles.adjustText}>
            Adjust the slider to select the right number of credits for your
            needs
          </div>

          <div className={styles.sliderWrapper}>
            <input
              type="range"
              min="0"
              max="200"
              step="10"
              value={responseValue}
              onChange={handleSliderChange}
              className={styles.slider}
              style={{
                background: getSliderBackground(responseValue, 0, 200),
              }}
            />
            <div className={styles.sliderMarkers}>
              <span style={{ left: "0%" }}></span>
              <span style={{ left: "25%" }}></span>
              <span style={{ left: "50%" }}></span>
              <span style={{ left: "75%" }}></span>
              <span style={{ left: "100%" }}></span>
            </div>
          </div>

          <div className={styles.rangeLabels}>
            <span>0</span>
            <span>50</span>
            <span>100</span>
            <span>150</span>
            <span>200</span>
          </div>

          <div className={styles.centerBtn}>
            <button className={styles.buyBtn} onClick={handleBuyNow}>
              Buy credits
            </button>
          </div>
          <div className={styles.btnbelowText}>
            Use your credits to connect with high-quality, verified leads in
            your service area. The more credits you buy, the more targeted
            opportunities you can unlock.
          </div>
        </div>
      </div>

      {isAddModalOpen && selectedCreditData && (
        <AddCardModal
          onClose={() => setIsAddModalOpen(false)}
          newLeadApi={true}
          newLeadData={selectedCreditData}
          noLeadApiCall={true}
        />
      )}
    </>
  );
};

export default CreditModal;
