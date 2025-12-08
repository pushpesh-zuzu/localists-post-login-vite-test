import { useEffect, useState } from "react";
import styles from "./LeadsCards.module.css";
import BlueSmsIcon from "../../../../assets/Images/Leads/BlueSmsIcon.svg";
import BluePhoneIcon from "../../../../assets/Images/Leads/BluePhoneIcon.svg";
import VerifiedPhoneIcon from "../../../../assets/Images/Leads/VerifiedPhoneIcon.svg";
import AdditionalDetailsIcon from "../../../../assets/Images/Leads/AdditionalDetailsIcon.svg";
import FrequentUserIcon from "../../../../assets/Images/Leads/FrequentUserIcon.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  getAddManualBidData,
  getLeadRequestList,
  saveForLaterApi,
  totalCreditData,
} from "../../../../store/LeadSetting/leadSettingSlice";
import { Spin } from "antd";
import { showToast } from "../../../../utils";
import saveImg from "../../../../assets/Images/Leads/saveLaterImg.svg";
import { useNavigate } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
import ContactConfirmModal from "../ContactConfirmModal";
import ContactSuccessModal from "../ContactSuccessModal";
import viewDetailsArrow from "../../../../assets/Images/Setting/viewDetailsArrow.svg";
import LeadViewDetails from "../LeadViewDetails/LeadViewDetails";

