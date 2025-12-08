import { useEffect, useRef } from "react";
import styles from "./ServiceBusinessAddressStep.module.css";
import { useDispatch, useSelector } from "react-redux";

const ServiceBusinessAddressStep = ({
  nextStep,
  prevStep,
  handleInputChange,
  formData,
  setFormData,
  setHasPopulatedFromCompany,
  addressValue,
}) => {
  const dispatch = useDispatch();
  const { country, city, postalcode } = useSelector((state) => state.findJobs);
  const companyData = useSelector((state) => state.companyLook?.companyData);

  const hasPopulatedFromCompany = useSelector(
    (state) => state.findJobs.hasPopulatedFromCompany
  );

  const hasClearedOnce = useRef(false);
  const handleCheck = () => {
    nextStep();
  };

  useEffect(() => {
    const reg = formData.company_reg_number?.trim();

    if (
      reg?.length === 8 &&
      companyData?.company_name &&
      companyData?.registered_office_address
    ) {
      const newAddress = {};

      dispatch(setFormData(newAddress));
      dispatch(setHasPopulatedFromCompany(true));
    }
  }, [companyData]);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.container}>
        <div className={styles.headerContainer}>
          <h2 className={styles.heading}>Your business address</h2>
          <p className={styles.subheading}>
            This will be used for tax & billing
          </p>
        </div>

        <div className={styles.formContainer}>
          <form className={styles.form}>
            <div className={styles.labelInputWrapper}>
              <label className={styles.label}>Street address</label>
              <input
                type="text"
                className={styles.input}
                name="address"
                value={addressValue}
                onChange={handleInputChange}
              />
            </div>

            <div className={styles.labelInputWrapper}>
              <label className={styles.label}>
                Building or House Name/Number
              </label>
              <input
                type="text"
                className={styles.input}
                name="apartment"
                value={formData.apartment}
                onChange={handleInputChange}
              />
            </div>

            <div className={styles.labelInputWrapper}>
              <label className={styles.label}>City</label>
              <input
                type="text"
                className={styles.input}
                name="city"
                value={formData.city}
                onChange={handleInputChange}
              />
            </div>

            <div className={styles.labelInputWrapper}>
              <label className={styles.label}>Country</label>
              <input
                type="text"
                className={styles.input}
                name="country"
                value={formData.country}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.labelInputWrapper}>
              <label className={styles.label}>Postcode</label>

              <div className={styles.labelInputWrapper}>
                <input
                  type="text"
                  placeholder="Postcode"
                  className={styles.input}
                  style={{
                    appearance: "textfield",
                    MozAppearance: "textfield",
                    WebkitAppearance: "none",
                  }}
                  name="zipcode"
                  value={
                    formData.postcode ||
                    (!formData.company_reg_number
                      ? formData.zipcode_old
                      : "") ||
                    ""
                  }
                  onChange={(e) =>
                    dispatch(
                      setFormData({
                        ...formData,
                        zipcode: e.target.value,
                      })
                    )
                  }
                />
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
  );
};

export default ServiceBusinessAddressStep;
