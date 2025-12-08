import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./SuggestQuestions.module.css";
import union from "../../../../assets/Images/SuggestQuestion/Union.svg";
import editIcon from "../../../../assets/Images/SuggestQuestion/editIcon.svg";
import deleteIcon from "../../../../assets/Images/SuggestQuestion/deleteIcon.svg";

const SuggestQuestions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const serviceId = location.state?.serviceId;

  const cards = [
    {
      icon: union,
      label: "Suggest a new question",
      path: "/feedback/questions/new",
    },
    {
      icon: editIcon,
      label: "Edit a current question",
      path: "/feedback/questions/edit",
    },
    {
      icon: deleteIcon,
      label: "Suggest a question to remove",
      path: "/feedback/questions/remove",
    },
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Branding & Brand Management</h2>
      <p className={styles.subheading}>
        Are there any questions you'd like to see added, edited or removed?
      </p>

      <div className={styles.cardWrapper}>
        {cards.map((card, index) => (
          <div
            key={index}
            className={styles.card}
            onClick={() => navigate(card.path, { state: { serviceId } })}
          >
            <div className={styles.iconWrapper}>
              <img src={card.icon} alt="icon" />
            </div>
            <p className={styles.label}>{card.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestQuestions;
