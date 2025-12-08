import { handleScrollToBottom } from "../../../utils/scroll";
import styles from "./findingBusinessProfessionals.module.css";
const CloneFindingBusinessProfessionals = ({header,subHeader,bestText}) => {
  return (
    <div className={styles.parentContainer}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          Find the Best {" "}
          <span className={styles.highlight}>{subHeader} Professionals </span>
          {" "}In Your Area
        </h2>
        <div className={styles.descriptionContainer}>
          <p>
          At Localists, we connect you with the right {subHeader} Professionals for your local business
          </p>
          <p>
            Not sure how to find the right {subHeader} Professionals? Simply tell us what you need help with and where you need it, and we’ll recommend the best {subHeader} Professionals near you. See what they offer, check out their reviews, and get free quotation for the work you require.
            It's super fast and easy!
          </p>
          <p>{bestText}</p>
        </div>
        <button type="primary" onClick={()=>handleScrollToBottom()} className={styles.button}>
          Find a {subHeader} professional today
        </button>
      </div>
    </div>
  );
}

export default CloneFindingBusinessProfessionals