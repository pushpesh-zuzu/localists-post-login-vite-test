import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  getPopularServiceList,
  searchService,
  setService,
  setSelectedServiceId,
} from "../../../store/FindJobs/findJobSlice";
import { questionAnswerData } from "../../../store/Buyer/BuyerSlice";
import { Spin } from "antd";
import BuyerRegistration from "../../buyerPanel/PlaceNewRequest/BuyerRegistration/BuyerRegistration";
import { LoadingOutlined } from "@ant-design/icons";
import { showToast, generateSlug } from "../../../utils";
import styles from "./searchservices.module.css";
import { useNavigate, useParams } from "react-router-dom";

const SearchServicesPin = ({
  title = "",
  buttonText = "Continue",
  serviceLabel = "What service do you provide?",
  servicePlaceholder = "Driveway Installation, Gardening Services, etc...",
  className = "",
  onCustomContinue = null,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { lang, country } = useParams();
  const currentLang = lang || "en";
  const currentCountry = country || "gb";

  const [input, setInput] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { userToken } = useSelector((state) => state.auth);
  const { service, searchServiceLoader } = useSelector(
    (state) => state.findJobs
  );

  const divRef = useRef(null);

  const handleClose = () => {
    setShowModal(false);
    setInput("");
    setSelectedService(null);
  };

  // get popular services
  useEffect(() => {
    dispatch(getPopularServiceList());
    return () => dispatch(setService([]));
  }, [dispatch]);

  // debounce search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (isDropdownOpen && input.trim()) {
        dispatch(searchService({ search: input }));
      }
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [input, dispatch, isDropdownOpen]);

  // select service
  const handleSelectService = useCallback(
    (item) => {
      setInput(item.name);
      setSelectedService(item);
      setIsDropdownOpen(false);
      setTimeout(() => dispatch(setService([])), 100);
    },
    [dispatch]
  );

  // click outside close
  useEffect(() => {
    function handleClickOutside(event) {
      if (divRef.current && !divRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleContinue = () => {
    if (!selectedService) {
      showToast("error", "Please select a service from the suggestions.");
      return;
    }

    if (userToken?.active_status === 1) {
      showToast(
        "error",
        "You are already logged in, please switch to buyer to proceed."
      );
      return;
    }

    // If custom callback is provided
    if (onCustomContinue) {
      const shouldProceed = onCustomContinue({
        selectedService,
        input,
      });
      if (shouldProceed === false) return;
    }

    const slug = generateSlug(selectedService.name);
    dispatch(setSelectedServiceId(selectedService.id));
    navigate(
      `/${currentLang}/${currentCountry}/sellers/create-account/${slug}`
    );

    dispatch(questionAnswerData({ service_id: selectedService.id }));
    setShowModal(true);
  };

  return (
    <>
      <div className={`${styles?.formContainer || ""} ${className}`}>
        <div className={styles?.innerformContainer || ""}>
          <p className={styles.titleContainer}>{title}</p>
          <div className={styles?.inputGroup || ""}>
            <div className={styles?.inputBox || ""} ref={divRef}>
              <label>{serviceLabel}</label>
              <input
                type="text"
                placeholder={servicePlaceholder}
                value={input}
                onFocus={() => {
                  setIsDropdownOpen(true);
                  if (input.trim() === "") {
                    dispatch(searchService({ search: "" }));
                  }
                }}
                onChange={(e) => {
                  setInput(e.target.value);
                  setIsDropdownOpen(true);
                  setSelectedService(null);
                }}
              />
              {isDropdownOpen && service?.length > 0 && (
                <div className={styles?.searchResults || ""}>
                  {searchServiceLoader ? (
                    <Spin indicator={<LoadingOutlined spin />} />
                  ) : (
                    service.map((item) => (
                      <p
                        key={item.id}
                        className={styles?.searchItem || ""}
                        onClick={() => handleSelectService(item)}
                      >
                        {item.name}
                      </p>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
          <button className={styles?.button || ""} onClick={handleContinue}>
            {buttonText}
          </button>
        </div>
      </div>

      {showModal && (userToken?.active_status === 2 || !userToken) && (
        <BuyerRegistration
          closeModal={handleClose}
          serviceId={selectedService?.id}
          serviceName={selectedService?.name}
        />
      )}
    </>
  );
};

export default SearchServicesPin;
