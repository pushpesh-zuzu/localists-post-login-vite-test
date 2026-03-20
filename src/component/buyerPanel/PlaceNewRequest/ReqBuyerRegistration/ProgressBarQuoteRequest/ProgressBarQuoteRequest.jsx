import styles from "./ProgressBarQuoteRequest.module.css";

const ProgressBarQuoteRequest = ({ value = 0 }) => {
  const safeValue = Math.min(Math.max(Number(value) || 0, 0), 100);

  return (
    <div className={styles.track}>
      <div
        className={styles.bar}
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
};

export default ProgressBarQuoteRequest;