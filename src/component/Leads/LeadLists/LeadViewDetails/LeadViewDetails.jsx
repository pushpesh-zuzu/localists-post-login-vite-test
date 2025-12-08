import styles from "./LeadViewDetails.module.css";
import VerifiedPhoneIcon from "../../../../assets/Images/Leads/VerifiedPhoneIcon.svg";
import AdditionalDetailsIcon from "../../../../assets/Images/Leads/AdditionalDetailsIcon.svg";
import FrequentUserIcon from "../../../../assets/Images/Leads/FrequentUserIcon.svg";
import DotIcon from "../../../../assets/Images/Leads/DotIcon.svg";
import UpdateIcon from "../../../../assets/Images/Leads/UpdateIcon.svg";
import LeadMap from "../../../myResponses/LeadMap/LeadMap";

const LeadViewDetails = ({ leadRequestDatas }) => {
  const leadRequest = leadRequestDatas || {};

  return (
    <div className={styles.maincontainer}>
      <div className={styles.viewDetailsBox}>
        <div className={styles.leftColumn}>
          {leadRequest && leadRequest.questions ? (
            <div className={styles.questionBlock}>
              {JSON.parse(leadRequest.questions).map((qa, idx) => (
                <div key={idx} className={styles.questionItem}>
                  <p className={styles.question}>
                    <img src={DotIcon} alt="" />
                    {qa.ques}
                  </p>
                  <div className={styles.sperator} />
                  <p className={styles.answer}>{qa.ans}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No saved leads available.</p>
          )}
        </div>
        <div className={styles.rightColumn}>
          <div className={styles.highlights}>
            <p className={styles.highlightsTitle}>Highlights:</p>

            <div className={styles.badges}>
              {leadRequest?.is_phone_verified == 1 && (
                <span className={styles.verified}>
                  <img src={VerifiedPhoneIcon} alt="" />
                  Verified Phone
                </span>
              )}
              {leadRequest?.has_additional_details == 1 && (
                <span className={styles.additional}>
                  {" "}
                  <img src={AdditionalDetailsIcon} alt="" />
                  Additional details
                </span>
              )}
              {leadRequest?.is_frequent_user == 1 && (
                <span className={styles.frequent}>
                  {" "}
                  <img src={FrequentUserIcon} alt="" />
                  Frequent user
                </span>
              )}
              {leadRequest?.is_urgent == 1 && (
                <span className={styles.frequent}>
                  {" "}
                  <img src={FrequentUserIcon} alt="" />
                  Urgent
                </span>
              )}
              {leadRequest?.is_high_hiring == 1 && (
                <span className={styles.frequent}>
                  {" "}
                  <img src={FrequentUserIcon} alt="" />
                  High hiring
                </span>
              )}
            </div>
          </div>
          <div className={styles.mapContainer}>
            <LeadMap getPendingLeadList={leadRequest?.postcode} />
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

export default LeadViewDetails;
