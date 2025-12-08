import React, { useState } from "react";
import styles from "./FeelingStuck.module.css";
import LeadsImg from "../../../../assets/Images/Leads/LeadsImg.svg";

const FeelingStuck = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className={styles.banner}>
      <button
        className={styles.closeButton}
        onClick={() => setIsVisible(false)}
      >
        X
      </button>
      <div className={styles.textContainer}>
        <h2>Feeling stuck?</h2>
        <p>
          Day or night, our team is available 24/7 to help guide you to success.
        </p>
      </div>
      <div className={styles.imageContainer}>
        <img src={LeadsImg} alt="" />
      </div>
    </div>
  );
};

export default FeelingStuck;