const LeadsCards = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [visibleCount, setVisibleCount] = useState(5);
  const [saveLaterLoaderId, setSaveLaterLoaderId] = useState(null);
  const [isopen, setIsOpen] = useState(false);
  const [planpurcahse, setPlanPurchase] = useState("");

  const { leadRequestList, leadRequestLoader, filters, totalCredit } =
    useSelector((state) => state.leadSetting);
  const { registerData } = useSelector((state) => state.findJobs);
  const { userToken } = useSelector((state) => state.auth);
  const data = leadRequestList?.length;

  useEffect(() => {
    const leadRequestData = {
      user_id: userToken?.remember_tokens
        ? userToken?.remember_tokens
        : registerData?.remember_tokens,
    };
    dispatch(getLeadRequestList(leadRequestData));
  }, []);

  const handleMouseEnter = () => {
    setVisibleCount((prev) => prev + 5);
  };

  const addManualBidData = (item) => {
    const formData = new FormData();
    formData.append("buyer_id", item?.customer_id);
    formData.append(
      "user_id",
      userToken?.remember_tokens
        ? userToken?.remember_tokens
        : registerData?.remember_tokens
    );
    formData.append("bid", item?.credit_score);
    formData.append("lead_id", item?.id);
    formData.append("bidtype", "purchase_leads");
    formData.append("service_id", item?.service_id);
    formData.append("distance", "0");

    dispatch(getAddManualBidData(formData)).then((result) => {
      if (result) {
        showToast("success", result?.message);
        setModalOpen(true);
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
  const handleContinue = (item) => {
    if (!item) return;
    setSelectedItem(item);
    setPlanPurchase(totalCredit?.plan_purchased);

    if (totalCredit?.plan_purchased === 0) {
      setIsOpen(true);
      return;
    }
    if (Number(totalCredit?.total_credit) < Number(item?.credit_score)) {
      setIsOpen(true);
      return;
    }
    if (Number(totalCredit?.total_credit) > Number(item?.credit_score)) {
      addManualBidData(item);
      return;
    }
  };
  // useEffect(() => {
  //   const data = {
  //     user_id: userToken?.remember_tokens
  //       ? userToken?.remember_tokens
  //       : registerData?.remember_tokens,
  //   };
  //   dispatch(totalCreditData(data));
  // }, []);

  const handleSaveLater = (item) => {
    setSaveLaterLoaderId(item.id);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    const saveLaterData = {
      user_id: userToken?.remember_tokens
        ? userToken?.remember_tokens
        : registerData?.remember_tokens,
      lead_id: item?.id,
      buyer_id: item?.customer_id,
    };
    dispatch(saveForLaterApi(saveLaterData)).then((result) => {
      if (result.success) {
        showToast("success", result?.message);

        const formData = new FormData();

        formData.append("user_id", userToken?.remember_tokens || "");
        formData.append("name", filters.keyword || "");
        formData.append("lead_time", filters.submittedWhen || "");
        formData.append("distance_filter", filters.location || "");

        const selectedServiceIds = filters.selectedServices
          .map((serviceName) => {
            const match = popularList.find((s) => s.name === serviceName);
            return match?.id;
          })
          .filter(Boolean);

        formData.append("service_id", selectedServiceIds.join(","));

        formData.append("credits", filters.credits.join(","));
        formData.append("lead_spotlights", filters.leadSpotlights.join(","));
        formData.append("unread", filters.unread ? 1 : 0);

        dispatch(getLeadRequestList(formData)).then((result) => {});
      }
      setSaveLaterLoaderId(null);
    });
  };
  const handleOpenClose = (e) => {
    setIsOpen(false);
    if (e) {
      setTimeout(() => {
        setModalOpen(true);
      }, 2000);
    }
  };

  const [viewDetailsOpen, setViewDetaisOpen] = useState(null);

  const handleViewDetais = (item) => {
    if (viewDetailsOpen === item?.id) {
      setViewDetaisOpen(null);
    } else {
      setViewDetaisOpen(item?.id);
    }
  };

  return (
    <>
      {leadRequestLoader ? (
        <Spin
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "auto",
            marginTop: "24px",
          }}
        />
      ) : (
        <>
          {leadRequestList?.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                marginTop: "40px",
                fontSize: "24px",
                fontWeight: "800",
                color: "#000000",
              }}
            >
              No Leads Available.
            </div>
          ) : (
            <>
              <div>
                {leadRequestList?.slice(0, visibleCount)?.map((item, index) => {
                  return (
                    <>
                      <div className={styles.cardParent}>
                        <div className={styles.card}>
                          {/* Left Section - User Info */}
                          <div className={styles.infoContainer}>
                            <div className={styles.userInfo}>
                              <div className={styles.userDetails}>
                                <div className={styles.avatar}>
                                  {" "}
                                  {item?.customer?.name
                                    ?.charAt(0)
                                    .toUpperCase() || "U"}
                                </div>
                                <div className={styles.details}>
                                  <h3>
                                    {item?.customer?.name
                                      ? item.customer.name
                                          .split(" ")[0]
                                          .charAt(0)
                                          .toUpperCase() +
                                        item.customer.name
                                          .split(" ")[0]
                                          .slice(1)
                                          .toLowerCase()
                                      : ""}
                                  </h3>

                                  <p>{item?.postcode.split(" ")[0]}</p>
                                </div>
                              </div>
                              <span
                                className={styles.category}
                                style={{ background: "#f9b7b7" }}
                              >
                                {item?.category?.name}
                              </span>
                            </div>

                            <div className={styles.contactContainer}>
                              <div className={styles.contactItem}>
                                <img src={BluePhoneIcon} alt="" />
                                <span className={styles.contactItemNumber}>
                                  {item?.phone
                                    ? `+44${item?.phone.substring(
                                        0,
                                        2
                                      )}${"*".repeat(item?.phone.length - 2)}`
                                    : "N/A"}
                                </span>
                              </div>
                              <div className={styles.contactItem}>
                                <img src={BlueSmsIcon} alt="" />
                                <span>
                                  {item?.customer?.email
                                    ? `${item?.customer?.email
                                        .split("@")[0]
                                        .substring(0, 2)}${"*".repeat(6)}@${
                                        item?.customer?.email.split("@")[1]
                                      }`
                                    : "N/A"}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className={styles.jobDetails}>
                            <div className={styles.highlightText}>
                              Highlights :
                            </div>
                            <div
                              className={styles.saveBtnBox}
                              style={{ position: "relative" }}
                            >
                              <button
                                style={{
                                  position: "absolute",
                                  right: "0px",
                                }}
                                className={styles.saveBtn}
                                onClick={() => handleSaveLater(item)}
                              >
                                {saveLaterLoaderId === item.id ? (
                                  <Spin
                                    indicator={
                                      <LoadingOutlined
                                        spin
                                        style={{ color: "white" }}
                                      />
                                    }
                                  />
                                ) : (
                                  <>
                                    <img src={saveImg} alt="image" />
                                    Save
                                  </>
                                )}
                              </button>
                            </div>

                            <div className={styles.badges}>
                              {item?.is_phone_verified == 1 && (
                                <span className={styles.verified}>
                                  <img src={VerifiedPhoneIcon} alt="" />
                                  Verified Phone
                                </span>
                              )}
                              {item?.has_additional_details == 1 && (
                                <span className={styles.additional}>
                                  {" "}
                                  <img src={AdditionalDetailsIcon} alt="" />
                                  Additional details
                                </span>
                              )}
                              {item?.is_frequent_user == 1 && (
                                <span className={styles.frequent}>
                                  {" "}
                                  <img src={FrequentUserIcon} alt="" />
                                  Frequent user
                                </span>
                              )}
                              {item?.is_urgent == 1 && (
                                <span className={styles.frequent}>
                                  {" "}
                                  <img src={FrequentUserIcon} alt="" />
                                  Urgent
                                </span>
                              )}
                              {item?.is_high_hiring == 1 && (
                                <span className={styles.frequent}>
                                  {" "}
                                  <img src={FrequentUserIcon} alt="" />
                                  High hiring
                                </span>
                              )}
                            </div>
                            <div className={styles.jobInfo}>
                              {item?.questions && (
                                <p>
                                  {JSON.parse(item?.questions)
                                    .map((qa) => qa?.ans)
                                    .join("/")}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className={styles.leadActions}>
                            <button
                              className={styles.purchaseButton}
                              onClick={() => handleContinue(item)}
                            >
                              Contact
                            </button>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <span className={styles.credits}>
                                {item?.credit_score} Credits
                              </span>
                            </div>

                            <div className={styles.mainText}>
                              <div>ACT FAST</div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className={styles.saveBtnBoxs}>
                            <button
                              className={styles.saveBtn}
                              onClick={() => handleSaveLater(item)}
                              disabled={saveLaterLoaderId === item.id}
                            >
                              {saveLaterLoaderId === item.id ? (
                                <Spin
                                  indicator={
                                    <LoadingOutlined
                                      spin
                                      style={{ color: "white" }}
                                    />
                                  }
                                />
                              ) : (
                                <>
                                  <img src={saveImg} alt="image" />
                                  Save
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                        <div className={styles.viewDetailsBtnWrapper}>
                          <button
                            className={styles.viewDetailsBtn}
                            onClick={() => handleViewDetais(item)}
                          >
                            View Details{" "}
                            <img
                              src={viewDetailsArrow}
                              alt="..."
                              className={`${styles.arrowIcon} ${
                                viewDetailsOpen == item?.id
                                  ? ""
                                  : styles.rotated
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                      {viewDetailsOpen == item?.id && (
                        <LeadViewDetails leadRequestDatas={item} />
                      )}
                    </>
                  );
                })}{" "}
              </div>{" "}
            </>
          )}{" "}
          {leadRequestList?.length > visibleCount && (
            <div className={styles.viewMoreBtnWrapper}>
              <button onMouseEnter={handleMouseEnter}>View More</button>
            </div>
          )}
        </>
      )}

      <ContactSuccessModal
        onClose={() => setModalOpen(false)}
        isOpen={isModalOpen}
        details={selectedItem}
      />
      {isopen && (
        <ContactConfirmModal
          onClose={(e) => handleOpenClose(e)}
          enoughCredit={planpurcahse}
          confirmModal={isModalOpen}
          details={selectedItem}
          newLeadApi={"newLead"}
        />
      )}
    </>
  );
};

export default LeadsCards;
