import React, { useEffect, useState } from "react";
import styles from "./PhotosAccordion.module.css";

const AddYoutubeModal = ({
  isOpen,
  onClose,
  onSave,
  formState,
  handleInputChange,
  value,
}) => {
  if (!isOpen) return null;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3 className={styles.modalTitle}>Add YouTube Video</h3>

        <input
          type="text"
          placeholder="Enter YouTube video link"
          name="company_youtube_link"
          value={value}
          onChange={handleInputChange}
          className={styles.youtubeInput}
        />

        <div className={styles.buttonGroup}>
          <button onClick={onClose} className={styles.cancelBtn}>
            Cancel
          </button>
          <button onClick={onSave} className={styles.saveBtn}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddYoutubeModal;
