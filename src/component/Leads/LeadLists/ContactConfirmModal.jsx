import { useEffect, useState } from "react";
import styles from "./ContactConfirmModal.module.css";
import { useNavigate } from "react-router-dom";
import {
  getAddManualBidData,
  getCreditPlanList,
  getLeadRequestList,
  totalCreditData,
  getCostOfOneCredit,
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

const singleLeadPurchase = {
  id: "single-lead-pack",
  name: "Single Lead Purchase",
  description: "Single Lead Purchase",
  no_of_leads: 50,
  no_of_responses: 1,
  price: 0,
  per_credit: 0,
  plan_type: "starter",
  billing_vat_register: 1,
};

const ContactConfirmModal = ({
  onClose,
  enoughCredit,
  details,
  newLeadApi,
  isExclusive
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeLoaderId, setActiveLoaderId] = useState(null);
  const [isChecked, setIsChecked] = useState(true);
  const [creditModal, setCreditModal] = useState(false);
  const [selectedCreditPlan, setSelectedCreditPlan] = useState(null);
  const { creditPlanList, totalCredit, costOfOneCredit } = useSelector(
    (state) => state.leadSetting
  );
  const { addcoupanList } = useSelector((state) => state.myCredit);
  const [activeIndex, setActiveIndex] = useState(null);
  const { registerData } = useSelector((state) => state.findJobs);
  const { userToken } = useSelector((state) => state.auth);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  const customHeigth = useWindowHeight();
  const costOfOneCreditValue =
    typeof costOfOneCredit?.cost_of_one_credit === "string" || typeof costOfOneCredit?.cost_of_one_credit === "number"
      ? costOfOneCredit?.cost_of_one_credit
      : singleLeadPurchase.per_credit;

  const singleLeadPurchasePlan = {
    ...singleLeadPurchase,
    no_of_leads: details?.credit_score || singleLeadPurchase.no_of_leads,
    per_credit: Number(costOfOneCreditValue),
    price: (Number(details?.credit_score || 0) * Number(costOfOneCreditValue)).toFixed(2),
    billing_vat_register:
      costOfOneCredit?.billing_vat_register ??
      costOfOneCredit?.billing_vat_register,
  };

  const totalRemaingCredit =
    creditPlanList[0]?.no_of_leads || singleLeadPurchasePlan.no_of_leads;
  const creditItems =
    creditPlanList && creditPlanList.length > 0
      ? creditPlanList
      : [singleLeadPurchasePlan];

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };
  useEffect(() => {
    dispatch(getCreditPlanList());
  }, []);

  useEffect(() => {
    dispatch(getCostOfOneCredit());
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
    if(isExclusive){
    formData.append("bid", details?.exclusive_credit_score);
    }else{
      formData.append("bid", details?.credit_score);
    }
    formData.append("lead_id", details?.id);
    formData.append("bidtype", "purchase_leads");
    formData.append("service_id", details?.service_id);
    formData.append("distance", "0");
    if (isExclusive) {
    formData.append("is_exclusive", "1"); // ← ye add karo
  }

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
    setSelectedCreditPlan(item);

    const isSingleLeadPurchase = item?.id === singleLeadPurchase.id;
    let credits = Number(item?.no_of_leads || 0);

    const price = Number(item?.price || 0);

    const vatTotal = isSingleLeadPurchase
      ? costOfOneCredit?.billing_vat_register === 0 ? 0 : (price * 20) / 100
      : item?.billing_vat_register === 0
        ? 0
        : Math.floor((price * 20) / 100);


    if (typeof addcoupanList === "string" && addcoupanList.includes("%")) {
      const discountPercent = parseFloat(addcoupanList.replace("%", ""));
      const noOfLeads = Number(item?.no_of_leads || 0);
      const discountAmount = Math.floor(
        (noOfLeads * discountPercent) / 100
      );

      credits = noOfLeads + discountAmount;
    }

    const totalAmount = isSingleLeadPurchase
      ? Math.floor((Number(price) + vatTotal) * 100)
      : (Number(price) + vatTotal) * 100;



    const creditData = {
      amount: price,
      credits: credits,
      details: item?.name,
      total_amount: totalAmount,
      vat: vatTotal,
      top_up: isSingleLeadPurchase ? 0 : isChecked ? 1 : 0,
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

  const renderCreditPlan = (item, key) => (
    <div key={key} className={styles.offerBox}>
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
            Enough for about {item.no_of_responses}{" "}
            {item?.id === singleLeadPurchase.id && item.no_of_responses === 1
              ? "lead"
              : "leads"}
            {item?.id === singleLeadPurchase.id &&
              item.no_of_responses === 1 && (
                <span className={styles.hiddenTextSpacer}>s</span>
              )}
          </p>
        </div>
        <div className={styles.priceDetails}>
          <p>
            <strong>&pound;{item?.price}</strong> (Excl. tax)
          </p>
          <p className={styles.perCreditText}>
            &pound;{item?.per_credit}/credit
          </p>
        </div>
      </div>
      {item?.id !== singleLeadPurchase.id && item?.plan_type !== "normal" && (
        <div className={styles.getHired}>
          <img
            src={getHired}
            alt="getHired"
            className={styles.getHiredImage}
          />
          {
            <div className={styles.gethiredText}>
              Get new local business enquiries - fast. Guaranteed with our New
              Business Promise.
            </div>
          }
        </div>
      )}

      <div className={styles.buttonGroup}>
        <button className={styles.buyButton} onClick={() => handleBuyNow(item)}>
          Buy {item?.no_of_leads} credits
        </button>
        {item?.id !== singleLeadPurchase.id && (
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
            />{" "}
            Auto top-up next time
          </label>
        )}
        {item?.id === singleLeadPurchase.id && (
          <span
            className={`${styles.checkboxLabel} ${styles.hiddenCheckboxSpacer}`}
          >
            <input type="checkbox" tabIndex={-1} readOnly /> Auto top-up next
            time
          </span>
        )}
      </div>
    </div>
  );

  return (
    <>
      {creditModal ? (
        <AddCardModal
          onClose={() => setCreditModal(false)}
          detail={selectedCreditPlan ? [selectedCreditPlan] : creditItems}
          topup={
            selectedCreditPlan?.id === singleLeadPurchase.id ? false : isChecked
          }
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
                  ? `You need ${Number(details?.credit_score) -
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
                      className={`${styles.arrowIcon} ${activeIndex === 0 ? styles.rotate : ""
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
                      className={`${styles.arrowIcon} ${activeIndex === 1 ? styles.rotate : ""
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
                      className={`${styles.arrowIcon} ${activeIndex === 2 ? styles.rotate : ""
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

            {renderCreditPlan(singleLeadPurchasePlan, "single-lead-purchase")}
            {creditPlanList?.map((item, index) =>
              renderCreditPlan(item, item?.id || index)
            )}

            <p className={styles.footerNote}>
              {enoughCredit != 0
                ? `You Will use ${Number(details?.credit_score) -
                Number(totalCredit?.total_credit)
                } of your ${totalRemaingCredit} purchased credits to contact ${details?.customer?.name
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
                : `You will use ${details?.credit_score
                } of your ${totalRemaingCredit} purchased credits to contact  ${details?.customer?.name
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
