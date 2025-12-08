import styles from "./FindLocalServices.module.css";

const FindLocalServices = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>
        Find Local <span className={styles.highlight}>Services</span> - Fast
      </h2>
      <h4 className={styles.subText}>
        Get competitive quotations from local suppliers in{" "}
        <span className={styles.boldText}>3 Simple Steps!</span>
      </h4>
    </div>
  );
};

export default FindLocalServices;
