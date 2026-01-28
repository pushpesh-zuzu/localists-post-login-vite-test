import React, { useEffect, useRef, useState } from "react";
import styles from "./ArchiveLeads.module.css";
import { useDispatch, useSelector } from "react-redux";

import BlueSmsIcon from "../../assets/Images/Leads/BlueSmsIcon.svg";
import BluePhoneIcon from "../../assets/Images/Leads/BluePhoneIcon.svg";
import VerifiedPhoneIcon from "../../assets/Images/Leads/VerifiedPhoneIcon.svg";
import AdditionalDetailsIcon from "../../assets/Images/Leads/AdditionalDetailsIcon.svg";
import FrequentUserIcon from "../../assets/Images/Leads/FrequentUserIcon.svg";
import viewDetailsArrow from "../../assets/Images/Setting/viewDetailsArrow.svg";
import {
  unarchivePendingLead,
  getArchivedLeads,
  getAddManualBidData,
  totalCreditData,
  getBuyerActivitiesApi,
  getLeadProfileRequestList,
  getSellerNotesApi,
  setLeadListProfileLoader,
} from "../../store/LeadSetting/leadSettingSlice";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import ContactSuccessModal from "../Leads/LeadLists/ContactSuccessModal";
import ContactConfirmModal from "../Leads/LeadLists/ContactConfirmModal";
import { showToast } from "../../utils";
import pendingImg from "../../assets/Images/MyResponse/PendingBtnImg.svg";
import { Helmet } from "react-helmet-async";
import { formatUKPhoneNumber } from "../../utils/formatUKPhoneNumber";
import MyResponseAccordion from "../myResponses/MyResponseAccordian/MyResponseAccordian";
import pendingArrowIcon from "../../assets/Images/Leads/arrowLeadImg.svg";
import dayjs from "../../utils/dayjs";

