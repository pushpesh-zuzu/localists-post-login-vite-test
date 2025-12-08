import React from "react";
import styles from "./PostCode.module.css";
import blog_logo from "../../../assets/Images/Blog_Logo.png";

const PostCode = () => {
  return (
    <div className={styles.bannerContainer}>
      <div className={styles.inputWrapper}>
        <input
          type="text"
          placeholder="Enter Postcode"
          className={styles.postcodeInput}
        />
        <button className={styles.goButton}>Go</button>
      </div>

      <div className={styles.textWrapper}>
        <h3>Free quotes, with zero obligation.</h3>
      </div>
      <span className={styles.logo}>
        <img src={blog_logo} alt="" />
      </span>
    </div>
  );
};

export default PostCode;
