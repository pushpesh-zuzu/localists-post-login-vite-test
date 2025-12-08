import { useEffect, useState } from "react";
import styles from "./ManualBidsList.module.css";
import GreenTickIcon from "../../../../../assets/Images/GreenTickIcon.svg";
import AutoBidLocationIcon from "../../../../../assets/Images/AutoBidLocationIcon.svg";
import QuickToRespond from "../../../../../assets/Images/QuickToRespond.svg";
import starImg from "../../../../../assets/Icons/MyResponse/StarImg.svg";
import { getAutoBidData } from "../../../../../store/LeadSetting/leadSettingSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Spin } from "antd";
import { BASE_IMAGE } from "../../../../../utils";
import ContactSuccessModal from "../../../../Leads/LeadLists/ContactSuccessModal";
import { Helmet } from "react-helmet-async";
import { Tabs } from "antd";
import moment from "moment";

const ManualBidList = () => {
  const dispatch = useDispatch();
  const { requestId } = useParams();
  const { TabPane } = Tabs;
  const { autoBidListData, autobidLoader } = useSelector(
    (state) => state.leadSetting
  );
  const { userToken } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [isopen, setIsOpen] = useState(false);

  const [isMobile, setIsMobile] = useState(false);

  const [activeTab, setActiveTab] = useState("replies");

  const [autobidDatas, setAutoBidDatas] = useState("");
  const webData = autoBidListData?.map((item) => item?.service_name) || [];

  const handleBack = () => {
    navigate(`/bids-list/${requestId}`);
  };

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth <= 480);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const data = {
      user_id: userToken?.remember_tokens,
      lead_id: requestId,
    };
    dispatch(getAutoBidData(data));
  }, []);

  const handleMatches = () => {
    navigate(`/bids-list/${requestId}`);
    setActiveTab("matches");
  };

  const handleConatct = (item) => {
    setAutoBidDatas(item);
    setIsOpen(true);
  };
  return (
    <>
      <Helmet>
        <title>Localists.com - Reply to Your Top 5 Professional Matches</title>
        <meta
          name="description"
          content="Your top 5 local professional matches are ready. Reply instantly, request more info, and connect with trusted experts on Localists today."
        />
      </Helmet>
      <div className={styles.container}>
        <div className={styles.headerWrapper}>
          <div className={styles.headingTabsWrapper}>
            <h1 className={styles.heading}>{webData[0] || "Your Service"}</h1>

            {isMobile ? (
              <div className={styles.mobileMiddleText}>
                Your Top 5 local professional matches are below. Request replies
                from your top matches to hear back faster
              </div>
            ) : (
              <div className={styles.middleText}>
                Your Top 5 local professional matches are below. You can contact
                any of the <br className={styles.lineBreak} /> professionals to
                get more information using the contact button.
              </div>
            )}
          </div>
        </div>
        <>
          {isMobile ? (
            <Tabs
              activeKey={activeTab}
              onChange={(key) => {
                setActiveTab(key);
                if (key === "matches") {
                  handleMatches();
                }
              }}
              centered
              tabBarGutter={24}
              className={styles.mobileTabs}
            >
              <TabPane tab="Your Matches" key="matches"></TabPane>
              <TabPane tab="Replies" key="replies"></TabPane>
            </Tabs>
          ) : (
            <div className={styles.tabs}>
              <button
                className={
                  activeTab === "matches" ? styles.activeTab : styles.tab
                }
                onClick={handleMatches}
              >
                Your Matches
              </button>
              <button
                className={
                  activeTab === "replies" ? styles.activeTab : styles.tab
                }
              >
                Replies
              </button>
            </div>
          )}
        </>
        {autobidLoader ? (
          <Spin
            style={{ color: "blue", display: "flex", justifyContent: "center" }}
          />
        ) : (
          <>
            {autoBidListData?.map((item) => (
              <div className={styles.card} key={item.id}>
                <div className={styles.cardLeft}>
                  <div className={styles.imageWrapper}>
                    {item?.company_logo ? (
                      <img
                        src={`${BASE_IMAGE}/users/${item.company_logo}`}
                        alt="Profile"
                        className={styles.image}
                        style={{
                          width: "180px",
                          height: "180px",
                          objectFit: "cover",
                          borderRadius: "50%",
                        }}
                      />
                    ) : (
                      <span
                        style={{
                          width: "180px",
                          height: "180px",
                          borderRadius: "50%",
                          backgroundColor: "#ccc",
                          color: "#000",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          fontSize: "48px",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          overflow: "hidden",
                        }}
                        className={styles.firstLetterSpan}
                      >
                        {item?.business_profile_name?.[0]?.toUpperCase() || ""}
                      </span>
                    )}
                  </div>

                  <div className={styles.details}>
                    <div className={styles.header}>
                      <div>
                        <h3>
                          <img src={GreenTickIcon} alt="" />
                          {item?.business_profile_name}
                        </h3>
                        <p>
                          <img src={AutoBidLocationIcon} alt="" />
                          {item.distance} miles away
                        </p>
                      </div>
                      <div className={styles.sidebar}>
                        <div className={styles.rating}>
                          {(() => {
                            const rating = item?.avg_rating || 0;

                            return (
                              <>
                                <span className={styles.stars}>
                                  {[...Array(5)].map((_, index) => {
                                    if (rating >= index + 1) {
                                      return (
                                        <span key={index}>
                                          <img
                                            src={starImg}
                                            alt="..."
                                            width={23}
                                            height={23}
                                          />
                                        </span>
                                      ); // Full star
                                    } else if (rating >= index + 0.5) {
                                      return <span key={index}>★</span>;
                                    } else {
                                      return (
                                        <span
                                          key={index}
                                          className={styles.grayImg}
                                        >
                                          ★
                                        </span>
                                      ); // Empty star
                                    }
                                  })}
                                </span>
                                {rating > 0 && (
                                  <span className={styles.ratingCount}>
                                    {rating}
                                  </span>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    </div>

                    <div className={styles.badges}>
                      <span>{item.service_name}</span>
                    </div>

                    <div className={styles.mobileImageWrapper}>
                      <div className={styles.imageWrapper}>
                        {item?.company_logo ? (
                          <img
                            alt="Profile"
                            style={{
                              width: "100px",
                              height: "100px",
                              objectFit: "cover",
                              borderRadius: "50%",
                            }}
                          />
                        ) : (
                          <span
                            style={{
                              width: "100px",
                              height: "100px",
                              borderRadius: "50%",
                              backgroundColor: "#ccc",
                              color: "#000",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              fontSize: "36px",
                              fontWeight: "500",
                              textTransform: "uppercase",
                              overflow: "hidden",
                              verticalAlign: "center",
                            }}
                          >
                            {item?.business_profile_name?.[0]?.toUpperCase() ||
                              ""}
                          </span>
                        )}
                      </div>
                      <div className={styles.mobileHeader}>
                        <h3>
                          <img src={GreenTickIcon} alt="" />
                          {item.name}
                        </h3>
                        <p>
                          <img src={AutoBidLocationIcon} alt="" />
                          {item?.distance ? item?.distance : "0"} miles away
                        </p>
                      </div>
                    </div>
                    <div className={styles.mobileBadge}>
                      <div className={styles.sidebar}>
                        <div className={styles.badge}>
                          <span>{item.service_name}</span>
                        </div>
                        <div>
                          <div className={styles.ratings}>
                            {(() => {
                              const rating = item?.avg_rating || 0;

                              return (
                                <>
                                  <span className={styles.stars}>
                                    {[...Array(5)].map((_, index) => {
                                      if (rating >= index + 1) {
                                        return (
                                          <span key={index}>
                                            <img src={starImg} alt="..." />
                                          </span>
                                        );
                                      } else if (rating >= index + 0.5) {
                                        return <span key={index}>★</span>;
                                      } else {
                                        return (
                                          <span
                                            key={index}
                                            className={styles.grayImg}
                                          >
                                            ★
                                          </span>
                                        );
                                      }
                                    })}
                                  </span>
                                  {rating > 0 && (
                                    <span className={styles.ratingCount}>
                                      {rating}
                                    </span>
                                  )}
                                </>
                              );
                            })()}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={styles.messageRow}>
                      <div className={styles.description}>
                        <div className={styles.messageText}>
                          <div className={styles.meName}></div>
                          <div className={styles.meName}>
                            {item?.activty_log?.log}
                          </div>
                        </div>
                        <div className={styles.timestamp}>
                          {item?.activty_log?.date_time
                            ? moment(
                                item.activty_log.date_time,
                                "DD MMM YYYY, hh:mm"
                              ).format("DD MMM YYYY, HH:mm")
                            : ""}
                        </div>
                      </div>
                    </div>

                    <div className={styles.quickToRespondWrapper}>
                      <a
                        href={`/view-profile/${requestId}/${item.id}?from=replies`}
                        className={styles.profileLink}
                      >
                        View Profile →
                      </a>

                      {item?.quicktorespond == 1 && (
                        <div className={styles.quickToRespond}>
                          <img src={QuickToRespond} alt="" />
                          Quick to respond
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={styles.replyBtnWrapper}>
                    <button
                      className={styles.replyBtn}
                      onClick={() => handleConatct(item)}
                    >
                      Contact the Professional Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
        {isopen && (
          <ContactSuccessModal
            onClose={() => setIsOpen(false)}
            isOpen={isopen}
            repliesBtn={autobidDatas}
            requestId={"contact"}
          />
        )}
      </div>
    </>
  );
};

export default ManualBidList;
