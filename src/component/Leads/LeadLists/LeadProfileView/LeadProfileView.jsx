import React, { useEffect } from "react";
import styles from "./LeadProfileView.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getLeadProfileRequestList } from "../../../../store/LeadSetting/leadSettingSlice";
import DummyImage from "../../../../assets/Images/DummyImage.svg";
import { BASE_IMAGE_URL } from "../../../../utils";
import { Spin } from "antd";

function LeadProfileData() {
  const dispatch = useDispatch();
  const { profileId } = useParams();
  const { profileLeadViewData, autobidLoader } = useSelector(
    (state) => state.leadSetting
  );
  const { userToken } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const id = queryParams.get("id");

  const handleBack = () => {
    navigate("/leads");
  };

  useEffect(() => {
    const data = {
      customer_id: profileId,
      lead_id: id,
    };
    dispatch(getLeadProfileRequestList(data));
  }, []);

  // Masking function for phone
  const maskPhone = (phone) => {
    if (!phone) return "N/A";
    return `${phone.substring(0, 5)}${"*".repeat(phone.length - 5)}`;
  };

  // Masking function for email
  const maskEmail = (email) => {
    if (!email) return "N/A";
    const [name, domain] = email.split("@");
    return `${name.substring(0, 2)}${"*".repeat(
      Math.max(0, name.length - 2)
    )}@${domain}`;
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.headerWrapper}>
          <button className={styles.backBtn} onClick={handleBack}>
            Back
          </button>
          <div className={styles.headingTabsWrapper}>
            <h1 className={styles.heading}></h1>
          </div>
        </div>

        {autobidLoader ? (
          <Spin
            style={{ color: "blue", display: "flex", justifyContent: "center" }}
          />
        ) : (
          <>
            <div className={styles.card} key={profileLeadViewData?.id}>
              <div className={styles.cardLeft}>
                <div className={styles.imageWrapper}>
                  <img
                    src={
                      profileLeadViewData?.profile_image
                        ? `${BASE_IMAGE_URL}${profileLeadViewData?.profile_image}`
                        : DummyImage
                    }
                    alt="Profile"
                    className={styles.image}
                  />
                </div>
                <div className={styles.details}>
                  <div className={styles.header}>
                    <div>
                      <h3>{profileLeadViewData?.leads?.category?.name}</h3>
                      <p>{maskEmail(profileLeadViewData?.email)}</p>
                      <p>{maskPhone(profileLeadViewData?.phone)}</p>
                    </div>
                    <div className={styles.sidebar}>
                      <div className={styles.credits}>
                        {profileLeadViewData?.leads?.credit_score} Credits
                      </div>
                    </div>
                  </div>

                  <div className={styles.badges}></div>

                  {profileLeadViewData &&
                  profileLeadViewData.leads &&
                  profileLeadViewData.leads.questions ? (
                    <div className="space-y-4">
                      {(() => {
                        try {
                          const questionsData = JSON.parse(
                            profileLeadViewData?.leads?.questions
                          );
                          return questionsData?.map((item, index) => (
                            <div key={index} className="mb-4">
                              <p className={styles.viewQuestion}>
                                {item?.ques}
                              </p>
                              <p className={styles.viewQuestion}>{item?.ans}</p>
                            </div>
                          ));
                        } catch (error) {
                          console.error("Error parsing questions data:", error);
                          return <div>Error displaying questions</div>;
                        }
                      })()}
                    </div>
                  ) : (
                    <div>No questions data available</div>
                  )}

                  <div className={styles.quickToRespondWrapper}>
                    <a href="#" className={styles.profileLink}></a>
                    <div className={styles.quickToRespond}>Contact</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default LeadProfileData;
