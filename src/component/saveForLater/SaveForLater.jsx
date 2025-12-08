import { useEffect, useRef, useState } from "react";
import styles from "./SaveForLater.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getAddManualBidData,
  getLeadFiterApiList,
  getSaveLaterListData,
  totalCreditData,
} from "../../store/LeadSetting/leadSettingSlice";
import BlueSmsIcon from "../../assets/Images/Leads/BlueSmsIcon.svg";
import BluePhoneIcon from "../../assets/Images/Leads/BluePhoneIcon.svg";
import VerifiedPhoneIcon from "../../assets/Images/Leads/VerifiedPhoneIcon.svg";
import AdditionalDetailsIcon from "../../assets/Images/Leads/AdditionalDetailsIcon.svg";
import FrequentUserIcon from "../../assets/Images/Leads/FrequentUserIcon.svg";
import { showToast } from "../../utils";
import viewDetailsArrow from "../../assets/Images/Setting/viewDetailsArrow.svg";
import SavedViewDetails from "./SavedViewDetails/SaveViewDetails";
import FeelingStuckFooter from "../Leads/LeadLists/FeelingStuckFooter/FeelingStuckFooter";
import ContactSuccessModal from "../Leads/LeadLists/ContactSuccessModal";
import ContactConfirmModal from "../Leads/LeadLists/ContactConfirmModal";
import FilterIcon from "../../assets/Images/Leads/FilterIcon.svg";
import FilterBlackIcon from "../../assets/Images/Leads/blackFilter.svg";
import { Select } from "antd";
import { SwapOutlined } from "@ant-design/icons";
import MatchingLeadsFilter from "../Leads/LeadLists/MatchingLeads/MatchingLeadsFilter";

