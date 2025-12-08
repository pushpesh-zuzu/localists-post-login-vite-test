import { useEffect, useRef, useState } from "react";
import styles from "./ServiceLocationStep.module.css";
import iIcon from "../../../../../assets/Images/iIcon.svg";
import LocationIcon from "../../../../../assets/Images/HowItWorks/locationImg.svg";
import {
  setCity,
  setCountry,
  setPostalCode,
  setSelectedServiceFormData,
} from "../../../../../store/FindJobs/findJobSlice";
import { useDispatch } from "react-redux";
import { showToast } from "../../../../../utils";
import { getCityName } from "../../../../../store/Buyer/BuyerSlice";
import { Spin } from "antd";
import CheckIcon from "../../../../../assets/Icons/greenCheckBox.jpeg";

const ServiceLocationStep = ({
  nextStep,
  handleInputChange,
  formData,
  setFormData,
  errors,
}) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimer = useRef(null);
  const [isValidPostCode, setIsValidPostCode] = useState(false);

  const handlePostcodeChange = (e) => {
    const { name, value } = e.target;

    dispatch(
      setSelectedServiceFormData({
        [name]: value,
      })
    );

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      if (value && value.length >= 3) {
        fetchCityFromPostcode(value);
      }
    }, 800);
  };

  const fetchCityFromPostcode = async (postcode) => {
    if (!postcode || postcode.length < 3) return;

    setIsLoading(true);

    try {
      const response = await dispatch(getCityName({ postcode }));
      const newResponse = response?.unwrap ? await response.unwrap() : response;

      if (newResponse?.success) {
        setIsValidPostCode(true);
        const cityName = newResponse.data?.city;
        const postcodeFromApi = newResponse.data?.postcode;

        dispatch(
          setFormData({
            postcode: postcodeFromApi,
            zipcode: postcodeFromApi,
            postcode_old: postcodeFromApi,
            zipcode_old: postcodeFromApi,
            city: cityName,
            cities: cityName || "",
            city_old: cityName || "",
            country: "UK",
            country_old: "UK",
            coordinates: {},
            validPostCode: true,
            validPostCode2: isValidPostCode,
            postcode2: postcodeFromApi,
          })
        );

        dispatch(setPostalCode({ postalcode: postcodeFromApi }));
        dispatch(setCountry({ country: newResponse.data?.country }));
      }
    } catch (error) {
      console.error("Error fetching city:", error);
      setCity("");
      dispatch(setFormData({ validPostCode: false }));
      setIsValidPostCode(false);
      showToast("error", "No PIN code found! Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const validateAndProceed = () => {
    if (!formData.postcode || (formData.postcode.length < 3 && formData.city)) {
      showToast("error", "Please enter a valid postcode");
      return;
    }
    if (!formData.validPostCode) {
      showToast("error", "Please enter a valid postcode");
      return;
    } else {
      nextStep();
    }
  };

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);
  // useEffect(() => {
  //   handleInputChange();
  // }, []);
  return (
    <div className={styles.parentContainer}>
      <div className={styles.container}>
        <h2 className={styles.heading}>
          Tell us where you want to find new customers!
        </h2>
        <p className={styles.subheading}>
          Share the areas you cover, and we'll match you with leads right in
          your location.
        </p>

        <div className={styles.card}>
          <p className={styles.formHeading}>I serve customers within</p>
          <div className={styles.inputGroup}>
            <div className={styles.inputWrapper}>
              <span className={styles.fromText}>Miles</span>
              <select
                className={`${styles.dropdown} ${
                  errors.miles1 ? styles.errorBorder : ""
                }`}
                name="miles1"
                value={formData?.miles1}
                onChange={handleInputChange}
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
              {errors.miles1 && (
                <p className={styles.errorText}>{errors.miles1}</p>
              )}
            </div>
            <div className={styles.inputWrapper}>
              <span className={styles.fromText}>From</span>
              <img src={LocationIcon} alt="" />
              <input
                type="text"
                placeholder="Enter Postcode (No Spaces)"
                className={`${styles.input} ${
                  errors.postcode ? styles.errorBorder : ""
                } ${isLoading ? styles.loading : ""}`}
                name="postcode"
                value={formData.postcode || ""}
                onChange={handlePostcodeChange}
                disabled={isLoading}
              />{" "}
              {isLoading ? (
                <Spin
                  style={{ position: "absolute", right: "8px", top: "60%" }}
                  size="small"
                />
              ) : isValidPostCode ? (
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
              {isLoading && <div className={styles.spinner}></div>}
              {errors.postcode && (
                <p className={styles.errorText}>{errors.postcode}</p>
              )}
            </div>
          </div>
          <div className={styles.nationwideFooter}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="nation_wide"
                checked={formData?.nation_wide === 1}
                onChange={handleInputChange}
                className={styles.checkbox}
              />
              Nationwide
            </label>
            <div className={styles.switchWrapper}>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  name="is_online"
                  checked={formData?.is_online === 1}
                  onChange={handleInputChange}
                />
                <span className={styles.slider}></span>
              </label>
              <span className={styles.switchLabel}>Online/Remote Lead</span>
            </div>
            <div></div>
          </div>
          <div className={styles.footer}>
            <p className={styles.infoText}>
              <img src={iIcon} alt="" /> You can change your location at any
              time
            </p>
            <button
              disabled={isLoading}
              className={styles.nextButton}
              onClick={validateAndProceed}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceLocationStep;
