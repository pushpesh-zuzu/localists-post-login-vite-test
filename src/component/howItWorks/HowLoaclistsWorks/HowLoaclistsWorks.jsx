import { useDispatch, useSelector } from "react-redux";
import styles from "./HowLoaclistsWorks.module.css";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  getPopularServiceList,
  searchService,
  setService,
} from "../../../store/FindJobs/findJobSlice";
import {
  questionAnswerData,
  setcitySerach,
  getCityName,
} from "../../../store/Buyer/BuyerSlice";
import { Spin } from "antd";
import BuyerRegistration from "../../buyerPanel/PlaceNewRequest/BuyerRegistration/BuyerRegistration";
import { LoadingOutlined } from "@ant-design/icons";
import { showToast } from "../../../utils";
import BlueBlackTextForH1 from "../../common/headings/BlueBlackTextForH1";
import CheckIcon from "../../../assets/Icons/greenCheckBox.jpeg";

const HowLoaclistsWorks = () => {
  const dispatch = useDispatch();
  const inputRef = useRef(null);

  const [input, setInput] = useState("");
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [postalCodeValidate, setPostalCodeValidate] = useState(false);
  const [isCheckingPostcode, setIsCheckingPostcode] = useState(false);

  const { userToken } = useSelector((state) => state.auth);
  const { service, searchServiceLoader } = useSelector(
    (state) => state.findJobs
  );

  const handleClose = () => {
    setShowModal(false);
    setInput("");
    setPincode("");
    setSelectedService(null);
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

  const debounceTimer = useRef(null);
  const lastInvalidPinRef = useRef("");

  const handlePostcodeChange = (e) => {
    const value = e.target.value.trim().slice(0, 10);
    setPincode(value);
    setPostalCodeValidate(false);
    setCity("");

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      if (value.length < 3) return;

      setIsCheckingPostcode(true);
      try {
        const response = await dispatch(getCityName({ postcode: value }));
        const newResponse = response?.unwrap
          ? await response.unwrap()
          : response;

        if (newResponse?.data?.city) {
          setPostalCodeValidate(true);
          setCity(newResponse.data.city);
          dispatch(setcitySerach(newResponse.data.city));
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

  const handleContinue = () => {
    if (!selectedService) {
      showToast("error", "Please select a service from the suggestions.");
      return;
    }
    if (!pincode) {
      showToast("error", "Please enter a postcode.");
      return;
    }
    if (!postalCodeValidate) {
      showToast("error", "Please enter a valid postcode.");
      return;
    }
    if (userToken?.active_status === 1) {
      showToast(
        "error",
        "You are already logged in, please switch to buyer to proceed."
      );
      return;
    }

    dispatch(questionAnswerData({ service_id: selectedService.id }));
    setShowModal(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.overlay}>
        <BlueBlackTextForH1
          firstblue={false}
          secondText="How"
          firstblueText="Localists.com"
          thirdText="Works"
        />

        <div className={styles.formContainer}>
          <div className={styles.innerformContainer}>
            <p>Now you know how it works, start looking for a professional.</p>
            <div className={styles.inputGroup}>
              <div className={styles.inputBox}>
                <label>What service do you need?</label>
                <input
                  type="text"
                  placeholder="Landscaping, Driveway Installation, etc..."
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
              <div style={{ position: "relative" }} className={styles.inputBox}>
                <label>Where do you need it?</label>

                <input
                  type="text"
                  placeholder="Enter Postcode (No Spaces)"
                  ref={inputRef}
                  name="postcode"
                  value={pincode}
                  onChange={handlePostcodeChange}
                />
                {isCheckingPostcode ? (
                  <Spin
                    size="small"
                    style={{
                      position: "absolute",
                      right: 10,
                      top: "70%",
                      transform: "translateY(-50%)",
                    }}
                  />
                ) : postalCodeValidate ? (
                  <img
                    style={{
                      position: "absolute",
                      left: "92%",
                      top: "55%",
                      height: "20px",
                      width: "20px",
                    }}
                    src={CheckIcon}
                    alt="Success"
                    className={styles.checkIcon}
                  />
                ) : (
                  ""
                )}
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

export default HowLoaclistsWorks;
