import styles from "./findingBusinessProfessionals.module.css";

const FindingBusinessProfessionals = () => {
  return (
    <div className={styles.parentContainer}>
      <div className={styles.container}>
        <span className={styles.title}>
          Need help finding a{" "}
          <span className={styles.highlight}>Business professional?</span>
        </span>
        <div className={styles.descriptionContainer}>
          <p>
            You can find the best Business professionals on Localists. Start your
            search and get free quotes now!
          </p>
          <p>
            First time looking for a Business professional and not sure where to
            start? Tell us about your project and we&apos;ll send you a list of
            Business professionals to review. There&apos;s no pressure to hire,
            so you can compare profiles, read previous reviews and ask for more
            information before you make your decision.
          </p>
          <p>Best of all - it&apos;s completely free!</p>
        </div>
        <button type="primary" className={styles.button}>
          Find a Business professional today
        </button>
      </div>
    </div>
  );
};

export default FindingBusinessProfessionals;
