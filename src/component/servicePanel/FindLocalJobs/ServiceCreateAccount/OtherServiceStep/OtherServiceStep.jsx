import { useEffect, useRef, useState } from "react";
import styles from "./OtherServiceStep.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  pendingLeadData,
  registerUserData,
  searchService,
  setRegisterStep,
  setselectedServices,
  setService,
} from "../../../../../store/FindJobs/findJobSlice";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { showToast } from "../../../../../utils";
import LocationIcon from "../../../../../assets/Images/HowItWorks/locationImg.svg";
import { clearCompanyData } from "../../../../../store/Company/companyLookup";
import { getCityName } from "../../../../../store/Buyer/BuyerSlice";
import { extractAllParams } from "../../../../../utils/decodeURLParams";

const OtherServiceStep = ({
  prevStep,
  handleInputChange,
  formData,
  setFormData,
}) => {
  const [isPostcodeFromSuggestion, setIsPostcodeFromSuggestion] =
    useState(false);
  const { search } = useLocation();
  const allParams = extractAllParams(search || window.location.search);
  // Convert array to a comma-separated string
  const campaign = allParams.utm_campaign || "";
  const utm_source = allParams.utm_source || "";
  const utm_medium = allParams.utm_medium || "";
  const [Input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  const [randomFallback] = useState(
    () => Math.floor(Math.random() * (45 - 35 + 1)) + 35
  );
  const [isLoading, setIsLoading] = useState(false);
  const item = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [expandedRadius, setExpandedRadius] = useState(0);
  const debounceTimer = useRef(null);

  const {
    service,
    registerLoader,
    searchServiceLoader,
    selectedServices,
    pendingLead,
  } = useSelector((state) => state.findJobs);
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (Input.trim() !== "") {
        dispatch(
          searchService({
            search: Input,
            serviceid: formData?.service_id.toString(),
            serviceTitle: item?.serviceTitle || "",
          })
        );
      }
    }, 500);

    return () => {
      clearTimeout(delayDebounce);
      dispatch(setService([]));
    };
  }, [Input, dispatch]);

  const handlePostcode2Change = async (e) => {
    const postcodeValue = e.target.value;

    setFormData((prev) => ({ ...prev, postcode2: postcodeValue }));
    dispatch(
      setFormData({
        validPostCode2: false,
      })
    );

    const { name, value } = e.target;

    if (handleInputChange) handleInputChange(e);
    dispatch(
      setFormData({
        validPostCode2: false,
      })
    );

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      if (value && value.length >= 3) {
        fetchCityFromPostcode(value);
      }
    }, 1000);
  };

  const fetchCityFromPostcode = async (postcode) => {
    if (!postcode || postcode.length < 3) return;

    setIsLoading(true);
    try {
      const result = await dispatch(getCityName({ postcode: postcode }));

      let cityName, postcodeFromApi;
      if (result?.success) {
        cityName = result.data?.city;
        postcodeFromApi = result.data?.postcode;
      }

      if (cityName) {
        dispatch(
          setFormData({
            postcode2: postcodeFromApi || postcode,
            validPostCode2: true,
            coordinates2: {},
          })
        );

        showToast("success", "Location found successfully!");
      } else {
        showToast("error", "No city found for this postcode!");
      }
    } catch (error) {
      console.error("Error fetching city:", error);
      showToast("error", "No PIN code found! Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectService = (item) => {
    if (selectedServices?.length >= 5000) {
      showToast("error", "Please add more services in Lead Settings");
      return;
    }

    if (!selectedServices?.some((service) => service.id === item.id)) {
      dispatch(setselectedServices([...selectedServices, item]));
    }

    setInput("");
    dispatch(setService([]));
  };

  const handleRemoveService = (id) => {
    const updated = selectedServices?.filter((service) => service.id !== id);

    dispatch(setselectedServices(updated));

    if (updated.length === 0) {
      setFormData((prev) => ({
        ...prev,
        postcode2: "",
      }));
    }
  };

  const validateForm = () => {
    let newErrors = {};

    if (selectedServices.length > 0 && !formData.postcode2) {
      newErrors.postcode2 = "Please enter your postcode.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  useEffect(() => {
    if (selectedServices.length > 0) {
      setErrors((prev) => ({ ...prev, service_id: undefined }));
    }
  }, [selectedServices]);

  useEffect(() => {
    if (show) {
      window.scroll(0, 0);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [show]);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const handleSubmit = () => {
    const postcodeValue = formData?.postcode2?.trim();

    if (!postcodeValue) {
      showToast("error", "Please enter your postcode!");
      return;
    }

    if (!formData?.validPostCode2 && postcodeValue.length < 3) {
      showToast("error", "Please enter a valid postcode!");
      return;
    }

    let apicontion = validateForm();
    const serviceIds = Array.isArray(selectedServices)
      ? selectedServices?.map((service) => service.id).filter(Boolean)
      : [];

    const existingServiceIds = Array.isArray(formData?.service_id)
      ? formData.service_id.filter(Boolean)
      : [];

    const combinedServiceIds = [
      ...new Set([...existingServiceIds, ...serviceIds]),
    ];

    const serviceCategoryData = combinedServiceIds.join(", ");

    const payload = {
      ...formData,
      service_id: serviceCategoryData,
      form_status: 1,
      user_type: 1,
      active_status: 1,
      loggedUser: 1,
      businessname: formData.profile_name,
      nation_wide: formData.nation_wide ? 1 : 0,
      is_online: formData.is_online ? 1 : 0,
      miles2: selectedServices.length > 0 ? formData.miles2 : "",
      postcode2: selectedServices.length > 0 ? formData.postcode2 : "",
      expanded_radius:
        selectedServices.length > 0 ? formData.expanded_radius : "",
    };
    if (utm_source) payload.utm_source = utm_source;
    if (utm_medium) payload.utm_medium = utm_medium;
    if (campaign) payload.campaign = campaign;
    payload.coordinates = JSON.stringify(payload.coordinates);
    delete payload.password;
    delete payload.suite;
    delete payload.is_zipcode;
    delete payload.state;

    if (apicontion) {
      dispatch(registerUserData(payload)).then((result) => {
        if (result?.success) {
          showToast("success", result?.message || "Register successful!");
          navigate("/sellers/leads");
          dispatch(setService());
          dispatch(setRegisterStep(0));
          dispatch(clearCompanyData());
        }
      });
    }
  };

  const handleCloseModal = () => {
    setShow(false);
  };

  const DEBOUNCE_MS = 250;
  const debounceRef = useRef(null);

  const triggerSearch = (value) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const trimmed = value.trim();
      dispatch(
        searchService({
          search: trimmed === "" ? "" : trimmed.slice(0, 4),
          serviceTitle: item?.serviceTitle || "",
        })
      );
    }, DEBOUNCE_MS);
  };

  useEffect(() => {
    const selectedId = selectedServices.map((item) => item.id);
    const serviceId = {
      service_id: [formData?.service_id[0], ...selectedId].join(","),
    };

    dispatch(pendingLeadData(serviceId));
  }, [selectedServices]);

  const disableWithService = selectedServices?.length > 0;

  const handleExpandRadius = () => {
    setExpandedRadius((prev) => {
      const newRadius = prev + 20;

      dispatch(setFormData({ expanded_radius: newRadius }));

      return newRadius;
    });
  };

  useEffect(() => {
    if (formData?.postcode2) {
      dispatch(
        setFormData({
          validPostCode2: true,
        })
      );
    }
  }, [formData?.postcode2]);

  return (
    <div className={styles.parentContainer}>
      <div className={styles.container}>
        <div className={styles.headerContainer}>
          <h2 className={styles.otherService_heading}>
            Add any additional services you can provide
          </h2>
          <p className={styles.subHeading}>Get even more great leads.</p>
        </div>

        <div className={styles.card}>
          <p className={styles.label}>
            You've asked for leads for:{" "}
            <div className={styles.serviceTag}>
              {item?.serviceTitle
                ?.replace(/-/g, " ")
                .replace(/\b\w/g, (char) => char.toUpperCase())}
            </div>
          </p>

          <p className={styles.secondaryLabel}>
            We will also show you leads from
          </p>
          <div className={styles.selectedServices}>
            {selectedServices?.length > 0 &&
              selectedServices?.map((service) => (
                <span key={service.id} className={styles.selectedTag}>
                  {service.name}
                  <button
                    className={styles.removeBtn}
                    onClick={() => handleRemoveService(service.id)}
                  >
                    ✕
                  </button>
                </span>
              ))}
          </div>

          <div className={styles.searchInputContainer}>
            <input
              className={styles.searchInput}
              placeholder="Search for more services..."
              onFocus={() => {
                setIsFocused(true);
                setIsDropdownOpen(true);
                if (Input.trim() === "") {
                  dispatch(
                    searchService({
                      search: "",
                      serviceTitle: item?.serviceTitle || "",
                    })
                  );
                }
              }}
              onBlur={() => {
                setIsFocused(false);
              }}
              onChange={(e) => {
                const value = e.target.value;
                setInput(value);
                setIsDropdownOpen(true);
                setSelectedService(null);
                triggerSearch(value);
                if (!e.target.value) {
                  dispatch(setService([]));
                }
              }}
              value={Input}
            />

            {service?.length > 0 && (
              <div className={styles.searchResults}>
                {searchServiceLoader ? (
                  <Spin />
                ) : (
                  <>
                    {/* {service.map((item) => (
                      <p
                        key={item.id}
                        className={styles.searchItem}
                        onClick={() => handleSelectService(item)}
                      >
                        {item.name}
                      </p>
                    ))} */}
                    {service
                      ?.filter(
                        (s) =>
                          s.name?.toLowerCase() !==
                          item?.serviceTitle?.replace(/-/g, " ")?.toLowerCase()
                      )
                      .map((item) => (
                        <p
                          key={item.id}
                          className={styles.searchItem}
                          onClick={() => handleSelectService(item)}
                        >
                          {item.name}
                        </p>
                      ))}
                  </>
                )}
              </div>
            )}
          </div>

          <label className={styles.checkboxContainer}>
            <input
              type="checkbox"
              className={styles.checkbox}
              name="auto_bid"
              checked={formData?.auto_bid === 1}
              onChange={(e) => handleInputChange(e)}
            />
            <span className={styles.labelText}>Auto Bid</span>
          </label>
          <div className={styles.newContent}>
            What areas do you provide these additional services in?
          </div>
          <div className={styles.milesBox}>
            <div className={styles.dropdownWrapper}>
              <select
                className={styles.customSelect}
                name="miles2"
                value={formData?.miles2}
                onChange={handleInputChange}
                disabled={!disableWithService}
              >
                <option value="1">1 mile</option>
                <option value="2">2 miles</option>
                <option value="5">5 miles</option>
                <option value="10">10 miles</option>
                <option value="20">20 miles</option>
                <option value="30">30 miles</option>
                <option value="50">50 miles</option>
                <option value="100">100 miles</option>
              </select>
            </div>
            <div className={styles.inputWrapper}>
              <img src={LocationIcon} alt="" />
              <input
                type="text"
                id="autocomplete-postcode"
                placeholder="Enter Postcode (No Spaces)"
                className={`${styles.input} ${
                  errors.postcode2 ? styles.errorBorder : ""
                } ${isLoading ? styles.loading : ""}`}
                name="postcode2"
                value={formData?.postcode2 || ""}
                onChange={handlePostcode2Change}
                disabled={!disableWithService || isLoading}
              />
              {isLoading && <div className={styles.spinner}></div>}
            </div>
          </div>
          {errors.postcode2 && (
            <p className={styles.errorText}>{errors.postcode2}</p>
          )}
          <div className={styles.radiusBtn}>
            <button
              className={styles.expandBtn}
              disabled={!disableWithService}
              onClick={handleExpandRadius}
            >
              Expand Radius
            </button>
          </div>
          {expandedRadius > 0 && (
            <div className={styles.radiusText}>
              {expandedRadius} miles added
            </div>
          )}
          <div className={styles.leadInfo_wrapper}>
            <div className={styles.leadInfo}>
              <h1 className={styles.leadCount}>
                {pendingLead != 0 ? pendingLead : randomFallback}
              </h1>
              <p className={styles.leadText}>current available leads</p>
            </div>
          </div>
          <div className={styles.buttonContainer}>
            <button
              type="button"
              className={styles.backButton}
              onClick={prevStep}
            >
              Back
            </button>
            <button
              type="button"
              className={styles.nextButton}
              onClick={handleSubmit}
            >
              {registerLoader ? (
                <Spin
                  indicator={
                    <LoadingOutlined spin style={{ color: "white" }} />
                  }
                />
              ) : (
                "Continue"
              )}
            </button>
          </div>
        </div>
      </div>
      {show && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2 className={styles.heading}>
              Are you sure that you want <br /> to Register?
            </h2>

            <div className={styles.buttonGroup}>
              <button
                className={styles.backButton}
                onClick={handleCloseModal}
                disabled={registerLoader}
              >
                Back
              </button>
              <button className={styles.continueButton} onClick={handleSubmit}>
                {registerLoader ? (
                  <Spin
                    indicator={
                      <LoadingOutlined spin style={{ color: "white" }} />
                    }
                  />
                ) : (
                  "Continue"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OtherServiceStep;
