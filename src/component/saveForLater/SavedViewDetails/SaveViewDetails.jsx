import styles from "./SaveViewDetails.module.css";
import LeadMap from "../../myResponses/LeadMap/LeadMap";
import VerifiedPhoneIcon from "../../../assets/Images/Leads/VerifiedPhoneIcon.svg";
import AdditionalDetailsIcon from "../../../assets/Images/Leads/AdditionalDetailsIcon.svg";
import FrequentUserIcon from "../../../assets/Images/Leads/FrequentUserIcon.svg";
import DotIcon from "../../../assets/Images/Leads/DotIcon.svg";
import UpdateIcon from "../../../assets/Images/Leads/UpdateIcon.svg";
import { useNavigate } from "react-router-dom";

const SavedViewDetails = ({ saveForLaterDataList }) => {
  const savedLeads = saveForLaterDataList || {};

  let parsedQuestions = [];
  if (savedLeads?.questions) {
    try {
      parsedQuestions = JSON.parse(savedLeads?.questions);
    } catch (error) {
      console.error("Error parsing questions:", error);
      parsedQuestions = [];
    }
  }
  return (
    <div className={styles.maincontainer}>
      <div className={styles.viewDetailsBox}>
        {/* Left: Q&A Section */}
        <div className={styles.leftColumn}>
          {savedLeads?.questions ? (
            <div className={styles.questionBlock}>
              {parsedQuestions.map((qa, idx) => (
                <div key={idx} className={styles.questionItem}>
                  <p className={styles.question}>
                    <img src={DotIcon} alt="" />
                    {qa.ques}
                  </p>
                  <div className={styles.sperator} />
                  <p className={styles.answer}>{qa.ans}</p>
                  {/* <hr /> */}
                </div>
              ))}
            </div>
          ) : (
            <p>No saved leads available.</p>
          )}
        </div>

        {/* Right: Map and Highlights */}
        <div className={styles.rightColumn}>
          <div className={styles.highlights}>
            <p className={styles.highlightsTitle}>Highlights:</p>

            <div className={styles.badges}>
              {savedLeads?.is_phone_verified == 1 && (
                <span className={styles.verified}>
                  <img src={VerifiedPhoneIcon} alt="" />
                  Verified Phone
                </span>
              )}
              {savedLeads?.has_additional_details == 1 && (
                <span className={styles.additional}>
                  {" "}
                  <img src={AdditionalDetailsIcon} alt="" />
                  Additional details
                </span>
              )}
              {savedLeads?.is_frequent_user == 1 && (
                <span className={styles.frequent}>
                  {" "}
                  <img src={FrequentUserIcon} alt="" />
                  Frequent user
                </span>
              )}
              {savedLeads?.is_urgent == 1 && (
                <span className={styles.frequent}>
                  {" "}
                  <img src={FrequentUserIcon} alt="" />
                  Urgent
                </span>
              )}
              {savedLeads?.is_high_hiring == 1 && (
                <span className={styles.frequent}>
                  {" "}
                  <img src={FrequentUserIcon} alt="" />
                  High hiring
                </span>
              )}
            </div>
          </div>
          <div className={styles.mapContainer}>
            <LeadMap getPendingLeadList={savedLeads?.postcode} />
          </div>
          <div className={styles.leadFooter}>
            <p className={styles.leadFooterTitle}>
              Not seeing the right leads?
            </p>
            <p className={styles.leadFooterText}>
              Stop seeing leads with specific answers by customising your
              settings.
            </p>
            <div className={styles.updateContainer}>
              <img src={UpdateIcon} alt="" />
              <a
                href="/settings/leads/my-services"
                className={styles.updateLink}
              >
                {" "}
                Update lead settings
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavedViewDetails;
