import { useState } from "react";
import styles from "./BuyerSecondStep.module.css";
import ImageModal from "../ImageModal";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { closeRequestData } from "../../../../store/Buyer/BuyerSlice";
import { showToast } from "../../../../utils";

const BuyerSecondStep = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [price, setPrice] = useState("");
  const [unitType, setUnitType] = useState("Total Price");
  const [disclose, setDisclose] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { leadId, sellerId } = location.state || {};
  const [errors, setErrors] = useState({ price: false });

  const handleSubmit = () => {
    if (!sellerId && sellerId !== "someone_else") {
      showToast("error", "Please select option");
      return;
    }

    if (!price || Number(price) <= 0) {
      showToast("error", "Please enter a valid price");
      setErrors((prev) => ({ ...prev, price: true }));
      return;
    }

    const data = {
      lead_id: leadId["id"],
      seller_id: sellerId === "someone_else" ? 0 : sellerId,
      final_price: Number(price),
      unit_type: unitType,
      disclose_information: disclose ? 1 : 0,
    };
    dispatch(closeRequestData(data)).then((result) => {});
    setIsModalOpen(true);
  };
  const handleBack = () => {
    navigate(-1);
  };
  return (
    <div className={styles.container}>
      <div className={styles.infoBox}>
        <p>
          To help improve our matching service and to help with or pricing
          guides, please can you confirm.
        </p>
      </div>

      <h2 className={styles.question}>What was the final agreed price?</h2>
      <p className={styles.subtext}>
        This information is kept private and only used to help us provide you
        better leads in the future.
      </p>

      <div className={styles.inputGroup}>
        <div className={styles.priceInput}>
          {unitType === "Total Price" && <span>£</span>}
          <input
            type="number"
            placeholder="0"
            value={price}
            onChange={(e) => {
              setPrice(e.target.value);
              setErrors((prev) => ({ ...prev, price: false }));
            }}
            className={`${errors.price ? styles.inputError : ""}`}
          />
        </div>

        {errors.price && (
          <span className={styles.errorText}>Please fill this field</span>
        )}

        <select
          className={styles.customSelect}
          value={unitType}
          onChange={(e) => setUnitType(e.target.value)}
        >
          <option>Total Price</option>
          <option>Hour</option>
          <option>Day</option>
          <option>Visit</option>
          <option>Sessions</option>
          <option>Week</option>
          <option>Month</option>
        </select>
      </div>

      <div className={styles.checkboxGroup}>
        <input
          type="checkbox"
          id="hidePrice"
          checked={disclose}
          onChange={(e) => setDisclose(e.target.checked)}
        />
        <label htmlFor="hidePrice">
          I don't want to disclose this information
        </label>
      </div>

      <div className={styles.buttonGroup}>
        <button className={styles.backBtn} onClick={handleBack}>
          Back
        </button>
        <button className={styles.submitBtn} onClick={handleSubmit}>
          Submit
        </button>
      </div>
      {isModalOpen && (
        <ImageModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSelectService={(service) => {
            setIsModalOpen(false);
            setSelectedService(service);
          }}
        />
      )}
    </div>
  );
};

export default BuyerSecondStep;
