import React, { useEffect } from "react";
import styles from "./LeadInfoModal.module.css";

const leadData = [
  { label: "What is your gender?", value: "Female" },
  { label: "What is your age?", value: "60 or older" },
  {
    label: "Do you have a preference for the gender of the trainer?",
    value: "It doesn't matter",
  },
  {
    label: "How frequently do you want your sessions?",
    value: "I'm not sure yet",
  },
  {
    label: "How would you describe your current exercise regime?",
    value: "I am unable due to my knees",
  },
  { label: "What are your goals?", value: "Get my body strength up again" },
  { label: "Which location(s) would you consider?", value: "Home" },
  { label: "Do you have any day preference(s)?", value: "Any day" },
  {
    label: "Do you have any time preference(s)?",
    value: "Morning (9am-noon), Early afternoon (noon-3pm)",
  },
];

const LeadInfoModal = ({ visible, onClose }) => {
  useEffect(() => {
    if (visible) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [visible]);
  if (!visible) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>An example lead on Localists for a Personal Trainer</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            &times;
          </button>
        </div>
        <div className={styles.content}>
          {leadData.map((item, index) => (
            <div className={styles.row} key={index}>
              <p className={styles.label}>{item.label}</p>
              <p className={styles.value}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeadInfoModal;
