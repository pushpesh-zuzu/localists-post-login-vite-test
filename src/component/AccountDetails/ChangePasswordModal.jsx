import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import styles from "./ChangePasswordModal.module.css";

const ChangePasswordModal = ({
  isOpen,
  formData,
  newPasswordVisible,
  confirmPasswordVisible,
  setNewPasswordVisible,
  setConfirmPasswordVisible,
  handleFormChange,
  handleSavePassword,
  setIsModalOpen,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>Change Password</h3>
        </div>

        <div className={styles.formGroup}>
          <label>New Password</label>
          <div className={styles.passwordField}>
            <input
              type={newPasswordVisible ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleFormChange}
              className={`${styles.inputField} ${
                formData.error ? styles.inputError : ""
              }`}
            />
            <span
              onClick={() => setNewPasswordVisible(!newPasswordVisible)}
              className={styles.eyeIcon}
            >
              {!newPasswordVisible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            </span>
          </div>
          {formData.error && <p className={styles.error}>{formData.error}</p>}
        </div>

        <div className={styles.formGroup}>
          <label>Confirm New Password</label>
          <div className={styles.passwordField}>
            <input
              type={confirmPasswordVisible ? "text" : "password"}
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleFormChange}
              className={`${styles.inputField} ${
                formData.error ? styles.inputError : ""
              }`}
            />
            <span
              onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
              className={styles.eyeIcon}
            >
              {!confirmPasswordVisible ? (
                <EyeInvisibleOutlined />
              ) : (
                <EyeOutlined />
              )}
            </span>
          </div>
          {formData.error && <p className={styles.error}>{formData.error}</p>}
        </div>

        <div className={styles.saveButtonWrapperModal}>
          <button
            className={styles.modalCancelButton}
            onClick={() => setIsModalOpen(false)}
          >
            Cancel
          </button>
          <button
            className={styles.modalSaveButton}
            onClick={handleSavePassword}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
