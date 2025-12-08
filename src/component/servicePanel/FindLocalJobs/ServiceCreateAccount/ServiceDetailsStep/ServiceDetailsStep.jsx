import { useState, useRef, useEffect } from "react";
import styles from "./ServiceDetailsStep.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { showToast } from "../../../../../utils";
import {
  setCompanyError,
  clearCompanyData,
  fetchCompanyDetails,
} from "../../../../../store/Company/companyLookup";

const ServiceDetailsStep = ({
  nextStep,
  prevStep,
  handleInputChange,
  formData,
  setFormData,
  errors,
  emailCheck,
  companyCheck,
  phoneCheck,
  companyValue,
}) => {
  const dispatch = useDispatch();
  const serviceParms = useParams();

  const debounceTimer = useRef({ company_name: null });
  const [hasCompanyReg, setHasCompanyReg] = useState(null);

  const handleCheck = () => {
    const hasCompanyReg = formData.company_reg_number.trim().length > 0;
    const hasCompanyName = formData.company_name.trim().length > 0;

    if (!formData.profile_name || formData.profile_name.trim() === "") {
      showToast("error", "Business Profile Name is required");
      return;
    }

    if (!emailCheck) {
      showToast("error", "Please Enter Correct Email");
      return;
    } else if (companyValue && companyCheck === false) {
      showToast("error", "Please Enter Correct Company Details");
    } else if (hasCompanyReg && !hasCompanyName) {
    }

    if (formData.phone.startsWith("0")) {
      showToast("error", "Please enter phone number without '0'");
      errors.phone = "";
      return;
    } else if (!phoneCheck) {
      showToast("error", "Please Enter Correct Number");
    } else {
      nextStep();
    }
  };

  const companyData = useSelector((state) => state.companyLook?.companyData);
  const companyError = useSelector((state) => state.companyLook?.companyError);

  const handleToggleCompanyReg = (value) => {
    setHasCompanyReg(value);

    if (value === 0) {
      dispatch(
        setFormData({
          company_reg_number: "",
          company_name: "",
        })
      );
      setFormData((prev) => ({
        ...prev,
        company_reg_number: "",
        company_name: "",
      }));
      dispatch(clearCompanyData());
    }

    if (value === 1) {
      setFormData((prev) => ({
        ...prev,
        company_reg_number: "",
        company_name: "",
      }));

      dispatch(clearCompanyData());
    }
  };

  useEffect(() => {
    if (!formData.company_reg_number) {
      dispatch(
        setFormData({
          company_name: "",
        })
      );
      dispatch(clearCompanyData());
      return;
    }

    if (formData.company_reg_number.length === 8) {
      dispatch(fetchCompanyDetails(formData.company_reg_number));
    }
  }, [formData.company_reg_number]);

  useEffect(() => {
    if (companyError && formData.company_reg_number !== "") {
      showToast("error", companyError);
      dispatch(setFormData({ company_reg_number: "" }));
    }

    if (companyError) {
      dispatch(setCompanyError(null));
    }
  }, [companyError, formData.company_reg_number, dispatch]);

  useEffect(() => {
    if (companyData) {
      dispatch(
        setFormData({
          company_name: companyData?.company_name || "",
          company_address:
            companyData?.registered_office_address?.address_line_1 || "",
          company_city: companyData?.registered_office_address?.locality || "",
          company_postcode:
            companyData?.registered_office_address?.postal_code || "",
          company_country:
            companyData?.registered_office_address?.country || "",
        })
      );
    }
  }, [companyData, dispatch]);

  useEffect(() => {
    if (companyData?.company_name && hasCompanyReg === 1) {
      setFormData((prev) => ({
        ...prev,
        company_name: companyData.company_name || "",
      }));
    }
  }, [companyData, hasCompanyReg]);

  return (
    <>
      <div className={styles.pageContainer}>
        <div className={styles.container}>
          <div className={styles.headerContainer}>
            <h2 className={styles.heading}>
              Let’s get to know you a little better
            </h2>
            <p className={styles.subheading}>
              Just add the information below and you will be able to see{" "}
              {serviceParms?.serviceTitle?.replace(/-/g, " ")} leads for your
              business
            </p>
          </div>

          <div className={styles.formContainer}>
            <form className={styles.form}>
              <div className={styles.labelInputWrapper}>
                <label className={styles.label}>Your name</label>
                <input
                  type="text"
                  className={`${styles.input} ${
                    errors.name ? styles.errorBorder : ""
                  }`}
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              {errors.name && <p className={styles.errorText}>{errors.name}</p>}

              <div className={styles.labelInputWrapper}>
                <label className={styles.label}>Business Profile Name</label>
                <input
                  type="text"
                  className={`${styles.input} ${
                    errors.profile_name ? styles.errorBorder : ""
                  }`}
                  name="profile_name"
                  value={formData.profile_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              {errors.profile_name && (
                <p className={styles.errorText}>{errors.profile_name}</p>
              )}

              <div className={styles.labelInputWrapper}>
                <label className={styles.label}>
                  Do you have a company registration number?
                </label>
                <div className={styles.toggleGroup}>
                  <button
                    type="button"
                    className={
                      hasCompanyReg === 1
                        ? styles.activeButton
                        : styles.toggleButton
                    }
                    onClick={() => handleToggleCompanyReg(1)}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    className={
                      hasCompanyReg === 0
                        ? styles.activeButtonNo
                        : styles.toggleButtonNo
                    }
                    onClick={() => handleToggleCompanyReg(0)}
                  >
                    No
                  </button>
                </div>
              </div>

              {hasCompanyReg === 1 && (
                <>
                  {/* Company Registration Number */}
                  <div className={styles.labelInputWrapper}>
                    <label className={styles.label}>
                      Company registration number
                      <span
                        style={{
                          fontWeight: "normal",
                          fontSize: "0.85em",
                          color: "#666",
                        }}
                      >
                        (Optional)
                      </span>
                    </label>
                    <input
                      type="text"
                      className={`${styles.input} ${
                        errors.company_reg_number ? styles.errorBorder : ""
                      }`}
                      name="company_reg_number"
                      value={formData.company_reg_number}
                      onChange={(e) => {
                        const value = e.target.value
                          .replace(/[^a-zA-Z0-9]/g, "")
                          .slice(0, 8);
                        handleInputChange({
                          target: { name: "company_reg_number", value },
                        });
                      }}
                      // maxLength={8}
                    />
                  </div>

                  {/* Company Name */}
                  <div className={styles.labelInputWrapper}>
                    <label className={styles.label}>Company name</label>
                    <input
                      type="text"
                      className={`${styles.input} ${
                        errors.company_name ? styles.errorBorder : ""
                      }`}
                      name="company_name"
                      value={companyData?.company_name}
                      onChange={handleInputChange}
                      readOnly
                    />
                  </div>
                </>
              )}

              <div className={styles.labelInputWrapper}>
                <label className={styles.label}>Email address</label>
                <input
                  type="email"
                  className={`${styles.input} ${
                    errors.email ? styles.errorBorder : ""
                  }`}
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              {errors.email && (
                <p className={styles.errorText}>{errors.email}</p>
              )}

              <div className={styles.labelInputWrapper}>
                <label className={styles.label}>Phone number</label>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <span className={styles.countryLabel}>+44</span>

                  <input
                    type="text"
                    name="phone"
                    className={`${styles.inputs} ${
                      errors.phone ? styles.errorBorder : ""
                    }`}
                    value={formData.phone}
                    maxLength={10}
                    pattern="[0-9]*"
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/\D/g, "");
                    }}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {errors.phone && (
                <p className={styles.errorText}>{errors.phone}</p>
              )}

              <div className={styles.labelInputWrapper}>
                <label className={styles.label}>
                  Does your company have a website?
                </label>

                <div className={styles.toggleGroup}>
                  <button
                    type="button"
                    className={
                      formData.is_company_website == 1
                        ? styles.activeButton
                        : styles.toggleButton
                    }
                    onClick={() =>
                      dispatch(
                        setFormData({
                          is_company_website: 1,
                          company_website: "",
                        })
                      )
                    }
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    className={
                      formData.is_company_website == 0
                        ? styles.activeButtonNo
                        : styles.toggleButtonNo
                    }
                    onClick={() =>
                      dispatch(
                        setFormData({
                          is_company_website: 0,
                          company_website: "",
                        })
                      )
                    }
                  >
                    No
                  </button>
                </div>
              </div>
              {formData.is_company_website === 1 && (
                <input
                  type="text"
                  className={`${styles.input} ${
                    errors.company_website ? styles.errorBorder : ""
                  }`}
                  name="company_website"
                  placeholder="Website address (optional)"
                  value={
                    formData.company_website != 1
                      ? formData.company_website
                      : ""
                  }
                  onChange={(e) =>
                    dispatch(
                      setFormData({
                        company_website: e.target.value,
                      })
                    )
                  }
                />
              )}
              {errors.company_website && (
                <p className={styles.errorText}>{errors.company_website}</p>
              )}
              <div className={styles.labelInputWrapper}>
                <label className={styles.label}>
                  What is the estimated number of new jobs per month you would
                  like to help grow your business?
                </label>
                <div className={styles.optionGroup}>
                  {["1-5", "6-10", "10-20", "20-30", "30+"].map((count) => (
                    <button
                      key={count}
                      type="button"
                      className={
                        formData.new_jobs === count
                          ? styles.activeOption
                          : styles.optionButton
                      }
                      onClick={() => dispatch(setFormData({ new_jobs: count }))}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.labelInputWrapper}>
                <label className={styles.label}>Company size, employees</label>
                <div className={styles.optionGroup}>
                  {[
                    "Self-employed, Sole trader",
                    "2-10",
                    "11-50",
                    "51-200",
                    "200+",
                  ].map((size) => (
                    <button
                      key={size}
                      type="button"
                      className={
                        formData.company_size === size
                          ? styles.activeOption
                          : styles.optionButton
                      }
                      onClick={() =>
                        dispatch(setFormData({ company_size: size }))
                      }
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.labelInputWrapper}>
                <label className={styles.label}>
                  Does your company have a sales team?
                </label>
                <div className={styles.toggleGroup}>
                  <button
                    type="button"
                    className={
                      formData.company_sales_team === 1
                        ? styles.activeButton
                        : styles.toggleButton
                    }
                    onClick={() =>
                      dispatch(
                        setFormData({
                          company_sales_team: 1,
                        })
                      )
                    }
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    className={
                      formData.company_sales_team === 0
                        ? styles.activeButtonNo
                        : styles.toggleButtonNo
                    }
                    onClick={() =>
                      dispatch(
                        setFormData({
                          company_sales_team: 0,
                        })
                      )
                    }
                  >
                    No
                  </button>
                </div>
              </div>

              <div className={styles.labelInputWrapper}>
                <label className={styles.label}>
                  Does your company use social media?
                </label>
                <div className={styles.toggleGroup}>
                  <button
                    type="button"
                    className={
                      formData.social_media === 1
                        ? styles.activeButton
                        : styles.toggleButton
                    }
                    onClick={() => dispatch(setFormData({ social_media: 1 }))}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    className={
                      formData.social_media === 0
                        ? styles.activeButtonNo
                        : styles.toggleButtonNo
                    }
                    onClick={() => dispatch(setFormData({ social_media: 0 }))}
                  >
                    No
                  </button>
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
                  onClick={handleCheck}
                >
                  Next
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServiceDetailsStep;