const SaveForLater = () => {
  const { Option } = Select;
  const dispatch = useDispatch();
  const scrollContainerRef = useRef(null);
  const { userToken } = useSelector((state) => state.auth);
  const [visibleCount, setVisibleCount] = useState(5);
  const [isopen, setIsOpen] = useState(false);
  const [planpurcahse, setPlanPurchase] = useState("");
  const { registerData } = useSelector((state) => state.findJobs);
  const { saveForLaterDataList, totalCredit } = useSelector(
    (state) => state.leadSetting
  );
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("Newest");
  const sortOptions = ["Newest", "Oldest"];
  const [selectedFilter, setSelectedFilter] = useState("Sort by Credits");
  const requiredData =
    Array.isArray(saveForLaterDataList) &&
    Array.isArray(saveForLaterDataList[0]?.savedLeads)
      ? saveForLaterDataList[0]?.savedLeads
      : saveForLaterDataList;

  const data = requiredData?.length;
  const filterOptions = [
    "Credit Value High",
    "Credit Value Medium",
    "Credit Value Low",
  ];

  const getSortTypeValue = (sortOption) => {
    switch (sortOption) {
      case "Newest":
        return "Newest";
      case "Oldest":
        return "Oldest";
      default:
        return "Newest";
    }
  };

  const handleSortChange = (value) => {
    setSelectedSort(value);
    if (userToken?.remember_tokens || registerData?.remember_tokens) {
      const filterData = {
        user_id: userToken?.remember_tokens
          ? userToken?.remember_tokens
          : registerData?.remember_tokens,
        sort_type: getSortTypeValue(value),
        page_type: "saved_leads",
      };
      dispatch(getLeadFiterApiList(filterData, true));
    }
  };

  const getCreditFilterValue = (filterOption) => {
    switch (filterOption) {
      case "Credit Value High":
        return "High";
      case "Credit Value Medium":
        return "Medium";
      case "Credit Value Low":
        return "Low";
      default:
        return "High";
    }
  };

  const handleCloseModal = () => {
    setIsFilterModalOpen(false);
  };

  const handleFilterClick = () => {
    setIsFilterModalOpen(true);
  };

  const handleFilterChange = (value) => {
    setSelectedFilter(value);
    if (userToken?.remember_tokens || registerData?.remember_tokens) {
      const filterData = {
        user_id: userToken?.remember_tokens
          ? userToken?.remember_tokens
          : registerData?.remember_tokens,
        credit_filter: getCreditFilterValue(value),
        page_type: "saved_leads",
      };
      dispatch(getLeadFiterApiList(filterData, true));
    }
  };

  useEffect(() => {
    const data = {
      user_id: userToken?.remember_tokens
        ? userToken?.remember_tokens
        : registerData?.remember_tokens,
      sort_type: getSortTypeValue(selectedSort),
      credit_filter: getCreditFilterValue(selectedFilter),
      page_type: "saved_leads",
    };
    dispatch(getSaveLaterListData(data));
  }, []);

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
        page_type: "saved_leads",
      };

      dispatch(totalCreditData(data));
      dispatch(getSaveLaterListData(data));
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
    // Condition 2: Not enough credits
    if (Number(totalCredit?.total_credit) < Number(item?.credit_score)) {
      setIsOpen(true);
      return;
    }
    if (Number(totalCredit?.total_credit) > Number(item?.credit_score)) {
      addManualBidData(item);
      return;
    }
  };

  const [clikedDetails, setClickedDetails] = useState({});
  const [viewDetailsOpen, setViewDetaisOpen] = useState(null);

  const handleViewDetais = (item) => {
    setClickedDetails(item);
    if (viewDetailsOpen === item?.id) {
      setViewDetaisOpen(null);
    } else {
      setViewDetaisOpen(item?.id);
    }
  };
  const handleMouseEnter = () => {
    setVisibleCount((prev) => prev + 5);
  };
  const handleOpenClose = (e) => {
    setIsOpen(false);
    if (e) {
      setTimeout(() => {
        setModalOpen(true);
      }, 2000);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= fullHeight - 100) {
        setVisibleCount((prev) => prev + 5);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className={styles.maincontainer}>
        <div className={styles.container}>
          <div className={styles.textSection}>
            <h2 className={styles.heading}>{data} matching leads</h2>
          </div>

          <div className={styles.dualDropdownsContainer}>
            <Select
              value={selectedSort}
              onChange={handleSortChange}
              className={styles.selectDropdown}
              dropdownMatchSelectWidth={false}
              suffixIcon={
                <SwapOutlined
                  style={{
                    fontSize: "14px",
                    color: "#000",
                    paddingBottom: "8px",
                    transform: "rotate(90deg)",
                    transition: "transform 0.3s ease",
                  }}
                />
              }
            >
              {sortOptions.map((opt) => (
                <Option key={opt} value={opt}>
                  {opt}
                </Option>
              ))}
            </Select>

            <Select
              value={selectedFilter}
              onChange={handleFilterChange}
              className={styles.selectDropdown}
              dropdownMatchSelectWidth={false}
              suffixIcon={
                <SwapOutlined
                  style={{
                    fontSize: "14px",
                    color: "#000",
                    paddingBottom: "8px",
                    transform: "rotate(90deg)",
                    transition: "transform 0.3s ease",
                  }}
                />
              }
            >
              <Option value="Sort by Credits" disabled>
                Sort by Credits
              </Option>

              {filterOptions.map((opt) => (
                <Option key={opt} value={opt}>
                  {opt}
                </Option>
              ))}
            </Select>

            <div className={styles.actionButtons}>
              <button
                className={styles.filterButton}
                onClick={handleFilterClick}
              >
                <img style={{ cursor: "pointer" }} src={FilterIcon} alt="" />{" "}
                Filter
              </button>
            </div>
          </div>

          {isFilterModalOpen && (
            <MatchingLeadsFilter
              onClose={handleCloseModal}
              saved_leads={true}
            />
          )}
        </div>

        <div className={styles.dualDropdownsContainers}>
          <Select
            value={selectedSort}
            onChange={handleSortChange}
            dropdownMatchSelectWidth={false}
            className={styles.customSelect}
            suffixIcon={
              <SwapOutlined
                style={{
                  fontSize: "14px",
                  color: "#000",
                  paddingBottom: "8px",
                  transform: "rotate(90deg)",
                  transition: "transform 0.3s ease",
                }}
              />
            }
          >
            {sortOptions.map((opt) => (
              <Option key={opt} value={opt}>
                {opt}
              </Option>
            ))}
          </Select>

          <Select
            value={selectedFilter}
            onChange={handleFilterChange}
            dropdownMatchSelectWidth={false}
            className={styles.customSelect}
            suffixIcon={
              <SwapOutlined
                style={{
                  fontSize: "14px",
                  color: "#000",
                  transform: "rotate(90deg)",
                  transition: "transform 0.3s ease",
                }}
              />
            }
          >
            {/* Default Disabled Option */}
            <Option value="Sort by Credits" disabled>
              Sort by Credits
            </Option>

            {filterOptions.map((opt) => (
              <Option key={opt} value={opt}>
                {opt}
              </Option>
            ))}
          </Select>

          <div className={styles.actionButton}>
            <button
              className={styles.filterButtons}
              onClick={handleFilterClick}
            >
              <img src={FilterBlackIcon} alt="" /> Filter
            </button>
          </div>
        </div>

        {requiredData?.length === 0 && (
          <div className={styles.noDataContainer}>
            <h2>No Saved Leads Available</h2>
          </div>
        )}
        <div className={styles.scrollContainer} ref={scrollContainerRef}>
          {requiredData?.slice(0, visibleCount)?.map((item) => {
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

                            <p>{item?.postcode?.split(" ")[0]}</p>
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
                              ? `+44${item?.phone.substring(0, 2)}${"*".repeat(
                                  item?.phone.length - 2
                                )}`
                              : "N/A"}
                          </span>
                        </div>
                        <div className={styles.contactItem}>
                          <img src={BlueSmsIcon} alt="" />
                          <span>
                            {item?.customer?.email
                              ? `${item?.customer?.email
                                  .split("@")[0]
                                  .substring(0, 2)}${"*".repeat(
                                  Math.max(
                                    0,
                                    item?.customer?.email.split("@")[0].length -
                                      2
                                  )
                                )}@${item?.customer?.email.split("@")[1]}`
                              : "N/A"}
                          </span>
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

                    {/* Right Section - Lead Purchase */}
                    <div className={styles.leadActions}>
                      <button
                        className={styles.purchaseButton}
                        onClick={() => handleContinue(item)}
                      >
                        Contact
                      </button>
                      <span className={styles.credits}>
                        {item?.credit_score} Credits
                      </span>

                      <div className={styles.mainText}>
                        <div>ACT FAST</div>{" "}
                      </div>
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
                          viewDetailsOpen == item?.id ? "" : styles.rotated
                        }`}
                      />
                    </button>
                  </div>
                </div>
                {viewDetailsOpen == item?.id && (
                  <SavedViewDetails saveForLaterDataList={item} />
                )}
              </>
            );
          })}
        </div>
        {saveForLaterDataList?.[0]?.savedLeads?.length > visibleCount && (
          <div className={styles.viewMoreBtnWrapper}>
            <button onMouseEnter={handleMouseEnter}>View More</button>
          </div>
        )}
        <FeelingStuckFooter />
      </div>
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
        />
      )}
    </>
  );
};
export default SaveForLater;
