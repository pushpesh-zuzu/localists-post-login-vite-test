import React from "react";
import styles from "./NewBuyerRequestProgressBarQuotesRequest.module.css";

const NewBuyerRequestProgressBarQuotesRequest = ({ value = 0 }) => {
  const safeValue = Math.min(Math.max(Number(value) || 0, 0), 100);

  return (
    <div className={styles.track}>
      <div
        className={styles.fill}
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
};

export default NewBuyerRequestProgressBarQuotesRequest;