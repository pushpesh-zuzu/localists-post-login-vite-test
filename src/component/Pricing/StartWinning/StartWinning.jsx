import React from "react";
import styles from "./StartWinning.module.css";
import { useNavigate } from "react-router-dom";

const StartWinning = () => {
  const navigate = useNavigate()
  const onSubmitPageChange = () => {
    navigate("/en/gb/sellers/create")
  }
  
  return (
    <div className={styles.container}>
      <p className={styles.heading}>Start winning new business today</p>
      <button className={styles.button} onClick={onSubmitPageChange}>Join as a Professional</button>
    </div>
  );
};

export default StartWinning;
