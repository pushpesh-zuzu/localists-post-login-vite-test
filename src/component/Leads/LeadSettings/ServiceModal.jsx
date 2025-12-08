import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getleadPreferencesList } from "../../../store/LeadSetting/leadSettingSlice";
import styles from "./ServiceModal.module.css";

const ServiceSelectionModal = ({
  isOpen,
  onClose,
  onConfirm,
  selectedServices,
  isEditing,
}) => {
  const dispatch = useDispatch();
  const [allSelectedService, setAllSelectedService] = useState([]);
  const { userToken } = useSelector((state) => state.auth);
  const { registerData } = useSelector((state) => state.findJobs);
  const { preferenceList } = useSelector((state) => state.leadSetting);
  useEffect(() => {
    const data = {
      user_id:
        userToken?.active_status === 1
          ? userToken?.remember_tokens
          : registerData?.remember_tokens,
    };
    dispatch(getleadPreferencesList(data));
    handleCheckbox();
  }, []);

  const handleCheckbox = () => {
    const service = selectedServices
      ?.map((item) => item?.id)
      .filter((id) => id != undefined);
    setAllSelectedService(service);
  };

  const services =
    preferenceList?.map((service) => ({
      label: service.name,
      value: service.id,
    })) || [];

  const handleToggle = (value) => {
    if (allSelectedService.includes(value)) {
      const updatedData = allSelectedService.filter((v) => v != value);
      setAllSelectedService(updatedData);
    } else {
      setAllSelectedService([...allSelectedService, value]);
    }
  };
  useEffect(() => {
    if (!isEditing) {
      let val = services.map((item) => {
        return item?.value;
      });
      setAllSelectedService(val);
    }
    if (isEditing) {
      let val = selectedServices.map((item) => {
        return Number(item?.id);
      });
      setAllSelectedService(val);
    }
  }, [isEditing]);
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2 className={styles.title}>Services</h2>
        <p className={styles.subtitle}>
          Choose the specific services you offer in this area so we can match
          you with the most relevant leads.
        </p>
        <div className={styles.checkboxList}>
          {services.map((service) => (
            <label key={service.value} className={styles.checkboxItem}>
              <span className={styles.labelText}>{service.label}</span>
              <input
                type="checkbox"
                checked={allSelectedService.includes(service.value)}
                onChange={() => handleToggle(service.value)}
              />
              <span className={styles.customCheckbox}></span>
            </label>
          ))}
        </div>
        <div className={styles.buttonRow}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button
            className={styles.saveBtn}
            onClick={() => onConfirm(allSelectedService)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceSelectionModal;
