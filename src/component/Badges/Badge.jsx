import styles from "./Badge.module.css";
import iIcon from "../../assets/Images/iIcon.svg";
import { useNavigate } from "react-router-dom";
import blackArrow from "../../assets/Images/Leads/blackArrowRight.svg";
// import VerifiedBadge from "./VerifiedBadge";
import BadgeModal from "./BadgeModal";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { POST_LOGIN_BASE_URL } from "../../utils";

const Badge = () => {
  const navigate = useNavigate()
  const { viewProfileData } = useSelector((state) => state.leadSetting);
  const { userToken } = useSelector((state) => state.auth);
  const user_id = userToken?.id ? userToken?.id : registerData?.id;
  const companySlug = viewProfileData?.business_profile_name
    ? viewProfileData?.business_profile_name.replace(/\s+/g, "-")
    : "";
  const [showModal, setShowModal] = useState(false);
  const handleBack = () => {
    navigate("/settings");
  };
  console.log(POST_LOGIN_BASE_URL,'POST_LOGIN_BASE_URL hell')
  
  useEffect(() => {
    const script = document.createElement("script");
    // script.src = "http://127.0.0.1:5200/widget.js";
    script.src = `${POST_LOGIN_BASE_URL}/widget.js`;

    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);
  return (
    <>
      <div className={styles.container}>
        <div className={styles.backText} onClick={handleBack}>
          <img src={blackArrow} alt="..." /> Settings
        </div>
        <h1 className={styles.heading}>Badges</h1>
        <div className={styles.manageWrapper}>
          <span className={styles.infoIcon}>
            <img src={iIcon} alt="iIcon" />
          </span>
          <p className={styles.description}>
            Localists Badges help you get hired more through your own website or
            social media. Use our badges to showcase your reviews and share that
            you’re a professional on Localists.{" "}
          </p>
        </div>

        <div className={styles.card}>
          <div className={styles.badgeCard} >
            {/* <VerifiedBadge /> */}
            <div className="localists-widget"></div>
            <div
              style={{ display: "flex", gap: "10px", flexDirection: "column" }}
            >
              <p className={styles.tag}>The Localists Reviews badge</p>
              <span>
                Put this badge on your website to encourage customers to leave
                reviews. Inviting customers to leave reviews has a big impact on
                customer confidence.
              </span>
              <p
                onClick={() => {
                  setShowModal(true);
                }}
                style={{ color: "#00aef3", cursor: "pointer" }}
              >
                Select
              </p>
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <BadgeModal
          companySlug={companySlug}
          companyName={viewProfileData?.business_profile_name}
          userId={user_id}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default Badge;
