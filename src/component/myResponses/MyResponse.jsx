import { useEffect, useState } from "react";
import styles from "./MyResponse.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getBuyerActivitiesApi,
  getHiredLeadDataApi,
  getLeadProfileRequestList,
  getPendingLeadDataApi,
  getSellerRecommendedApi,
  purchaseTypeHiredStatusApi,
  purchaseTypeStatusApi,
  setLeadListProfileLoader,
  getSellerNotesApi,
} from "../../store/LeadSetting/leadSettingSlice";
import BlueSmsIcon from "../../assets/Images/Leads/BlueSmsIcon.svg";
import BluePhoneIcon from "../../assets/Images/Leads/BluePhoneIcon.svg";
import VerifiedPhoneIcon from "../../assets/Images/Leads/VerifiedPhoneIcon.svg";
import AdditionalDetailsIcon from "../../assets/Images/Leads/AdditionalDetailsIcon.svg";
import FrequentUserIcon from "../../assets/Images/Leads/FrequentUserIcon.svg";
import { useNavigate } from "react-router-dom";
import pendingImg from "../../assets/Images/MyResponse/PendingBtnImg.svg";
import HiredImg from "../../assets/Images/MyResponse/HiredBtnImg.svg";
import HiredClickImg from "../../assets/Images/MyResponse/RightClickHiredImg.svg";
import MyResponseAccordion from "./MyResponseAccordian/MyResponseAccordian";
import pendingArrowIcon from "../../assets/Images/Leads/arrowLeadImg.svg";
import { Select } from "antd";
import moment from "moment";
import HireUserIcon from "../../assets/Images/MyResponse/hiringbadge.svg";
import { showToast } from "../../utils";
import FeelingStuckFooter from "../Leads/LeadLists/FeelingStuckFooter/FeelingStuckFooter";

