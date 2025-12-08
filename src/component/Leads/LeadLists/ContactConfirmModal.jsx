import { useEffect, useState } from "react";
import styles from "./ContactConfirmModal.module.css";
import { useNavigate } from "react-router-dom";
import {
  getAddManualBidData,
  getCreditPlanList,
  getLeadRequestList,
  totalCreditData,
} from "../../../store/LeadSetting/leadSettingSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  addBuyCreditApi,
  getInvoiceBillingListApi,
} from "../../../store/MyProfile/MyCredit/MyCreditSlice";
import { showToast } from "../../../utils";
import arrowIcons from "../../../assets/Icons/arrow-down.svg";
import AddCardModal from "../../MyCredit/MyPaymentDetails/AddCardModal";
import localistImg from "../../../assets/Images/Leads/localistImg.svg";
import getHired from "../../../assets/Images/Setting/newLogoCredit.svg";
import useWindowHeight from "../../../utils/customHeigth";
const dummyCreditPlanList = [
  {
    description: "Best Value!",
    no_of_leads: 50,
    price: 49.99,
    per_credit: 1.0,
  },
];

const ContactConfirmModal = ({
  onClose,
  enoughCredit,
  details,
  newLeadApi,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeLoaderId, setActiveLoaderId] = useState(null);
  const [isChecked, setIsChecked] = useState(true);
  const [creditModal, setCreditModal] = useState(false);
  const { creditPlanList, totalCredit } = useSelector(
    (state) => state.leadSetting
  );
  const [activeIndex, setActiveIndex] = useState(null);
  const { registerData } = useSelector((state) => state.findJobs);
  const { userToken } = useSelector((state) => state.auth);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  const customHeigth = useWindowHeight();
  const totalRemaingCredit = creditPlanList[0]?.no_of_leads;
  const creditItems =
    creditPlanList && creditPlanList.length > 0
      ? creditPlanList
      : dummyCreditPlanList;

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };
  useEffect(() => {
    dispatch(getCreditPlanList());
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

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
        onClose(true);
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

  const handleBuyNow = (item) => {
    setActiveLoaderId(item?.id);

    let credits = item.no_of_leads;

    const vatTotal =
      item?.billing_vat_register === 0
        ? 0
        : Math.floor((item?.price * 20) / 100);

    if (typeof addcoupanList === "string" && addcoupanList.includes("%")) {
      const discountPercent = parseFloat(addcoupanList.replace("%", ""));
      const discountAmount = Math.floor(
        (item.no_of_leads * discountPercent) / 100
      );

      credits = item.no_of_leads + discountAmount;
    }

    const creditData = {
      amount: item?.price,
      credits: credits,
      details: item?.name,
      total_amount: (item?.price + vatTotal) * 100,
      vat: vatTotal,
      top_up: isChecked ? 1 : 0,
    };

    dispatch(addBuyCreditApi(creditData)).then((result) => {
      if (result?.success) {
        showToast("success", result?.message);
        setActiveLoaderId(null);
        addManualBidData();
        onClose(true);
        dispatch(getInvoiceBillingListApi());
      } else if (result?.success === false) {
        setCreditModal(true);
      }
    });
  };

  return (
    <>
      {creditModal ? (
        <AddCardModal
          onClose={() => setCreditModal(false)}
          detail={creditItems}
          topup={isChecked}
          closeModal={() => onClose()}
          details={details}
          newLeadApi={newLeadApi}
        />
      ) : (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button className={styles.closeButton} onClick={() => onClose()}>
              ×
            </button>
            <div className={styles.mainBox}>
              <h2>
                {enoughCredit != 0
                  ? `You need ${
                      Number(details?.credit_score) -
                      Number(totalCredit?.total_credit)
                    } credits to contact ${details?.customer?.name}`
                  : "Please purchase a Credit Pack"}
              </h2>
              <p className={styles.subText}>
                To get some credits, you need to buy a starter pack of credits
                (Enough for this lead)
              </p>
            </div>
            <div>
              <div className={styles.section}>
                <button
                  className={styles.accordion}
                  onClick={() => toggleAccordion(0)}
                >
                  <div className={styles.accordionContent}>
                    <span>What are credits?</span>
                    <span
                      className={`${styles.arrowIcon} ${
                        activeIndex === 0 ? styles.rotate : ""
                      }`}
                    >
                      <img
                        src={arrowIcons}
                        alt="arrow"
                        width={16}
                        height={16}
                      />
                    </span>
                  </div>
                </button>
                {activeIndex === 0 && (
                  <div className={styles.panel}>
                    <p>
                      Credits are Localists online currency. If you see a job
                      that you like and you want to get in contact with that
                      customer, then you use credits to purchase their contact
                      details...
                    </p>
                  </div>
                )}
              </div>

              <div className={styles.section}>
                <button
                  className={styles.accordion}
                  onClick={() => toggleAccordion(1)}
                >
                  <div className={styles.accordionContent}>
                    <span>What is the starter pack?</span>
                    <span
                      className={`${styles.arrowIcon} ${
                        activeIndex === 1 ? styles.rotate : ""
                      }`}
                    >
                      <img
                        src={arrowIcons}
                        alt="arrow"
                        width={16}
                        height={16}
                      />
                    </span>
                  </div>
                </button>
                {activeIndex === 1 && (
                  <div className={styles.panel}>
                    <p>
                      The starter pack is a bundle of credits for new users to
                      try out Localist’s service. Take advantage NOW and get a
                      free 20% credit boost as a new user.
                    </p>
                  </div>
                )}
              </div>

              <div className={styles.section}>
                <button
                  className={styles.accordion}
                  onClick={() => toggleAccordion(2)}
                >
                  <div className={styles.accordionContent}>
                    <span>What is the 100% New Business promise</span>
                    <span
                      className={`${styles.arrowIcon} ${
                        activeIndex === 2 ? styles.rotate : ""
                      }`}
                    >
                      <img
                        src={arrowIcons}
                        alt="arrow"
                        width={16}
                        height={16}
                      />
                    </span>
                  </div>
                </button>
                {activeIndex === 2 && (
                  <div className={styles.panel}>
                    <p>
                      Get new local business enquiries - fast. Guaranteed with
                      our New Business Promise.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {creditPlanList && creditPlanList.length > 0 ? (
              creditPlanList.map((item, index) => (
                <div key={index} className={styles.offerBox}>
                  <div className={styles.offerHeader}>
                    <span className={styles.discountBadge} style={{}}>
                      {item?.description ? item?.description : item?.name}
                    </span>
                  </div>

                  <div className={styles.creditDetails}>
                    <div>
                      <p className={styles.creditbtn}>
                        <img src={localistImg} alt="image" />
                        <strong>{item?.no_of_leads} credits</strong>
                      </p>
                      <p className={styles.paraText}>
                        Enough for about {item.no_of_responses} leads
                      </p>
                    </div>
                    <div className={styles.priceDetails}>
                      <p>
                        <strong>£{item?.price}</strong> (Excl. tax)
                      </p>
                      <p className={styles.perCreditText}>
                        £{item?.per_credit}/credit
                      </p>
                    </div>
                  </div>
                  {item?.plan_type !== "normal" && (
                    <div className={styles.getHired}>
                      <img
                        src={getHired}
                        alt="getHired"
                        className={styles.getHiredImage}
                      />
                      {
                        <div className={styles.gethiredText}>
                          Get new local business enquiries - fast. Guaranteed
                          with our New Business Promise.
                        </div>
                      }
                    </div>
                  )}

                  <div className={styles.buttonGroup}>
                    <button
                      className={styles.buyButton}
                      onClick={() => handleBuyNow(item)}
                    >
                      Buy {item?.no_of_leads} credits
                    </button>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                      />{" "}
                      Auto top-up next time
                    </label>
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.noPlanText}></p>
            )}

            <p className={styles.footerNote}>
              {enoughCredit != 0
                ? `You Will use ${
                    Number(details?.credit_score) -
                    Number(totalCredit?.total_credit)
                  } of your ${totalRemaingCredit} purchased credits to contact ${
                    details?.customer?.name
                      ? details.customer.name
                          .split(" ")[0]
                          .charAt(0)
                          .toUpperCase() +
                        details.customer.name
                          .split(" ")[0]
                          .slice(1)
                          .toLowerCase()
                      : ""
                  }`
                : `You will use ${
                    details?.credit_score
                  } of your ${totalRemaingCredit} purchased credits to contact  ${
                    details?.customer?.name
                      ? details.customer.name
                          .split(" ")[0]
                          .charAt(0)
                          .toUpperCase() +
                        details.customer.name
                          .split(" ")[0]
                          .slice(1)
                          .toLowerCase()
                      : ""
                  }`}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ContactConfirmModal;
