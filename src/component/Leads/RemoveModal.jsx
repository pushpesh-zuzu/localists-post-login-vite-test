import React from "react";
import styles from "./RemoveModal.module.css";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const RemoveServiceModal = ({
  open,
  onCancel,
  onConfirm,
  loading,
  serviceName,
}) => {
  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button
          className={styles.closeButton}
          onClick={onCancel}
          disabled={loading}
        >
          ×
        </button>
        <p className={styles.text}>
          Are you sure you want to remove{" "}
          <span className={styles.highlight}>{serviceName} ?</span>
        </p>
        <div className={styles.actions}>
          <button
            className={styles.cancelBtn}
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className={styles.removeBtn}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <Spin
                indicator={<LoadingOutlined spin style={{ color: "white" }} />}
              />
            ) : (
              "Remove"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemoveServiceModal;