const ArchiveLeads = () => {
  const dispatch = useDispatch();
  const scrollContainerRef = useRef(null);
  const [visibleCount, setVisibleCount] = useState(5);
  const [unarchiveLoader, setUnarchiveLoader] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null); // Changed from viewDetailsOpen
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isChangePendingStatus, setisChangePendingStatus] = useState(false);

  const [isopen, setIsOpen] = useState(false);
  const [planpurcahse, setPlanPurchase] = useState("");
  const { userToken } = useSelector((state) => state.auth);
  const { registerData } = useSelector((state) => state.findJobs);
  const { totalCredit } = useSelector((state) => state.leadSetting);

  const { archivedLeads } = useSelector((state) => state?.leadSetting);
  console.log(archivedLeads, "item");

  const pendingArchivedLeads = archivedLeads?.filter(
    (lead) => lead?.status !== "hired"
  );
  useEffect(() => {
    dispatch(getArchivedLeads());
  }, [dispatch, isChangePendingStatus]);

  // Updated handleOpen function - same as MyResponse
  const handleOpen = (item) => {
    if (item?.id == selectedLead) {
      setSelectedLead(null);
    } else {
      dispatch(setLeadListProfileLoader(true));
      setSelectedLead(item?.id);
    }

    const activityData = {
      buyer_id: item?.customer_id,
      user_id: userToken?.remember_tokens || registerData?.remember_tokens,
      lead_id: item?.id,
    };

    dispatch(getBuyerActivitiesApi(activityData)).then((result) => {
      if (result) {
        const data = {
          customer_id: item?.customer_id,
          lead_id: item?.id,
          user_id: userToken?.remember_tokens || registerData?.remember_tokens,
        };
        dispatch(getLeadProfileRequestList(data));
      }
    });

    dispatch(getSellerNotesApi(activityData)).then((result) => {
      if (result) {
        const data = {
          customer_id: item?.customer_id,
          lead_id: item?.id,
          user_id: userToken?.remember_tokens || registerData?.remember_tokens,
        };
      }
    });
  };

  const addManualBidData = (item) => {
    const formData = new FormData();
    formData.append("buyer_id", item?.customer_id);
    formData.append(
      "user_id",
      userToken?.remember_tokens || registerData?.remember_tokens
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
        user_id: userToken?.remember_tokens || registerData?.remember_tokens,
        page_type: "archived_leads",
      };

      dispatch(totalCreditData(data));
      dispatch(getArchivedLeads());
    });
  };

  const handleContinue = (item) => {
    if (!item) return;

    setSelectedItem(item);
    setPlanPurchase(totalCredit?.plan_purchased);

    // Condition 1: Plan not purchased
    if (totalCredit?.plan_purchased === 0) {
      setIsOpen(true);
      return;
    }

    // Not enough credits
    if (Number(totalCredit?.total_credit) < Number(item?.credit_score)) {
      setIsOpen(true);
      return;
    }

    // Sufficient credits
    addManualBidData(item);
  };

  const handleMouseEnter = () => {
    setVisibleCount((prev) => prev + 5);
  };

  const handleUnArchive = async (item) => {
    const payload = {
      lead_id: item?.id,
      customer_id: item?.customer_id,
    };

    setUnarchiveLoader(item?.id);

    try {
      await dispatch(unarchivePendingLead(payload));
      dispatch(getArchivedLeads());
    } catch (err) {
      console.error("Unarchive error:", err);
    } finally {
      setUnarchiveLoader(null);
    }
  };

  useEffect(() => {
    const data = {
      user_id: userToken?.remember_tokens || registerData?.remember_tokens,
      page_type: "archived_leads",
    };

    dispatch(totalCreditData(data));
  }, [dispatch]);

  return (
    <>
      <Helmet>
        <title> Localists.com - Archive Leads</title>
        <meta name="desciption" content="Localists.com - Archive Leads" />
      </Helmet>
      <div className={styles.ArchiveLeadsContainer}>
        {pendingArchivedLeads?.length ? (
          pendingArchivedLeads?.slice(0, visibleCount)?.map((item) => {
            return (
              <div key={item?.id}>
                <div className={styles.cardParent}>
                  <div className={styles.card}>
                    {/* Left Section - User Info */}
                    <div className={styles.infoContainer}>
                      <div className={styles.userInfo}>
                        <div className={styles.userDetails}>
                          <div className={styles.avatar}>
                            {item?.customer?.name?.charAt(0).toUpperCase() ||
                              "U"}
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

                            <p>{item?.postcode}</p>
                          </div>
                        </div>
                        <span className={styles.category}>
                          {item?.category?.name}
                        </span>
                      </div>
                      <div className={styles.contactContainer}>
                        <div className={styles.contactItem}>
                          <img src={BluePhoneIcon} alt="" />
                          <span>
                            {item?.phone
                              ? `${formatUKPhoneNumber(item?.phone)}`
                              : "N/A"}
                          </span>
                        </div>

                        <div className={styles.contactItem}>
                          <img src={BlueSmsIcon} alt="" />
                          <span>{item?.customer?.email || "N/A"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Middle Section - Job Details */}
                    <div className={styles.jobDetails}>
                      <div className={styles.highlightText}>Highlights :</div>
                      <div className={styles.badges}>
                        {item?.is_phone_verified == 1 && (
                          <span className={styles.verified}>
                            <img src={VerifiedPhoneIcon} alt="" />
                            Verified Phone
                          </span>
                        )}
                        {item?.has_additional_details == 1 && (
                          <span className={styles.additional}>
                            <img src={AdditionalDetailsIcon} alt="" />
                            Additional details
                          </span>
                        )}
                        {item?.is_frequent_user == 1 && (
                          <span className={styles.frequent}>
                            <img src={FrequentUserIcon} alt="" />
                            Frequent user
                          </span>
                        )}
                        {item?.is_urgent == 1 && (
                          <span className={styles.frequent}>
                            <img src={FrequentUserIcon} alt="" />
                            Urgent
                          </span>
                        )}
                        {item?.is_high_hiring == 1 && (
                          <span className={styles.frequent}>
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
                        {item?.details && (
                          <p>
                            <strong>Additional Details:</strong> {item?.details}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right Section - Lead Purchase */}
                    <div className={styles.leadActions}>
                      <button className={styles.purchaseButton}>
                        <img src={pendingImg} alt="pendingImg" />
                        {item?.status === "pending" ? "Pending" : "Pending"}
                      </button>

                      <div
                        className={styles.saveBtnBox}
                        style={{ position: "relative" }}
                      >
                        <button
                          style={{ position: "absolute" }}
                          className={styles.saveBtn}
                          onClick={() => handleUnArchive(item)}
                        >
                          {unarchiveLoader === item.id ? (
                            <Spin
                              indicator={
                                <LoadingOutlined
                                  spin
                                  style={{ color: "white" }}
                                />
                              }
                              size="small"
                            />
                          ) : (
                            "Unarchive"
                          )}
                        </button>
                      </div>
                      {/* <div className={styles.credits_wrapper}>
                      <span className={styles.credits}>
                        {item?.credit_score} Credits
                      </span>
                    </div> */}

                      {/* <div className={styles.mainText}>
                      <div>ACT FAST</div>
                    </div> */}
                      <div className={styles.responseStatus}>
                        Responded {dayjs().diff(dayjs(item?.created_at), "day")}
                        d ago
                      </div>
                      <div
                        className={styles.moreDetails}
                        onClick={() => handleOpen(item)}
                      >
                        More Details
                        <img
                          src={pendingArrowIcon}
                          alt="Response"
                          className={`${styles.arrowIcon} ${
                            selectedLead === item.id ? "" : styles.rotated
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                  {/* <div className={styles.viewDetailsBtnWrapper}>
                  <button
                    className={styles.viewDetailsBtn}
                    onClick={() => handleOpen(item)}
                  >
                    View Details{" "}
                    <img
                      src={viewDetailsArrow}
                      alt="..."
                      className={`${styles.arrowIcon} ${
                        selectedLead === item?.id ? "" : styles.rotated
                      }`}
                    />
                  </button>
                </div> */}
                </div>

                {/* MyResponseAccordion - same as MyResponse component */}
                {selectedLead === item?.id && (
                  <MyResponseAccordion
                    lead={selectedLead}
                    onBack={() => setSelectedLead(null)}
                    getPendingLeadList={archivedLeads.filter(
                      (lead) => lead.id === selectedLead
                    )}
                    setisChangePendingStatus={setisChangePendingStatus}
                  />
                )}
              </div>
            );
          })
        ) : (
          <div className={styles.noDataContainer}>No Archive Data Available</div>
        )}
      </div>

      {archivedLeads?.length > visibleCount && (
        <div className={styles.viewMoreBtnWrapper}>
          <button onMouseEnter={handleMouseEnter}>View More</button>
        </div>
      )}

      <ContactSuccessModal
        onClose={() => setModalOpen(false)}
        isOpen={isModalOpen}
        details={selectedItem}
      />

      {isopen && (
        <ContactConfirmModal
          onClose={(e) => {
            setIsOpen(false);
            if (e) {
              setTimeout(() => {
                setModalOpen(true);
              }, 1500);
            }
          }}
          enoughCredit={planpurcahse}
          confirmModal={isModalOpen}
          details={selectedItem}
        />
      )}
    </>
  );
};

export default ArchiveLeads;
