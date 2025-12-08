import React, { useEffect, useState } from "react";
import styles from "./PrivacyPolicy.module.css";
import { useLocation, Link } from "react-router-dom";
import PrivacyContentForProfession from "./privacyContentForProfession/PrivacyContentForProfession";
import PrivacyContentForCustomer from "./privacyContentForCustomer/PrivacyContentForCustomer";
import { Helmet } from "react-helmet-async";
import CalonicalTags from "../CalonicalTags/CalonicalTags";
const PrivacyPolicy = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("professionals");

  useEffect(() => {
    if (location.hash === "#professionals") {
      setActiveTab("professionals");
    } else {
      setActiveTab("customers");
    }
  }, [location]);

  return (
    <>
      <Helmet>
        <title>Privacy Policy – Localists.com | Trusted UK Marketplace</title>
        <meta
          name="description"
          content="Read the Privacy Policy of Localists.com, operated by IMG Limited, explaining how your personal data is collected, used and protected when using our UK services."
        />
        <meta
          property="og:title"
          content="Privacy Policy – Localists.com | Trusted UK Marketplace"
        />
        <meta
          name="twitter:title"
          content="Privacy Policy – Localists.com | Trusted UK Marketplace"
        />
        <meta
          property="og:description"
          content="Read the Privacy Policy of Localists.com, operated by IMG Limited, explaining how your personal data is collected, used and protected when using our UK services."
        />
      </Helmet>
      <CalonicalTags isRequiredjsonLd={false} />
      <div className={styles.container}>
        <nav className={styles.navWrapper}>
          <ul className={styles.nav}>
            <li className={styles.navItem}>
              <Link
                to="#consumers"
                className={`${styles.navLink} ${
                  activeTab === "customers" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("customers")}
              >
                Consumers
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link
                to="#professionals"
                className={`${styles.navLink} ${
                  activeTab === "professionals" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("professionals")}
              >
                Professionals
              </Link>
            </li>
          </ul>
        </nav>

        <div className={styles.contentContainer}>
          <div className={styles.contentWrapper}>
            {activeTab === "customers" ? (
              <PrivacyContentForCustomer />
            ) : (
              <PrivacyContentForProfession />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
