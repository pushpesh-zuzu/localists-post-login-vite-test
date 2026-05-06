"use client";

import React from "react";
import styles from "./NewBuyerRequestQuestionOptionsBox.module.css";

const NewBuyerRequestQuestionOptionsBox = ({
  label,
  isSelected,
  onSelect,
}) => {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`${styles.btn} ${isSelected ? styles.selected : ""}`}
    >
      <span>{label}</span>
    </button>
  );
};

export default NewBuyerRequestQuestionOptionsBox;