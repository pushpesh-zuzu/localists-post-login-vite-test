import React from "react";
import styles from "./SettingsList.module.css";
import myProfile from "../../../assets/Images/Setting/profileImg.svg";
import myLeadSetting from "../../../assets/Images/Setting/settingImg.svg";
import myCredits from "../../../assets/Images/Setting/creditcard.svg";
import myNotification from "../../../assets/Images/Setting/notificationImg.svg";
import { useNavigate } from "react-router-dom";

const SettingsList = () => {
  const navigate = useNavigate();

  const handleMyService = () => {
    navigate("/settings/leads/my-services");
  };

  const handleAccountSetting = () => {
    navigate("/settings/profile/account-details");
  };

  const handleMyProfile = () => {
    navigate("/settings/profile/my-profile");
  };
  const handleMycredit = () => {
    navigate("/settings/billing/my-credits");
  };
  const handleReview = () => {
    navigate("/settings/profile/my-profile", {
      state: { review: true },
    });
  };
  const handleInvoice = () => {
    navigate("/settings/billing/invoice-billing-details");
  };
  const handlePayment = () => {
    navigate("/settings/billing/payment-details");
  };
  const handleMail = () => {
    navigate("/settings/notifications/e-mail-notification");
  };
  const handleBrowser = () => {
    navigate("/settings/notifications/browser-notification");
  };
  return (
    <>
      <div className="container">
        <div className={styles.SettingWrapper}>
          <h1>Settings</h1>
        </div>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.myProfileWrapper}>
              <img src={myProfile} alt="My Profile" />
            </div>
            <h2>My Profile</h2>
          </div>
          <div className={styles.sectionContent}>
            <div
              className={styles.card}
              style={{ backgroundColor: "#FFD5D2" }}
              onClick={handleMyProfile}
            >
              <span style={{ cursor: "pointer" }}>My Profile</span>
            </div>

            <p>
              Make your profile stand out to win more customers. Highlight what
              makes your business unique and why people should choose you.
            </p>
            <div
              className={styles.card}
              style={{ backgroundColor: "#FFD5D2" }}
              onClick={handleReview}
            >
              <span style={{ cursor: "pointer" }}>Reviews</span>
            </div>
            <p>
              Get your dynamic review link and get reviews to help
              boost your profile.
            </p>
            <div
              className={styles.card}
              style={{ backgroundColor: "#FFD5D2" }}
              onClick={handleAccountSetting}
            >
              <span style={{ cursor: "pointer" }}>Account details</span>
            </div>
            <p>
              The login details and contact number we’ll use to reach you
              directly when needed.
            </p>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.myLeadSettingWrapper}>
              <img src={myLeadSetting} alt="My Profile" />
            </div>
            <h2>Lead Settings</h2>
          </div>
          <div className={styles.sectionContent}>
            <div
              className={styles.card}
              style={{ backgroundColor: "#AAC9D2" }}
              onClick={handleMyService}
            >
              <span style={{ cursor: "pointer" }}>My Services</span>
            </div>
            <p>
              Tell us what you do, and we’ll send you the leads that fit your
              services best.
            </p>
            <div
              className={styles.card}
              style={{ backgroundColor: "#AAC9D2" }}
              onClick={handleMyService}
            >
              <span style={{ cursor: "pointer" }}>My Locations</span>
            </div>
            <p>Add or Update the locations where you provide your services.</p>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.myLeadSettingWrappers}>
              <img src={myCredits} alt="My Profile" />
            </div>
            <h2>My Credits</h2>
          </div>
          <div className={styles.sectionContent}>
            <div
              className={styles.card}
              style={{ backgroundColor: "#CBD2AA" }}
              onClick={handleMycredit}
            >
              <span style={{ cursor: "pointer" }}>My credits</span>
            </div>
            <p>
              View your credit history and top up credits to connect with more
              customers.
            </p>
            <div
              className={styles.card}
              style={{ backgroundColor: "#CBD2AA" }}
              onClick={handleInvoice}
            >
              <span style={{ cursor: "pointer" }}>
                Invoices and billing details
              </span>
            </div>
            <p>Access invoices & Update Billing Information.</p>
            <div
              className={styles.card}
              style={{ backgroundColor: "#CBD2AA" }}
              onClick={handlePayment}
            >
              <span style={{ cursor: "pointer" }}>My payment details</span>
            </div>
            <p>Access & Update payment details.</p>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.myProfileWrappers}>
              <img src={myNotification} alt="My Profile" />
            </div>
            <h2>Notifications</h2>
          </div>
          <div className={styles.sectionContent}>
            <div
              className={styles.card}
              style={{ backgroundColor: "#82FFB2" }}
              onClick={handleMail}
            >
              <span style={{ cursor: "pointer" }}>Email</span>
            </div>
            <p>Let us know which emails you’d like to get from us.</p>
            <div
              className={styles.card}
              style={{ backgroundColor: "#82FFB2" }}
              onClick={handleBrowser}
            >
              <span style={{ cursor: "pointer" }}>Browser</span>
            </div>
            <p>Select the browser notifications you want to get from us.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsList;
