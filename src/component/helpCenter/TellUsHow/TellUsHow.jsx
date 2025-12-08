import React from "react";
import styles from "./TellUsHow.module.css";
import TellUsHowImg from "../../../assets/Images/HelpCenter/TellUsHowImg.svg";

const TellUsHow = () => {
  return (
    <div className={styles.tellUsHowContainer}>
      <div className={styles.searchcontainer}>
        {/* <h1>
          Tell us how <span>we can help</span>
        </h1> */}
        <h1>
  <span className={styles.firstLine}>Tell us how</span>{" "}
  <span className={styles.secondLine}>we can help</span>
</h1>

        <div className={styles.searchBoxContainer}>
          <div className={styles.searchInputContainer}>
            <input
              className={styles.searchInput}
              placeholder="Let us know how we can assist you..."
            />

            <button>Go</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TellUsHow;
