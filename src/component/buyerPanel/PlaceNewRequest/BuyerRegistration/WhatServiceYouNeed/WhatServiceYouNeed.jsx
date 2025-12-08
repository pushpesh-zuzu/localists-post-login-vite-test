import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import styles from "./WhatServiceYouNeed.module.css";
import {
  searchService,
  setService,
} from "../../../../../store/FindJobs/findJobSlice";
import { useDispatch, useSelector } from "react-redux";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import {
  questionAnswerData,
  setbuyerRequestData,
  setcitySerach,
  getCityName,
} from "../../../../../store/Buyer/BuyerSlice";
import CheckIcon from "../../../../../assets/Icons/greenCheckBox.jpeg";
import { showToast } from "../../../../../utils";
import { useParams } from "react-router";
import { megaMenu } from "../../../../../constant/Megamenu";
import { getBarkToken } from "../../../../../utils/getCookies";

function getNameFromSlug(slug, categoryList) {
  if (typeof slug !== "string" || !slug || !Array.isArray(categoryList))
    return null;
  const match = categoryList.find((item) => item?.path === slug);
  return match ? match.name ?? null : null;
}

const WhatServiceYouNeed = ({
  nextStep,
  serviceId,
  serviceName,
  onClose,
  pincodes,
  setShowConfirmModal,
  postalCodeIsValidate,
  resetServiceTrigger,
  getService,
}) => {
  const [input, setInput] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [postalCodeValidate, setPostalCodeValidate] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [errors, setErrors] = useState({ service: "", pincode: "" });
  const [loading, setLoading] = useState(false);
  const [checkingPostcode, setCheckingPostcode] = useState(false);

  const { slug } = useParams();
  const { userToken } = useSelector((state) => state.auth);
  const { searchServiceLoader, service, registerData } = useSelector(
    (state) => state.findJobs
  );
  const { citySerach } = useSelector((state) => state.buyer);
  const dispatch = useDispatch();
  const inputRef = useRef(null);

  const nameValue = useMemo(
    () => getNameFromSlug(slug, megaMenu[0].subcategory),
    [slug]
  );
  const disableServiceField = !!nameValue;

  useEffect(() => {
    if (nameValue) {
      dispatch(searchService({ search: nameValue }));
    }
  }, [dispatch, nameValue]);

  useEffect(() => {
    if (nameValue && service?.length === 1) {
      setSelectedService(service[0]);
      setInput(service[0].name);
    }
  }, [nameValue, service]);

  useEffect(() => {
    if (isDropdownOpen && input.trim() !== "" && input !== serviceName) {
      const delayDebounce = setTimeout(() => {
        dispatch(searchService({ search: input }));
      }, 500);
      return () => clearTimeout(delayDebounce);
    }
  }, [input, dispatch, isDropdownOpen, serviceName]);

  useEffect(() => {
    if (serviceName) {
      setInput(serviceName);
      setIsDropdownOpen(true);
      dispatch(searchService({ search: serviceName }));
    }

    if (pincodes) {
      setPincode(pincodes);
    }
  }, [serviceName, pincodes, dispatch]);

  useEffect(() => {
    if (pincodes && postalCodeIsValidate) {
      setPincode(pincodes);
      setPostalCodeValidate(true);
      setErrors((prev) => ({ ...prev, pincode: "" }));
    }
  }, [pincodes, postalCodeIsValidate]);

  useEffect(() => {
    if (serviceName && service?.length > 0) {
      const match = service.find(
        (s) => s.name.trim().toLowerCase() === serviceName.trim().toLowerCase()
      );

      if (match) {
        setSelectedService(match);
        setIsDropdownOpen(false);
      } else {
        setSelectedService(null);
      }
    }
  }, [serviceName, service]);

  const handleSelectService = useCallback(
    (item) => {
      setInput(item.name);
      setSelectedService(item);
      setIsDropdownOpen(false);
      setErrors((prev) => ({ ...prev, service: "" }));
      setTimeout(() => dispatch(setService([])), 100);
    },
    [dispatch]
  );

  const validatePostcode = useCallback(
    async (value) => {
      if (!value) {
        setPostalCodeValidate(false);
        setCity("");
        return;
      }

      setCheckingPostcode(true);
      try {
        const response = await dispatch(getCityName({ postcode: value }));
        const newResponse = response?.unwrap
          ? await response.unwrap()
          : response;

        if (newResponse?.data?.city) {
          setPostalCodeValidate(true);
          setCity(newResponse.data.city);
          dispatch(setcitySerach(newResponse.data.city));
          setErrors((prev) => ({ ...prev, pincode: "" }));
        } else {
          setPostalCodeValidate(false);
          setCity("");
          setErrors((prev) => ({
            ...prev,
            pincode: "Please enter a valid postcode!",
          }));
        }
      } catch (error) {
        setPostalCodeValidate(false);
        setCity("");
        setErrors((prev) => ({
          ...prev,
          pincode: "Please enter a valid postcode!",
        }));
      } finally {
        setCheckingPostcode(false);
      }
    },
    [dispatch]
  );

  // ✅ Validate postcode while typing (debounced)
  useEffect(() => {
    if (pincode.trim().length >= 3) {
      const delay = setTimeout(() => validatePostcode(pincode), 600);
      return () => clearTimeout(delay);
    } else {
      setPostalCodeValidate(false);
      setCity("");
    }
  }, [pincode, validatePostcode]);

  const handlePincodeChange = (e) => {
    const value = e.target.value.trim().slice(0, 10);
    setPincode(value);
  };

  const handleContinue = useCallback(async () => {
    let newErrors = { service: "", pincode: "" };

    if (!selectedService) newErrors.service = "Please select a service!";
    if (!pincode) newErrors.pincode = "Postcode is required!";

    setErrors(newErrors);
    if (newErrors.service || newErrors.pincode) return;

    setLoading(true);
    try {
      const response = await dispatch(getCityName({ postcode: pincode }));
      const newResponse = response?.unwrap ? await response.unwrap() : response;

      if (newResponse?.data?.city) {
        setPostalCodeValidate(true);
        setCity(newResponse.data.city);
        dispatch(setcitySerach(newResponse.data.city));

        dispatch(
          setbuyerRequestData({
            service_id: selectedService?.id || serviceId,
          })
        );

        dispatch(
          questionAnswerData({
            service_id: selectedService?.id || serviceId || service?.[0]?.id,
          })
        );

        nextStep();
        if (selectedService) getService(selectedService);
      } else {
        showToast("error", "Please enter a valid postcode!");
      }
    } catch (error) {
      showToast("error", "Please enter a valid postcode!");
    } finally {
      setLoading(false);
    }
  }, [
    selectedService,
    pincode,
    dispatch,
    serviceId,
    nextStep,
    getService,
    service,
  ]);

  const handleCloseClick = () => {
    if (!userToken?.remember_tokens && !registerData?.remember_tokens) {
      setShowConfirmModal(true);
      dispatch(
        setbuyerRequestData({
          service_id: selectedService?.id || serviceId,
          // postcode: pincode,
          // city: citySerach,
        })
      );
    } else {
      setInput("");
      setSelectedService(null);
      setPincode("");
      setCity("");
      onClose();
    }
  };
  useEffect(() => {
    if (selectedService?.id) {
      dispatch(
        setbuyerRequestData({
          service_id: selectedService.id || serviceId,
        })
      );
    }
  }, [selectedService, dispatch]);

  return (
    <div className={styles.container}>
      <div className={styles.closeButton} onClick={handleCloseClick}>
        &times;
      </div>

      <h2 className={styles.title}>What service do you need?</h2>

      {/* Service Input */}
      <div className={styles.formGroup}>
        <label className={styles.label}>What service do you need?</label>
        <input
          disabled={
            !(getBarkToken() || registerData?.remember_tokens)
          }
          type="text"
          placeholder="e.g. Landscaping, Driveway Installation"
          className={`${styles.input} ${
            errors.service ? styles.errorBorder : ""
          }`}
          onChange={(e) => {
            setInput(e.target.value);
            setIsDropdownOpen(!!e.target.value);
            setSelectedService(null);
            setErrors((prev) => ({ ...prev, service: "" }));
          }}
          value={input}
        />
        {errors.service && <p className={styles.errorText}>{errors.service}</p>}

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

      {/* Postcode Input */}
      <div className={styles.formGroup}>
        <label className={styles.label}>Where do you need it?</label>
        <input
          type="text"
          placeholder="Enter Postcode (No Spaces)"
          className={`${styles.input} ${
            errors.pincode ? styles.errorBorder : ""
          }`}
          ref={inputRef}
          name="pincode"
          value={pincode}
          onChange={handlePincodeChange}
        />

        {checkingPostcode ? (
          <Spin
            className={styles.checkIcon}
            size="small"
            style={{ marginLeft: 10 }}
          />
        ) : postalCodeValidate ? (
          <img src={CheckIcon} alt="Success" className={styles.checkIcon} />
        ) : null}

        {errors.pincode ? (
          <p className={styles.errorText}>{errors.pincode}</p>
        ) : (
          <p className={styles.errorTexts}>{"."}</p>
        )}
      </div>

      <div className={styles.buttonWrapper}>
        <button
          className={styles.button}
          onClick={handleContinue}
          disabled={loading}
        >
          {loading ? (
            <Spin
              indicator={<LoadingOutlined spin style={{ color: "white" }} />}
            />
          ) : (
            "Continue"
          )}
        </button>
      </div>
    </div>
  );
};

export default WhatServiceYouNeed;
