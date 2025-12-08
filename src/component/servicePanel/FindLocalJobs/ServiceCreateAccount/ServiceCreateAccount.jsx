import { useEffect, useRef, useState } from "react";
import styles from "./ServiceCreateAccount.module.css";
import ServiceLocationStep from "./ServiceLocationStep/ServiceLocationStep";
import ServiceDetailsStep from "./ServiceDetailsStep/ServiceDetailsStep";
import ServiceBusinessAddressStep from "./ServiceBusinessAddressStep/ServiceBusinessAddressStep";
import OtherServiceStep from "./OtherServiceStep/OtherServiceStep";
import { useDispatch, useSelector } from "react-redux";
import {
  checkCompanyNameApi,
  checkEmailIdApi,
  checkPhoneNumberApi,
  setRegisterStep,
  setSelectedServiceFormData,
  setHasPopulatedFromCompany,
} from "../../../../store/FindJobs/findJobSlice";
import { showToast } from "../../../../utils";
import { useParams } from "react-router";
import { Helmet } from "react-helmet-async";

const ServiceCreateAccount = () => {
  const dispatch = useDispatch();
  const { selectedServiceId, selectedServiceFormData } = useSelector(
    (state) => state.findJobs
  );

  const { serviceTitle } = useParams();
  const formattedTitle = serviceTitle
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  const { registerStep } = useSelector((state) => state.findJobs);
  const [errors, setErrors] = useState({});
  const [emailValue, setEmailValue] = useState("");
  const [companyValue, setCompanyValue] = useState("");
  const [phoneValue, setPhoneValue] = useState("");
  const [addressValue, setAddressValue] = useState("");
  const [emailCheck, setEmailCheck] = useState(false);
  const [companyCheck, setCompanyCheck] = useState(false);
  const [phoneCheck, setPhoneCheck] = useState(false);
  const [addressCheck, setAddressCheck] = useState(false);
  const [type, setType] = useState();
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyCity, setCompanyCity] = useState("");
  const [companyCountry, setCompanyCountry] = useState("");
  const [companyPostCode, setCompanyPostCode] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  const validateStep = () => {
    let newErrors = {};

    if (registerStep === 1) {
      if (
        !selectedServiceFormData.miles1 ||
        !selectedServiceFormData.miles1.trim()
      )
        newErrors.miles1 = "Miles is required";
      if (
        !selectedServiceFormData.postcode ||
        !selectedServiceFormData.postcode.trim()
      )
        newErrors.postcode = "Postcode is required";
    }

    if (registerStep === 2) {
      if (!selectedServiceFormData.name || !selectedServiceFormData.name.trim())
        newErrors.name = "Name is required";
      if (
        !selectedServiceFormData.email ||
        !selectedServiceFormData.email.trim()
      ) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(selectedServiceFormData.email)) {
        newErrors.email = "Invalid email format";
      }
      if (
        !selectedServiceFormData.phone ||
        !selectedServiceFormData.phone.trim()
      ) {
        newErrors.phone = "Phone number is required";
      } else if (selectedServiceFormData.phone.trim().length < 10) {
        newErrors.phone = "Phone number must be at least 10 digits";
      }
      const companyInput = selectedServiceFormData.company_website?.trim();
      const urlRegex =
        /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+(\/[^\s]*)?$/;

      if (companyInput && !urlRegex.test(companyInput)) {
        newErrors.company_website =
          "Please enter a valid URL (e.g. https://example.com or www.example.com)";
      }
    }

    if (registerStep === 3) {
    }
    if (registerStep === 4) {
      if (
        !selectedServiceFormData.miles2 ||
        !selectedServiceFormData.miles2.trim()
      )
        newErrors.miles2 = "Miles is required";
      if (
        !selectedServiceFormData.service_id ||
        !selectedServiceFormData.service_id.trim()
      )
        newErrors.service_id = "Service Id is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const debounceTimer = useRef({});
  const latestEmailRef = useRef("");
  const latestPhoneRef = useRef("");

  const companyData = useSelector((state) => state.companyLook?.companyData);

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailRegex.test(emailValue) && type === "email") {
      if (debounceTimer.current.email)
        clearTimeout(debounceTimer.current.email);

      debounceTimer.current.email = setTimeout(() => {
        const currentEmail = latestEmailRef.current;

        dispatch(checkEmailIdApi({ email: currentEmail })).then((result) => {
          if (latestEmailRef.current === currentEmail) {
            if (result?.success === true) {
              setEmailCheck(true);
              showToast("success", "Valid email");
            } else {
              setEmailCheck(false);
            }
          }
        });
      }, 1000);
    }

    if (
      companyValue.trim().length > 1 &&
      type === "company_name" &&
      selectedServiceFormData?.company_reg_number
    ) {
      if (debounceTimer.current.company_name)
        clearTimeout(debounceTimer.current.company_name);
      debounceTimer.current.company_name = setTimeout(() => {
        dispatch(
          checkCompanyNameApi({
            company_name: companyValue,
            company_reg_number: selectedServiceFormData?.company_reg_number,
          })
        ).then((result) => {
          if (result) {
            showToast("success", result?.message);
            setCompanyCheck(result?.success);
          }
        });
      }, 1000);
    }

    if (phoneValue.trim().length >= 10 && type === "phone") {
      latestPhoneRef.current = phoneValue;

      if (debounceTimer.current.phone)
        clearTimeout(debounceTimer.current.phone);

      debounceTimer.current.phone = setTimeout(() => {
        const currentPhone = latestPhoneRef.current;

        dispatch(checkPhoneNumberApi({ phone: currentPhone })).then(
          (result) => {
            if (latestPhoneRef.current === currentPhone) {
              if (result?.success === true) {
                setPhoneCheck(true);
                // showToast("success", "Valid Phone");
              } else {
                setPhoneCheck(false);
              }
            }
          }
        );
      }, 1000);
    }

    return () => {
      if (debounceTimer.current.email)
        clearTimeout(debounceTimer.current?.email);
      if (debounceTimer.current.company_name)
        clearTimeout(debounceTimer.current.company_name);
      if (debounceTimer.current.phone)
        clearTimeout(debounceTimer.current.phone);
      if (debounceTimer.current.address)
        clearTimeout(debounceTimer.current.address);
    };
  }, [
    emailValue,
    companyValue,
    phoneValue,
    addressValue,
    selectedServiceFormData?.company_reg_number,
    dispatch,
  ]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setType(name);
    if (name === "email") {
      setEmailValue(value);
      latestEmailRef.current = value;
    }
    if (name === "company_name") {
      setCompanyValue(value);
    }
    if (name == "company_address") {
      setCompanyAddress(value);
    }
    if (name === "phone") {
      setPhoneValue(value);
    }
    if (name === "address") {
      setAddressValue(value);
    }
    if (name == "company_country") {
      setCompanyCountry(value);
    }

    if (name == "company_postcode") {
      setCompanyPostCode(value);
    }
    if (name == "company_city") {
      setCompanyCity(value);
    }

    if (name == "city") {
      setCity(value);
    }

    if (name == "country") {
      setCountry(value);
    }

    dispatch(
      setSelectedServiceFormData({
        [name]: type === "checkbox" ? (checked ? 1 : 0) : e.target.value,
      })
    );
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const nextStep = () => {
    window.scrollTo(0, 0);

    if (validateStep()) {
      dispatch(setRegisterStep(registerStep + 1));
    }
  };
  const prevStep = () => {
    dispatch(setRegisterStep(registerStep - 1));
  };
  useEffect(() => {
    dispatch(setRegisterStep(1));
    return () => {
      dispatch(setRegisterStep(0));
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>{formattedTitle} - Localists.com</title>
        <meta
          name="description"
          content={`Find trusted ${formattedTitle} near you. Tell us where you want to find new customers, share your coverage areas, and get matched with quality local leads today.`}
        />
         <meta name="robots" content="noindex" />
      </Helmet>
      <div className={styles.parentContainer}>
        <div className={styles.container}>
          {registerStep === 1 && (
            <ServiceLocationStep
              nextStep={nextStep}
              setFormData={setSelectedServiceFormData}
              formData={selectedServiceFormData}
              handleInputChange={handleInputChange}
              errors={errors}
            />
          )}
          {registerStep === 2 && (
            <ServiceDetailsStep
              nextStep={nextStep}
              setFormData={setSelectedServiceFormData}
              formData={selectedServiceFormData}
              prevStep={prevStep}
              handleInputChange={handleInputChange}
              errors={errors}
              emailCheck={emailCheck}
              companyCheck={companyCheck}
              phoneCheck={phoneCheck}
              companyValue={companyValue}
            />
          )}
          {registerStep === 3 && (
            <ServiceBusinessAddressStep
              prevStep={prevStep}
              setFormData={setSelectedServiceFormData}
              formData={selectedServiceFormData}
              nextStep={nextStep}
              handleInputChange={handleInputChange}
              errors={errors}
              addressCheck={addressCheck}
              setHasPopulatedFromCompany={setHasPopulatedFromCompany}
              addressValue={addressValue}
              cityvalue={city}
              countryvalue={country}
            />
          )}
          {registerStep === 4 && (
            <OtherServiceStep
              prevStep={prevStep}
              setFormData={setSelectedServiceFormData}
              formData={selectedServiceFormData}
              handleInputChange={handleInputChange}
              errors={errors}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ServiceCreateAccount;
