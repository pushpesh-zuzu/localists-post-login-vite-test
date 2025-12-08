import styles from "./search.module.css";
import { SearchOutlined } from "@ant-design/icons";
import calloutArrow from "../../../assets/Images/callOutArrow.svg";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getPopularServiceList,
  searchService,
  setService,
} from "../../../store/FindJobs/findJobSlice";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { showToast } from "../../../utils";
import {
  questionAnswerData,
  setbuyerRequestData,
  setBuyerStep,
  setcitySerach,
  getCityName,
  registerQuoteCustomer,
} from "../../../store/Buyer/BuyerSlice";
import BuyerRegistration from "../../buyerPanel/PlaceNewRequest/BuyerRegistration/BuyerRegistration";
import location from "../../../assets/Images/HowItWorks/locationImg.svg";
import NavigationDetectorWithConfirmations from "../../common/navigationDetected/NavigationDetectorWithConfirmations";
import NavigationDetectorDesktop from "../../common/navigationDetected/NavigationDetectorDesktop";

const SearchProfessionals = ({ nextStep, popularList = [], popularLoader }) => {
  const [Input, setInput] = useState("");
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPincodeFromDropdown, setIsPincodeFromDropdown] = useState(false);
  const [postalCodeValidate, setPostalCodeValidate] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isPostcodeSelected, setIsPostcodeSelected] = useState(false);
  const [isCheckingPostcode, setIsCheckingPostcode] = useState(false);
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const { service, searchServiceLoader } = useSelector(
    (state) => state.findJobs
  );
  const [selectedServiceId, setSelectedServiceId] = useState({
    id: null,
    name: "",
  });
  const [show, setShow] = useState(false);
  const { userToken } = useSelector((state) => state.auth);
  const [placeholder, setPlaceholder] = useState("Search service... ");
  const divRef = useRef(null);

  useEffect(() => {
    const updatePlaceholder = () => {
      if (window.innerWidth <= 768) {
        setPlaceholder("Search service...");
      } else {
        setPlaceholder("Search service... ");
      }
    };
    updatePlaceholder();
    window.addEventListener("resize", updatePlaceholder);
    return () => window.removeEventListener("resize", updatePlaceholder);
  }, []);

  const handleClose = () => {
    setShow(false);
    setInput("");
    setPincode("");
    setSelectedService("");
  };

  useEffect(() => {
    const pendingModal = JSON.parse(localStorage.getItem("pendingBuyerModal"));
    if (pendingModal?.shouldOpen) {
      setSelectedServiceId({
        id: pendingModal.serviceId,
        name: pendingModal.serviceName,
      });
      dispatch(setbuyerRequestData(pendingModal.buyerRequest));
      dispatch(setcitySerach(pendingModal.city));
      setShow(true);
      dispatch(setBuyerStep(7));
    }
  }, [dispatch]);

  // useEffect(() => {
  //   if (
  //     typeof window !== "undefined" &&
  //     (!popularList || popularList.length === 0)
  //   ) {
  //     dispatch(getPopularServiceList());
  //   }
  //   return () => {
  //     dispatch(setService([]));
  //   };
  // }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (isDropdownOpen && Input.trim() !== "") {
        dispatch(searchService({ search: Input }));
      }
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [Input, dispatch, isDropdownOpen]);

  const handleSelectService = useCallback(
    (item) => {
      setInput(item.name);
      setSelectedService(item);
      setIsDropdownOpen(false);
      setTimeout(() => dispatch(setService([])), 100);
    },
    [dispatch]
  );

  useEffect(() => {
    function handleClickOutside(event) {
      if (divRef.current && !divRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const savedData = localStorage.getItem("unsentQuoteData");

    if (savedData) {
      const formData = JSON.parse(savedData);

      const dataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "questions") {
          dataToSend.append("questions", JSON.stringify(value || []));
        } else {
          dataToSend.append(key, value);
        }
      });

      dispatch(registerQuoteCustomer(dataToSend)).then((result) => {
        if (result) {
          localStorage.removeItem("unsentQuoteData");
        }
      });
    }
  }, [dispatch]);

  const debounceTimer = useRef(null);
  const lastInvalidPinRef = useRef("");

  const handlePostcodeChange = (e) => {
    const value = e.target.value.trim().slice(0, 10);
    setPincode(value);
    setPostalCodeValidate(false);
    setIsPostcodeSelected(false);
    setCity("");

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      if (value.length < 3) return;

      setIsCheckingPostcode(true);
      try {
        const response = await dispatch(getCityName({ postcode: value }));
        // ✅ safely unwrap if available
        const newResponse = response?.unwrap
          ? await response.unwrap()
          : response;

        if (newResponse?.data?.city) {
          setPostalCodeValidate(true);
          setCity(newResponse.data.city);
          dispatch(setcitySerach(newResponse.data.city));
          dispatch(
            setbuyerRequestData({
              postcode: value.trim().toUpperCase(),
              city: newResponse.data.city,
            })
          );
          setIsPostcodeSelected(true);
          setIsPincodeFromDropdown(true);
          lastInvalidPinRef.current = "";
        } else {
          if (lastInvalidPinRef.current !== value) {
            showToast("error", "Please enter a valid postcode!");
            lastInvalidPinRef.current = value;
          }
          setPostalCodeValidate(false);
        }
      } catch (error) {
        if (lastInvalidPinRef.current !== value) {
          showToast("error", "Please enter a valid postcode!");
          lastInvalidPinRef.current = value;
        }
        setPostalCodeValidate(false);
      } finally {
        setIsCheckingPostcode(false);
      }
    }, 500);
  };

  const handleGetStarted = (requireValidationPin) => {
    if (!selectedService) {
      showToast("error", "Please select a service from the suggestions.");
      return;
    }
    if (!pincode && requireValidationPin) {
      showToast("error", "Please enter a postcode");
      return;
    }
    if (!postalCodeValidate && requireValidationPin) {
      showToast("error", "Please enter a valid postcode.");
      return;
    }

    const { id, name } = selectedService;
    dispatch(questionAnswerData({ service_id: id }));
    setSelectedServiceId({ id, name });

    setShow(true);
  };

  const DEBOUNCE_MS = 250;
  const debounceRef = useRef(null);

  const triggerSearch = (value) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const trimmed = value.trim();
      dispatch(
        searchService({ search: trimmed === "" ? "" : trimmed.slice(0, 4) })
      );
    }, DEBOUNCE_MS);
  };
  const [isClientReady, setIsClientReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsClientReady(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <div className={styles.searchContainer}>
      {isClientReady && (
        <div>
          {typeof window !== "undefined" && window.innerWidth > 768 ? (
            <NavigationDetectorDesktop />
          ) : (
            <NavigationDetectorWithConfirmations />
          )}
        </div>
      )}
      <div className={styles.popularExamples}>
        <div className={styles.exampleBox} style={{ minWidth: "min-content" }}>
          <p className="xl:font-bold xl:text-[18px] xl:whitespace-nowrap xl:leading-[12px] xl:tracking-[0] xl:m-0 xl:mb-[20px] xl:text-[color:var(--primary-color)]">
            Popular examples:
          </p>
          <span className={styles.exampledescription}>
            Driveway Installation, Gardening Services, Web Design....
          </span>
        </div>
      </div>

      <div className={styles.calloutArrow}>
        <img src={calloutArrow} alt="calloutArrow" />
      </div>

      <div className={styles.container}>
        <h1 className={styles.heading}>
          Find Local
          <span className={styles.highlight}> Services</span>{" "}
          <span className={styles.heading}>- Fast</span>
        </h1>

        <h4 className={styles.subText}>
          Get fast quotes from local professionals
        </h4>

        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder={placeholder}
            className={`${styles.input} ${isFocused ? styles.inputFocus : ""}`}
            maxLength={8}
            onFocus={() => {
              setIsFocused(true);
              setIsDropdownOpen(true);
              if (Input.trim() === "") {
                dispatch(searchService({ search: "" }));
              }
            }}
            onBlur={() => setIsFocused(false)}
            onChange={(e) => {
              if (userToken?.active_status === 1) {
                showToast("error", "Switch to buyer to place a new request.");
                return;
              }
              const value = e.target.value;
              setInput(value);
              setIsDropdownOpen(true);
              setSelectedService(null);
              triggerSearch(value);
            }}
            value={Input}
          />

          <div className={styles.divider}></div>

          <div className={styles.locationWrapper}>
            <img src={location} alt="..." />
            <input
              type="text"
              placeholder="Enter Postcode (No Spaces)"
              className={styles.locationInput}
              ref={inputRef}
              name="postcode"
              value={pincode || ""}
              onChange={handlePostcodeChange}
            />
            {isCheckingPostcode ? (
              <Spin
                className={styles.checkIcon}
                size="small"
                style={{ marginLeft: 10 }}
              />
            ) : null}
          </div>

          <button
            disabled={isCheckingPostcode}
            className={styles.searchButton}
            onClick={() => handleGetStarted(true)}
          >
            Search
          </button>

          <button
            disabled={isCheckingPostcode}
            className={styles.searchButtonPhone}
            onClick={() => handleGetStarted(false)}
          >
            <SearchOutlined />
          </button>
        </div>

        {isDropdownOpen && service?.length > 0 && (
          <div className={styles.searchResults} ref={divRef}>
            {searchServiceLoader ? (
              <Spin indicator={<LoadingOutlined spin />} />
            ) : (
              <>
                {service?.map((item) => (
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

      {show && (userToken?.active_status == 2 || !userToken) && (
        <BuyerRegistration
          closeModal={handleClose}
          service_Id={selectedServiceId?.id}
          service_Name={selectedServiceId.name}
          postcode={pincode}
          postalCodeValidate={postalCodeValidate}
        />
      )}
    </div>
  );
};

export default SearchProfessionals;
