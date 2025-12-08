import React from "react";
import styles from "./CustomModal.module.css";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const CustomModal = ({ isOpen, onClose, onContinue, message, loading }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          disabled={loading}
        >
          ×
        </button>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button
            className={styles.continueBtn}
            onClick={onContinue}
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
    </div>
  );
};

export default CustomModal;
