import React from "react";
import styles from "./Paragraph.module.css";

const Paragraph = ({ children, className = "", ...props }) => {
  return (
    <p className={`${styles.p} ${className}`} {...props}>
      {children}
    </p>
  );
};

export default Paragraph;