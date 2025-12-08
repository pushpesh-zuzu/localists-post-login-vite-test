import React from "react";
import styles from "./PricingSection.module.css";
import { useNavigate } from "react-router-dom";

const PricingSection = () => {
  const navigate = useNavigate()
  const onSubmitPageChange = () => {
    navigate("/sellers/create")
  }
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Pricing</h1>
      <div className={styles.box}>
        <p className={styles.text}>
          At Localists, there are no surprises. From the moment you sign up, you’ll start receiving{" "}
          <span className={styles.linkText}>leads for free</span>. You only pay when you choose to contact a customer that feels right for your business.
        </p>
        {/* <button className={styles.button} onClick={onSubmitPageChange}>Join as a Professional</button> */}
      </div>
    </div>
  );
};

export default PricingSection;
