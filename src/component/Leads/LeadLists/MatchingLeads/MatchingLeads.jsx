import React, { useEffect, useRef, useState, useCallback } from "react";
import styles from "./MatchingLeads.module.css";
import SettingIcon from "../../../../assets/Images/Leads/SettingIcon.svg";
import LocationIcon from "../../../../assets/Images/Leads/WhiteLocationIcon.svg";
import FilterIcon from "../../../../assets/Images/Leads/FilterIcon.svg";
import EditIcon from "../../../../assets/Images/Leads/EditIconWhite.svg";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getLeadFiterApiList,
  getleadPreferencesList,
  getLeadRequestList,
  getLocationLead,
  addServiceLead,
} from "../../../../store/LeadSetting/leadSettingSlice";

import {
  searchService,
  setService,
  searchAvailableService,
  getPopularServiceListUser,
  setPopularList,
} from "../../../../store/FindJobs/findJobSlice";
import MatchingLeadsFilter from "./MatchingLeadsFilter";
import FilterBlackIcon from "../../../../assets/Images/Leads/blackFilter.svg";
import { Select } from "antd";
import { SwapOutlined } from "@ant-design/icons";

const { Option } = Select;
import { Popover } from "antd";
import AddServiceModal from "../../LeadAddServiceModal";

const MatchingLeads = () => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("Newest");
  const sortOptions = ["Newest", "Oldest"];

  const [selectedFilter, setSelectedFilter] = useState("Sort by Credits");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { popularList } = useSelector((state) => state.findJobs);

  const filterOptions = [
    "Credit Value High",
    "Credit Value Medium",
    "Credit Value Low",
  ];

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { leadRequestList, getlocationData, preferenceList, totalCredit } =
    useSelector((state) => state.leadSetting);
  const { searchServiceLoader, service, registerData } = useSelector(
    (state) => state.findJobs
  );
  const { userToken } = useSelector((state) => state.auth);
  const [selectedServices, setSelectedServices] = useState([]);
  const data = leadRequestList?.length;
  const locationLength = getlocationData?.length;

  const triggerRef = useRef(null);
  const stickyRef = useRef(null);

  useEffect(() => {
    const data = {
      user_id: userToken?.remember_tokens
        ? userToken?.remember_tokens
        : registerData?.remember_tokens,
    };
    dispatch(getleadPreferencesList(data));
  }, []);

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
  const handleService = () => {
    setIsModalOpen(true);
    setInput(""); // reset the input field
    dispatch(setService([]));
    setSelectedServices([]);
  };
  useEffect(() => {
    if (isDropdownOpen && input.trim() !== "") {
      const delayDebounce = setTimeout(() => {
        dispatch(
          searchAvailableService({
            user_id: userToken?.id ? userToken?.id : registerData?.id,
            search: input,
          })
        );
      }, 500);

      return () => clearTimeout(delayDebounce);
    }
  }, [input, dispatch, isDropdownOpen]);

  const handleSelectService = useCallback(
    (item) => {
      setInput("");
      setIsDropdownOpen(false);

      setSelectedServices((prev) => {
        const isAlreadySelected = prev.some(
          (service) => service.id === item.id
        );
        return isAlreadySelected ? prev : [...prev, item];
      });

      setTimeout(() => dispatch(setService([])), 100);
    },
    [dispatch]
  );
  const handleSubmitData = useCallback(() => {
    const serviceIds = selectedServices.map((item) => item.id).join(",");

    const serviceDataList = {
      user_id: userToken?.remember_tokens,
      service_id: serviceIds,
    };

    dispatch(addServiceLead(serviceDataList)).then((result) => {
      if (result?.success) {
        dispatch(
          getleadPreferencesList({
            user_id: userToken?.remember_tokens
              ? userToken?.remember_tokens
              : registerData?.remember_tokens,
          })
        );
        const data = {
          user_id: userToken?.remember_tokens
            ? userToken?.remember_tokens
            : registerData?.remember_tokens,
        };
        dispatch(getLocationLead(data));
        setIsModalOpen(false);
        setSelectedServices([]); // Clear after submission
      }
    });
  }, [selectedServices, userToken, dispatch]);

  const handleRemoveService = useCallback((id) => {
    setSelectedServices((prev) => prev.filter((service) => service.id !== id));
  }, []);

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
      };
      dispatch(getLeadFiterApiList(filterData));
    }
  };

  const handleFilterChange = (value) => {
    setSelectedFilter(value);
    if (userToken?.remember_tokens || registerData?.remember_tokens) {
      const filterData = {
        user_id: userToken?.remember_tokens
          ? userToken?.remember_tokens
          : registerData?.remember_tokens,
        credit_filter: getCreditFilterValue(value),
      };
      dispatch(getLeadFiterApiList(filterData));
    }
  };

  const handleEdit = () => {
    navigate("/settings/leads/my-services");
  };

  const handleFilterClick = () => {
    setIsFilterModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsFilterModalOpen(false);
  };

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

  // ✅ Popover dropdown content renderer
  const renderOptions = (options, currentValue, onChange) => (
    <div className={styles.popoverContent}>
      {options.map((opt) => (
        <div
          key={opt}
          className={`${styles.optionItem} ${
            currentValue === opt ? styles.active : ""
          }`}
          onClick={() => {
            onChange(opt);
            setOpenPopover(null);
          }}
        >
          {opt}
        </div>
      ))}
    </div>
  );

  return (
    <>
      <div className={styles.container}>
        <div className={styles.textSection}>
          <h2 className={styles.heading}>{data} matching leads</h2>
          <p className={styles.subText}>
            <span
              className={styles.subTextSpan}
              onClick={() => setIsModalOpen(true)}
            >
              <img src={SettingIcon} alt="" /> {preferenceList?.length} services{" "}
            </span>
          </p>
        </div>

        <AddServiceModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          input={input}
          setInput={setInput}
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={setIsDropdownOpen}
          service={service}
          searchServiceLoader={searchServiceLoader}
          handleSelectService={handleSelectService}
          handleSubmitData={handleSubmitData}
          handleRemoveService={handleRemoveService}
          selectedServices={selectedServices}
          popularList={popularList}
        />
        <div className={styles.btnDisplay}>
          <button className={styles.editButtons} onClick={handleEdit}>
            Edit <img src={EditIcon} alt="" />
          </button>
        </div>

        {/* Desktop Dropdowns */}
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

          {/* Second Dropdown - Credit Value */}

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

          <div className={styles.actionButtons}>
            <button className={styles.filterButton} onClick={handleFilterClick}>
              <img style={{ cursor: "pointer" }} src={FilterIcon} alt="" />{" "}
              Filter
            </button>
            <Link
              style={{ textDecoration: "none" }}
              to="/settings/leads/my-services"
              className={styles.editButton}
            >
              Edit <img src={EditIcon} alt="" />
            </Link>
          </div>
        </div>

        {isFilterModalOpen && (
          <MatchingLeadsFilter onClose={handleCloseModal} />
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
          <button className={styles.filterButtons} onClick={handleFilterClick}>
            <img src={FilterBlackIcon} alt="" /> Filter
          </button>
        </div>
      </div>

      <div className={styles.desktopBtn}>
        <div ref={triggerRef} style={{ height: "1px" }}></div>
        <div ref={stickyRef} className={styles.creditsLeftContainer}>
          <button className={styles.creditsButton} onClick={handleEdit}>
            You have {totalCredit?.total_credit ?? "0"} Credits Left
          </button>
        </div>
      </div>
    </>
  );
};

export default MatchingLeads;
