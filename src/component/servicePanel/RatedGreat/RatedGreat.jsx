import React from "react";
import styles from "./RatedGreat.module.css";
import RatedGreatImg from "../../../assets/Images/ServicePanel/RatedGreatImg.png";

const RatedGreat = () => {
  return (
    <div className={styles.container}>
      <img
        src={RatedGreatImg}
        alt="Localist is rated Great"
        className={styles.image}
      />
    </div>
  );
};

export default RatedGreat;
