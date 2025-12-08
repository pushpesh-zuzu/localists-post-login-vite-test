import styles from "./ServicesSteps.module.css";
import { serviceStepsData } from "../../../constant/HowItWorksData";
import SearchImg from "../../../assets/Images/SearchImg.png";
import FormServiceStep from "../../../assets/Images/FormServiceStep.png";

const ServicesSteps = () => {
  return (
    <div className={styles.stepsContainer}>
      {serviceStepsData.map((step, index) => (
        <div key={step.id} className={styles.stepWrapper}>
          {index % 2 === 0 ? (
            <>
              <div className={styles.imageContainer}>
                <img
                  src={step.image}
                  alt={step.title}
                  className={styles.stepImage}
                />
                {index === 0 && (
                  <div className={styles.popover}>Enter Your Requirements</div>
                )}
              </div>
              <div className={styles.textContainer}>
                <p className={styles.stepTitle}>{step.title}</p>
                <h3 className={styles.stepHeading}>{step.heading}</h3>
              </div>
            </>
          ) : (
            <>
              <div className={styles.textContainer}>
                <p className={styles.stepTitle}>{step.title}</p>
                <h3 className={styles.stepHeading}>{step.heading}</h3>
              </div>
              <div className={styles.imageContainer}>
                <img
                  src={step.image}
                  alt={step.title}
                  className={styles.stepImage}
                />
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default ServicesSteps;
