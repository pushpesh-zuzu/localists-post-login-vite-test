import React from "react";
import styles from "./HelpCenter.module.css";
import TellUsHow from "./TellUsHow/TellUsHow";
import PopularHelpCenter from "./PopularHelpCenter/PopularHelpCenter";
import CategoriesHelpCenter from "./CategoriesHelpCenter/CategoriesHelpCenter";
import GetInTouchHelpCenter from "./GetInTouchHelpCenter/GetInTouchHelpCenter";

const HelpCenter = () => {
  return (
    <>
      <TellUsHow />
      <div className={styles.mainContainer}>
        <CategoriesHelpCenter />
        <PopularHelpCenter />
        <GetInTouchHelpCenter />
      </div>
    </>
  );
};

export default HelpCenter;
