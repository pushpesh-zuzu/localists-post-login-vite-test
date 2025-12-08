import React from "react";
import styles from "./GetInTouchHelpCenter.module.css";
import SmsIcon from "../../../assets/Images/HelpCenter/SmsIcon.svg";
import PhoneIcon from "../../../assets/Images/HelpCenter/PhoneIcon.svg";

const GetInTouchHelpCenter = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>
        Get <span>in touch</span>
      </h2>
      <div className={styles.cards}>
        <div className={styles.card}>
          <img src={SmsIcon} alt="Email Icon" className={styles.icon} />
          <span className={styles.text}>team@localists.com</span>
        </div>
        <div className={styles.card}>
          <img src={PhoneIcon} alt="Phone Icon" className={styles.icon} />
          <span className={styles.text}>+44 00 00 000 00000</span>
        </div>
      </div>
    </div>
  );
};

export default GetInTouchHelpCenter;
