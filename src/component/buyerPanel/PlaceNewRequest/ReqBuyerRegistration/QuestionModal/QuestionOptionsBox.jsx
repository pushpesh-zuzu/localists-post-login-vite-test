import React from "react";
import styles from "./QuestionOptionBox.module.css";

const QuestionOptionsBox = ({ label, isSelected, onSelect }) => {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`${styles.btn} ${isSelected ? styles.btnSelected : styles.btnDefault}`}
    >
      <span>{label}</span>
    </button>
  );
};

export default QuestionOptionsBox;