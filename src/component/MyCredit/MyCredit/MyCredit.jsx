import { useEffect, useState } from "react";
import styles from "./MyCredit.module.css";
import iIcon from "../../../assets/Images/iIcon.svg";
import CreditCard from "./CreditCard";
import TransgationLogTable from "./TransgationLogTable";
import CreditModal from "./CreditModal";
import { Link, useNavigate } from "react-router-dom";
import {
  getCreditPlanList,
  getswitchAutobidApi,
  switchAutobidApi,
} from "../../../store/LeadSetting/leadSettingSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  addBuyCreditApi,
  AddCoupanApi,
  getInvoiceBillingListApi,
} from "../../../store/MyProfile/MyCredit/MyCreditSlice";
import { showToast } from "../../../utils";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import AddCardModal from "../MyPaymentDetails/AddCardModal";
import blackArrow from "../../../assets/Images/Leads/blackArrowRight.svg";
import { useUserGeo } from "../../../utils/geo";
import { setStarterPackPurchased } from "../../../store/MyProfile/MyCredit/MyCreditSlice";
import NewBusiness from "../../../assets/Images/NewBusiness.svg";
import shuttle from "../../../assets/Images/shuttle.svg";

const MyCredits = () => {
  const [automation, setAutomation] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [activeLoaderId, setActiveLoaderId] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { creditPlanList } = useSelector((state) => state.leadSetting);
  const { registerData } = useSelector((state) => state.findJobs);
  const { userToken } = useSelector((state) => state.auth);
  const { country, lang } = useUserGeo();

  const { addCouanLoader, addcoupanList, getInoviceBillingList } = useSelector(
    (state) => state.myCredit
  );
  const { getSwitcgAutoBidData } = useSelector((state) => state.leadSetting);
  const [checkedPlans, setCheckedPlans] = useState({});

  const [isAddCardModal, setIsAddCardModal] = useState(false);
  const handleOpen = () => {
    setIsOpen(true);
  };
  const handleCheckboxChange = (planId) => {
    setCheckedPlans((prev) => ({
      ...prev,
      [planId]: !prev[planId],
    }));
  };

  const userId = userToken?.remember_tokens ?? registerData?.remember_tokens;

  useEffect(() => {
    if (getSwitcgAutoBidData?.isautobid !== undefined) {
      setAutomation(getSwitcgAutoBidData.isautobid === 1);
    }
  }, [getSwitcgAutoBidData]);

  useEffect(() => {
    if (userId) {
      dispatch(getswitchAutobidApi({ user_id: userId }));
    }
  }, [userId, dispatch]);
  const handleToggle = () => {
    const newValue = !automation;
    setAutomation(newValue);

    dispatch(
      switchAutobidApi({
        is_autobid: Number(newValue),
        user_id: userId,
      })
    );
  };
  const handleRedeem = (e) => {
    setCouponCode(e.target.value);
  };
  const handleBack = () => {
    navigate("/settings");
  };
  useEffect(() => {
    dispatch(getCreditPlanList());
    dispatch(getInvoiceBillingListApi());
  }, []);

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
    let creditData = {};

    if (item?.plan_type === "starter") {
      creditData = {
        amount: item?.price,
        credits: credits,
        details: item?.name,
        total_amount: (item?.price + vatTotal) * 100,
        vat: vatTotal,
        top_up: 0,
      };
    } else {
      creditData = {
        amount: item?.price,
        credits: credits,
        details: item?.name,
        total_amount: (item?.price + vatTotal) * 100,
        vat: vatTotal,
        top_up: checkedPlans?.[item?.id] === true ? 0 : 1,
      };
    }

    dispatch(addBuyCreditApi(creditData)).then((result) => {
      if (result?.success) {
        window.dataLayer.push({
          event: "payment_success",
          paymentId: result?.data?.invoice_number,
          currency: "GBP",
          value: item?.price,
          item_Name: item?.name,
          item_id: item?.id,
        });
        showToast("success", result?.message);
        setActiveLoaderId(null);
        dispatch(getInvoiceBillingListApi());

        if (item?.plan_type === "starter") {
          dispatch(setStarterPackPurchased(true));
        }
        console.log(window.dataLayer);
      } else if (result?.success === false) {
        setIsAddCardModal(true);
      }
    });
  };

  const handleApply = () => {
    if (!couponCode.trim()) {
      showToast("error", "Please enter a valid coupon code.");
      return;
    }

    const payload = {
      coupon_code: couponCode.trim(),
    };

    dispatch(AddCoupanApi(payload)).then((result) => {
      if (result) {
        showToast("success", result?.message);
        setCouponCode("");
      }
    });
  };
  const priceCreditPercentage = creditPlanList?.map(
    (item) => item?.no_of_leads
  );
  return (
    <>
      <div className={styles.container}>
        <div className={styles.backText} onClick={handleBack}>
          {" "}
          <img src={blackArrow} alt="..." /> Settings
        </div>
        <h1 className={styles.heading}>My credits</h1>

        <div className={styles.manageWrapper}>
          <span className={styles.infoIcon}>
            <img src={iIcon} alt="iIcon" />
          </span>
          <p className={styles.description}>
            Credits are used to contact customers on Localists. You can find out
            more about credits and how we charge for our service in the{" "}
            <Link to={`/${lang}/${country}/contact-us`} className={styles.link}>
              Help Center
            </Link>
            .
          </p>
        </div>
        {creditPlanList?.[0]?.plan_type === "starter" ? (
          <p className={styles.starter_note}>
            {/* We charge a small fee for each customer you contact on Localists.
            Buy a pack of 265 credits and get 20% OFF */}
            {""}
          </p>
        ) : (
          <p className={styles.note}>
            We apply a small fee for each new customer you choose to contact.
          </p>
        )}

        {creditPlanList?.[0]?.plan_type !== "starter" && (
          <div className={styles.pickYourCredit}>
            <p>
              <span>Pick Your Credit Plan </span> & Access New Business Today
            </p>
          </div>
        )}

        <div className={styles.cardList}>
          {creditPlanList?.length === 0 ? (
            <div className={styles.noPlanText}></div>
          ) : (
            [...creditPlanList]
              .sort((a, b) => a.price - b.price)
              .map((item, index) => (
                <div
                  className={`${styles.card} ${
                    item?.plan_type === "starter" && styles.cardPadding
                  }`}
                  key={index}
                >
                  {item?.plan_type === "starter" && (
                    <div className={styles.offerBoxTop}>
                      <span>
                        45% Discount{" "}
                        {/* <div>
                          <img src={shuttle} alt="" />
                        </div> */}
                      </span>{" "}
                      <div>Your Exclusive Sign Up Offer</div>
                    </div>
                  )}
                  {item?.plan_type === "starter" && (
                    <>
                      <div
                        className={`${styles.cardHeader} ${styles.removeBorder}`}
                      >
                        <p className={styles.responses}>
                          About {item?.no_of_responses} Responses
                        </p>
                        <span
                          className={`${styles.creditTag} ${styles.creditpadding}`}
                        >
                          {/* <span className={styles.diagonal_price}>221</span> */}
                          {item?.no_of_leads} Credits
                        </span>
                        <h3
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          £{item.price}{" "}
                          <span className={styles.excl_tax}>(Excl. tax)</span>
                        </h3>
                        <button
                          className={`${styles.buyButton} ${styles.buttonWidth}`}
                          onClick={() => handleBuyNow(item)}
                        >
                          Buy Now
                        </button>
                      </div>

                      <div className={styles.cardHeaderWrap}>
                        <p className={styles.responses}>
                          About {item?.no_of_responses} Responses
                        </p>
                        <span
                          className={`${styles.creditTag} ${styles.creditpadding}`}
                        >
                          {/* <span className={styles.diagonal_price}>221</span> */}
                          {item?.no_of_leads} Credits
                        </span>
                      </div>
                      <div className={styles.cardHeaderWraps}>
                        <h3
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          £{item.price}{" "}
                          <span className={styles.excl_tax}>(Excl. tax)</span>
                        </h3>
                        <button
                          className={`${styles.buyButton} ${styles.buttonWidth}`}
                          onClick={() => handleBuyNow(item)}
                        >
                          Buy Now
                        </button>
                      </div>

                      <div className={styles.new_business_card}>
                        <img src={NewBusiness} alt="..." />
                        <div>
                          Get new local business enquiries - fast. Guaranteed
                          with our New Business Promise.
                        </div>
                      </div>
                    </>
                  )}
                  {item?.plan_type !== "starter" && (
                    <div className={styles.cardHeader}>
                      <h3>{item?.name}</h3>
                      <span className={styles.creditTag}>
                        {item?.no_of_leads} Credits
                      </span>
                    </div>
                  )}
                  {item?.plan_type !== "starter" && (
                    <>
                      <p className={styles.responses}>
                        About {item?.no_of_responses} Responses
                      </p>

                      <div
                        className={styles.price}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        £{item?.price}
                        <small className={styles.excl_tax}>(Excl. tax)</small>
                      </div>

                      <button
                        className={styles.buyButton}
                        onClick={() => handleBuyNow(item)}
                      >
                        Buy Now
                      </button>

                      <div className={styles.checkboxWrap}>
                        <input
                          type="checkbox"
                          defaultChecked={true}
                          onChange={() => handleCheckboxChange(item.id)}
                        />
                        <label>Auto top-up next time</label>
                      </div>
                    </>
                  )}
                </div>
              ))
          )}
        </div>

        {creditPlanList?.[0]?.plan_type !== "starter" && (
          <div className={styles.parentBanner}>
            <div className={styles.banner}>
              <h2 className={styles.bannertitle}>Build Your Own Credit Plan</h2>

              <p className={styles.subtitle}>
                If our standard Credit Packs don’t meet your growth needs, you
                can build your own here
              </p>

              <button className={styles.bannerbutton} onClick={handleOpen}>
                Build Your Credit Pack
              </button>
            </div>
          </div>
        )}

        <div className={styles.VisaCard}>
          <CreditCard />
        </div>
        <div className={styles.redeemText}>
          <label>Redeem coupon</label>
          <input
            type="text"
            placeholder="Coupon Code"
            onChange={handleRedeem}
          />
          <button className={styles.redeemButton} onClick={handleApply}>
            {addCouanLoader ? (
              <Spin
                indicator={<LoadingOutlined spin style={{ color: "white" }} />}
              />
            ) : (
              "Apply"
            )}
          </button>
        </div>
        <div className={styles.couponsText}>
          Coupons can't be combined. The higher discount applies.
        </div>
        <div className={styles.toggle}>
          <span>Auto bid</span>
          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={automation}
              onChange={handleToggle}
            />
            <span className={styles.slider}></span>
          </label>
        </div>

        <TransgationLogTable data={getInoviceBillingList} />
      </div>
      {isOpen && <CreditModal onClose={() => setIsOpen(false)} />}

      {isAddCardModal && (
        <AddCardModal onClose={() => setIsAddCardModal(false)} />
      )}
    </>
  );
};

export default MyCredits;
