import React from "react";
import styles from "./ViewProfile.module.css";

const TabNav = ({ activeTab, onTabClick, Tabs }) => {
  // Use Tabs prop if provided, otherwise fallback to default list
  const tabs = Tabs?.length
    ? Tabs
    : [
        "About",
        "Services",
        "Reviews",
        "Accreditations",
        "Q+A's",
        "Photos",
        "Videos",
        "Links",
      ];

  return (
    <div className={styles.tabContainers}>
      {tabs.map((tab) => (
        <div
          key={tab}
          className={`${styles.tab} ${activeTab === tab ? styles.active : ""}`}
          onClick={() => onTabClick(tab)}
        >
          {tab}
        </div>
      ))}
    </div>
  );
};

export default TabNav;