const purchaseOptions = [
  "All Purchase Types",
  "Manual Bid",
  "Autobid",
  "Request Reply",
];
const MyResponse = () => {
  const { Option } = Select;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("pending");
  const [selectedLead, setSelectedLead] = useState(null);
  const [purchaseType, setPurchaseType] = useState("All Purchase Types");

  const { userToken } = useSelector((state) => state.auth);
  const { registerData } = useSelector((state) => state.findJobs);
  const { data } = useSelector((state) => state.leadSetting);

  const user_id = userToken?.remember_tokens || registerData?.remember_tokens;

  const handleProfieView = (item) => {
    navigate(`/pending/view-profile/${item?.customer_id}?id=${item?.id}`);
  };

  useEffect(() => {
    dispatch(getSellerRecommendedApi({ user_id }));
    dispatch(getPendingLeadDataApi({ user_id }));
  }, [dispatch, user_id]);

  const handlePendingApi = () => {
    setSelectedTab("pending");
    dispatch(getPendingLeadDataApi({ user_id })).then((result) => {
      if (result.success) {
      }
    });
  };
  const handleHiredApi = () => {
    dispatch(getHiredLeadDataApi({ user_id })).then((result) => {
      if (result?.success) {
        setSelectedTab("hired");

        const activityData = {
          buyer_id: item?.customer_id,
          user_id: userToken?.remember_tokens || registerData?.remember_tokens,
          lead_id: item?.id,
        };
        dispatch(getBuyerActivitiesApi(activityData));
      } else {
        showToast("error", result?.message || "Failed to load hired leads.");
      }
    });
  };

  const getLeadsToDisplay = () => {
    return data;
  };

  const handleOpen = (item) => {
    if (item?.id == selectedLead) {
      setSelectedLead(null);
    } else {
      dispatch(setLeadListProfileLoader(true));

      setSelectedLead(item?.id);
    }

    const activityData = {
      buyer_id: item?.customer_id,
      user_id: userToken?.remember_tokens
        ? userToken?.remember_tokens
        : registerData?.remember_tokens,
      lead_id: item?.id,
    };
    dispatch(getBuyerActivitiesApi(activityData)).then((result) => {
      if (result) {
        const data = {
          customer_id: item?.customer_id,
          lead_id: item?.id,
          user_id: userToken?.remember_tokens
            ? userToken?.remember_tokens
            : registerData?.remember_tokens,
        };
        dispatch(getLeadProfileRequestList(data));
      }
    });
    dispatch(getSellerNotesApi(activityData)).then((result) => {
      if (result) {
        const data = {
          customer_id: item?.customer_id,
          lead_id: item?.id,
          user_id: userToken?.remember_tokens
            ? userToken?.remember_tokens
            : registerData?.remember_tokens,
        };
      }
    });
  };

  const handlePurchaseChange = (value) => {
    setPurchaseType(value);
    if (selectedTab === "pending") {
      const purchaseData = {
        user_id: userToken?.remember_tokens
          ? userToken?.remember_tokens
          : registerData?.remember_tokens,
        purchase_type: value,
      };

      dispatch(purchaseTypeStatusApi(purchaseData));
    } else {
      const hiredPurchaseData = {
        user_id: userToken?.remember_tokens
          ? userToken?.remember_tokens
          : registerData?.remember_tokens,
        purchase_type: value,
      };
      dispatch(purchaseTypeHiredStatusApi(hiredPurchaseData));
    }
  };
  const handlePhoneOpen = (item) => {
    const phoneNumber = item?.phone;
    if (phoneNumber) {
      const phoneUrl = `tel:${phoneNumber}`;
      window.location.href = phoneUrl;
    } else {
      showToast("error", "Phone number is not available.");
    }
  };
  const handleEmailOpen = (item) => {
    const email = item?.customer?.email;
    if (email) {
      const mailtoUrl = `mailto:${email}`;
      window.location.href = mailtoUrl;
    } else {
      showToast("error", "Email address is not available.");
    }
  };

  return (
    <div className={styles.maincontainer}>
      <div className={styles.mainTextBox}>
        <div className={styles.headerBox}>
          <div className={styles.emptySpace}>{""}</div>
          <div className={styles.headerBtn}>
            <button
              className={`${styles.filterButton} ${
                selectedTab === "pending" ? styles.activeButton : ""
              }`}
              onClick={handlePendingApi}
            >
              <img src={pendingImg} alt="pendingImg" /> Pending
            </button>
            <button
              className={`${styles.filterButton} ${
                selectedTab === "hired" ? styles.activeButton : ""
              }`}
              onClick={handleHiredApi}
            >
              {selectedTab === "hired" ? (
                <img src={HiredClickImg} alt="..." />
              ) : (
                <img src={HiredImg} alt="hired" />
              )}{" "}
              Hired
            </button>
          </div>

          <div
            style={{ display: "flex", marginRight: 20, gap: 10 }}
            className={styles.purchaseSelect}
          >
            <Select
              value={purchaseType}
              onChange={handlePurchaseChange}
              className={styles.antSelect}
              dropdownMatchSelectWidth={false}
              style={{ width: 172, height: 42 }}
            >
              {purchaseOptions.map((option) => (
                <Option key={option} value={option}>
                  {option}
                </Option>
              ))}
            </Select>
          </div>
        </div>
      </div>
      <div className={styles.filterButtonsBox}>
        <div className={styles.mobileTabs}>
          <button
            className={`${styles.filterButton} ${
              selectedTab === "pending" ? styles.activeButton : ""
            }`}
            onClick={handlePendingApi}
          >
            <img src={pendingImg} alt="pendingImg" /> Pending
          </button>
          <button
            className={`${styles.filterButton} ${
              selectedTab === "hired" ? styles.activeButton : ""
            }`}
            onClick={handleHiredApi}
          >
            {selectedTab === "hired" ? (
              <img src={HiredClickImg} alt="..." />
            ) : (
              <img src={HiredImg} alt="hired" />
            )}{" "}
            Hired
          </button>
        </div>

        <div style={{ display: "flex" }} className={styles.purchaseSelect}>
          <Select
            value={purchaseType}
            onChange={handlePurchaseChange}
            className={styles.antSelect}
            dropdownMatchSelectWidth={false}
          >
            {purchaseOptions.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        </div>
      </div>

      {getLeadsToDisplay()?.length ? (
        getLeadsToDisplay()?.map((item, idx) => (
          <div key={idx}>
            <div className={styles.card}>
              <div className={styles.infoContainer}>
                <div className={styles.userInfo}>
                  <div className={styles.userDetails}>
                    <div className={styles.avatar}>
                      {item?.customer?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div className={styles.details}>
                      <h3>{item?.customer?.name}</h3>
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
                    <span onClick={() => handlePhoneOpen(item)}>
                      +44{item?.phone}
                    </span>
                  </div>
                  <div className={styles.contactItem}>
                    <img src={BlueSmsIcon} alt="" />
                    {item?.customer?.email}
                  </div>
                </div>
                {item?.profile_view && item?.profile_view_time && (
                  <div className={styles.profile_view}>
                    <p>
                      <div>
                        <img src={HiredImg} alt="..." />

                        {item?.profile_view}
                      </div>

                      <span>{item?.profile_view_time}</span>
                    </p>
                  </div>
                )}
              </div>

              <div className={styles.jobDetails}>
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
                      {" "}
                      <img src={FrequentUserIcon} alt="" />
                      Urgent
                    </span>
                  )}
                  {item?.is_high_hiring == 1 && (
                    <span className={styles.frequentHir}>
                      {" "}
                      <img src={HireUserIcon} alt="" />
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
                {selectedTab === "pending" ? (
                  <>
                    <button className={styles.purchaseButton}>
                      <img src={pendingImg} alt="pendingImg" />{" "}
                      {item?.status === "pending" ? "Pending" : "Pending"}
                    </button>
                  </>
                ) : (
                  <>
                    <button className={styles.purchaseButton}>
                      <img src={HiredClickImg} alt="HiredImg" />{" "}
                      {item?.status === "hired" ? "Hired" : "Hired"}
                    </button>
                  </>
                )}

                <div className={styles.responseStatus}>
                  Responded {moment().diff(moment(item?.created_at), "days")}d
                  ago
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

              <div className={styles.leadAction}>
                <div className={styles.responseStatus}>
                  Responded {moment().diff(moment(item?.created_at), "days")}d
                  ago
                </div>
                {selectedTab === "pending" ? (
                  <>
                    <button className={styles.purchaseButton}>
                      <img src={pendingImg} alt="pendingImg" />{" "}
                      {item?.status === "pending" ? "Pending" : "Pending"}
                    </button>
                  </>
                ) : (
                  <>
                    <button className={styles.purchaseButton}>
                      <img src={HiredClickImg} alt="HiredImg" />{" "}
                      {item?.status === "hired" ? "Hired" : "Hired"}
                    </button>
                  </>
                )}

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

            {selectedLead === item?.id && (
              <MyResponseAccordion
                lead={selectedLead}
                onBack={() => setSelectedLead(null)}
                getPendingLeadList={data.filter(
                  (item) => item.id === selectedLead
                )}
              />
            )}
          </div>
        ))
      ) : (
        <div className={styles.NoDataText}>
          No {selectedTab === "pending" ? "Pending" : "Hired"} Data Available
        </div>
      )}

      <FeelingStuckFooter />
    </div>
  );
};

export default MyResponse;
