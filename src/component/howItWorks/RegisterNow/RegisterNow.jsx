import React from "react";
import styles from "./RegisterNow.module.css";
import userIcon from "../../../assets/Images/HowItWorks/userIcon.png"; // Replace with your actual path
import filterIcon from "../../../assets/Images/HowItWorks/filterIcon.png";
import cancelIcon from "../../../assets/Images/HowItWorks/cancelIcon.png";
import { handleScrollToBottom } from "../../../utils/scroll";

const RegisterNow = () => {
  return (
    <div className={styles.registerContainer}>
      <button onClick={()=>handleScrollToBottom()} className={styles.registerButton}>Register now</button>
      <div className={styles.features}>
        <div className={styles.feature}>
          <div className={styles.iconContainer}>
            <img src={userIcon} alt="User" />
          </div>
          <span>Create your account in minutes</span>
        </div>
        <div className={styles.feature}>
          <div className={styles.iconContainer}>
            <img src={filterIcon} alt="Filter" />
          </div>
          <span>Start receiving leads today</span>
        </div>
        <div className={styles.feature}>
          <div className={styles.iconContainer}>
            <img src={cancelIcon} alt="Cancel" />
          </div>
          <span>No commission or hidden fees</span>
        </div>
      </div>
    </div>
  );
};

export default RegisterNow;
