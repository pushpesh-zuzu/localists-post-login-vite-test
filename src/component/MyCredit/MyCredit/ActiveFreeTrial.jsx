import React from "react";
import styles from "./ActiveFreeTrial.module.css";

const ActiveFreeTrial = () => {
  return (
    <div className={styles.banner}>
      <div className={styles.leftSection}>
        <h3>
          Get <span className={styles.highlight}>20% off</span> new <br />
          with a free <strong>Elite Pro</strong> trial
        </h3>
      </div>

      <div className={styles.divider} />

      <div className={styles.centerSection}>
        <p className={styles.description}>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s.
        </p>
      </div>

      <div className={styles.rightSection}>
        <button className={styles.trialButton}>Activate free trial</button>
        <span className={styles.learnMore}>Learn more about all benefits</span>
      </div>
    </div>
  );
};

export default ActiveFreeTrial;
