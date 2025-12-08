import { useState } from "react";
import styles from "./NameMatch.module.css";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { registerUserData } from "../../../../../store/FindJobs/findJobSlice";
import { useDispatch, useSelector } from "react-redux";

const NameMatch = ({ onClose, nextStep, previousStep, email }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const [consent, setConsent] = useState(false);
  const dispatch = useDispatch();
  const { registerLoader } = useSelector((state) => state.findJobs);
  const handleNameChange = (e) => {
    setName(e.target.value);
    setError(false);
  };
  const handleSubmit = () => {
    if (!name.trim()) {
      setError(true);
      return;
    }
    const formData = new FormData();
    formData.append("email", email);
    formData.append("name", name);
    formData.append("form_status", 1);
    formData.append("loggedUser", 2);
    formData.append("active_status", 2);
    formData.append("user_type", 2);

    dispatch(registerUserData(formData)).then((result) => {
      if (result?.success) {
        nextStep();
      }
    });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div
          className={styles.closeButton}
          onClick={onClose}
          disabled={registerLoader}
        >
          x
        </div>

        <div className={styles.header}>
          <h2>View your matches now!</h2>
        </div>

        <div className={styles.infoWrapper}>
          <label htmlFor="name" className={styles.label}>
            Please enter your name
          </label>
          <input
            type="text"
            placeholder="Name"
            className={`${styles.input} ${error ? styles.inputError : ""}`}
            value={name}
            onChange={handleNameChange}
          />
          {error && (
            <span className={styles.errorMessage}>Name is required.</span>
          )}

          <div className={styles.checkboxContainer}>
            <input
              type="checkbox"
              id="consent"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />
            <label htmlFor="consent">
              I'm happy to receive marketing promotional message.
            </label>
          </div>

          <div className={styles.buttonContainer}>
            <button
              className={styles.backButton}
              onClick={previousStep}
              disabled={registerLoader}
            >
              Back
            </button>
            <button
              className={styles.nextButton}
              onClick={handleSubmit}
              disabled={registerLoader}
            >
              {registerLoader ? (
                <Spin
                  indicator={
                    <LoadingOutlined spin style={{ color: "white" }} />
                  }
                />
              ) : (
                "View Matches"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NameMatch;
