import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./cloneaccountants.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getPopularServiceList,
  searchService,
  setService,
} from "../../../store/FindJobs/findJobSlice";
import {
  questionAnswerData,
  setbuyerRequestData,
  setBuyerStep,
  setcitySerach,
  getCityName,
} from "../../../store/Buyer/BuyerSlice";
import BuyerRegistration from "../../buyerPanel/PlaceNewRequest/BuyerRegistration/BuyerRegistration";
import { Spin, message } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import CheckIcon from "../../../assets/Icons/greenCheckBox.jpeg";

const CloneAccountants = ({
  header,
  title,
  panelImage,
  defaultServiceName = "",
  heading2,
  placeholderText,
  doYouNeetTitle = [],
  inputLable1 = "What service do you require?",
  inputLable2 = "Tell us where you need it?",
}) => {
  const dispatch = useDispatch();
  const inputRef = useRef(null);

  const [input, setInput] = useState("");
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [postalCodeValidate, setPostalCodeValidate] = useState(false);
  const [isPincodeFromDropdown, setIsPincodeFromDropdown] = useState(false);
  const [isPostcodeSelected, setIsPostcodeSelected] = useState(false);
  const [isCheckingPostcode, setIsCheckingPostcode] = useState(false);

  const { userToken } = useSelector((state) => state.auth);
  const { service, searchServiceLoader } = useSelector(
    (state) => state.findJobs
  );
  const showToast = (type, content) => message[type](content);

  useEffect(() => {
    if (defaultServiceName) {
      setInput(defaultServiceName);
      setIsDropdownOpen(false);
      dispatch(searchService({ search: defaultServiceName }));
    }
  }, [defaultServiceName, dispatch]);

  useEffect(() => {
    if (service?.length > 0) {
      const match = service.find(
        (s) => s.name.trim().toLowerCase() === input.trim().toLowerCase()
      );
      if (match) {
        setSelectedService(match);
        setIsDropdownOpen(false);
      } else {
        setSelectedService(null);
      }
    }
  }, [service, input]);

  const handleClose = () => {
    setShowModal(false);
    setInput("");
    setPincode("");
    setSelectedService(null);
    setPostalCodeValidate(false);
  };

  useEffect(() => {
    dispatch(getPopularServiceList());
    return () => dispatch(setService([]));
  }, [dispatch]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (isDropdownOpen && input.trim()) {
        dispatch(searchService({ search: input }));
      }
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [input, dispatch, isDropdownOpen]);

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
    const checkPendingModal = () => {
      const pendingModal = JSON.parse(
        localStorage.getItem("pendingBuyerModal")
      );

      if (pendingModal?.shouldOpen) {
        setSelectedService({
          id: pendingModal.serviceId,
          name: pendingModal.serviceName || "Service",
        });

        dispatch(setbuyerRequestData(pendingModal.buyerRequest));
        dispatch(setcitySerach(pendingModal.city));

        setShowModal(true);
        dispatch(setBuyerStep(7));
      }
    };

    checkPendingModal();
  }, [dispatch]);

  const handlePincodeChange = async (e) => {
    const value = e.target.value.trim().slice(0, 10);
    setPincode(value);
    setPostalCodeValidate(false);
    setIsPostcodeSelected(false);
    setIsPincodeFromDropdown(false);
    setCity("");

    if (value.length < 3) return;

    setIsCheckingPostcode(true);
    try {
      const response = await dispatch(getCityName({ postcode: value }));
      const newResponse = response?.unwrap ? await response.unwrap() : response;

      if (newResponse?.data?.city) {
        setPostalCodeValidate(true);
        setIsPostcodeSelected(true);
        setIsPincodeFromDropdown(true);
        setCity(newResponse.data.city);

        dispatch(setcitySerach(newResponse.data.city));
        dispatch(
          setbuyerRequestData({
            postcode: value.toUpperCase(),
            city: newResponse.data.city,
          })
        );
      } else {
        setPostalCodeValidate(false);
        showToast("error", "Please enter a valid postcode!");
      }
    } catch (error) {
      setPostalCodeValidate(false);
      showToast("error", "Please enter a valid postcode!");
    } finally {
      setIsCheckingPostcode(false);
    }
  };

  const handleContinue = () => {
    if (!selectedService) {
      showToast("error", "Please select a service from the suggestions.");
      return;
    }

    if (!postalCodeValidate) {
      showToast("error", "Please enter a valid postcode.");
      return;
    }

    if (userToken?.active_status === 1) {
      showToast("error", "You are not a buyer.");
      return;
    }

    dispatch(questionAnswerData({ service_id: selectedService.id }));
    dispatch(
      setbuyerRequestData({
        postcode: pincode,
        service_id: selectedService.id,
      })
    );
    setShowModal(true);
  };

  const style = {
    backgroundImage: `url(${panelImage})`,
  };

  return (
    <div className={styles.container} style={style}>
      <div className={styles.overlay}>
        <div className={styles.headingContainer}>
          <h1 style={{ color: "white" }}>
            Looking For <span className={styles.blueText}>{header} </span>{" "}
            {heading2 || ""} Near You?
          </h1>
        </div>

        <div className={styles.formContainer}>
          <div className={styles.innerformContainer}>
            <span>
              {doYouNeetTitle[0] || ""}{" "}
              <span className={styles.blueText}>
                {doYouNeetTitle[1]?.toLowerCase()}{" "}
              </span>
              {doYouNeetTitle[2] || ""}?
            </span>
            <div className={styles.inputGroup}>
              <div className={styles.inputBox}>
                <label>{inputLable1}</label>
                <input
                  type="text"
                  placeholder={placeholderText}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    setIsDropdownOpen(!!e.target.value);
                    setSelectedService(null);
                  }}
                />
                {isDropdownOpen && service?.length > 0 && (
                  <div className={styles.searchResults}>
                    {searchServiceLoader ? (
                      <Spin indicator={<LoadingOutlined spin />} />
                    ) : (
                      service.map((item) => (
                        <p
                          key={item.id}
                          className={styles.searchItem}
                          onClick={() => handleSelectService(item)}
                        >
                          {item.name}
                        </p>
                      ))
                    )}
                  </div>
                )}
              </div>

              <div className={styles.inputBox} style={{ position: "relative" }}>
                <label>{inputLable2}</label>
                <div className={styles.marginForLable} />
                <input
                  type="text"
                  placeholder="Enter Postcode"
                  name="postcode"
                  value={pincode}
                  onChange={handlePincodeChange}
                />
                {/* Optional loader/check UI (no CSS touched) */}
                {isCheckingPostcode ? (
                  <Spin
                    style={{ position: "absolute", right: "12px", top: "60%" }}
                    className={styles.checkIcon}
                    size="small"
                  />
                ) : postalCodeValidate ? (
                  <img
                    style={{ position: "absolute", right: "8px", top: "55%" }}
                    src={CheckIcon}
                    alt="Success"
                    className={styles.checkIcon}
                  />
                ) : null}
              </div>
            </div>
            <button className={styles.button} onClick={handleContinue}>
              Continue
            </button>
          </div>
        </div>
      </div>

      {showModal && (userToken?.active_status === 2 || !userToken) && (
        <BuyerRegistration
          closeModal={handleClose}
          service_Id={selectedService?.id}
          service_Name={selectedService?.name}
          postcode={pincode}
          postalCodeValidate={postalCodeValidate}
        />
      )}
    </div>
  );
};

export default CloneAccountants;
