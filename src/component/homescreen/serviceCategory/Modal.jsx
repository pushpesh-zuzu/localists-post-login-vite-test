import { Progress } from "antd";
import styles from "./serviceCategory.module.css";

const Modal = ({ children, onClose }) => {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          ✖
        </button>

        <div className={styles.headerImage}>
          <h2>What kind of property is this for?</h2>
          <Progress
            percent={30}
            strokeColor="#00AFE3"
            trailColor="#EDEDED"
            strokeWidth={3}
            showInfo={false}
            className={styles.customProgress}
          />
          <div className={styles.sliderContainer}>
            <div className={`${styles.sliderDot} ${styles.active}`}></div>
            <div className={styles.sliderDot}></div>
            <div className={styles.sliderDot}></div>
          </div>
        </div>

        <div className={styles.optionsContainer}>
          {[
            "Allotment",
            "Communal garden",
            "Office or commercial garden",
            "Public garden",
            "Residential garden",
            "Other",
          ].map((option, index) => (
            <label key={index} className={styles.option}>
              <input type="radio" name="propertyType" value={option} />
              {option}
            </label>
          ))}
        </div>

        <button className={styles.continueButton}>Continue</button>
      </div>
    </div>
  );
};

export default Modal;
