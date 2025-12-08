import styles from "./dashboard.module.css";
import DashboardCards from "./2ndPart";
import polygon from "../../assets/Icons/Polygon.png";
import PolygonArrowDown from "../../assets/Icons/PolygonArrowDown.png";
import playbtn from "../../assets/Icons/playbtn.png";
import question from "../../assets/Icons/question.svg";
import emailIcon1 from "../../assets/Icons/emailIcon1.svg";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { getDashboardListData } from "../../store/Dashboard/dashboardSlice";
import { Link } from "react-router-dom";
import { useUserGeo } from "../../utils/geo";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { dashboardData } = useSelector((state) => state.dashboard);
  const [showDashboardContent, setShowDashboardContent] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const contentRef = useRef(null);
  const userName = dashboardData?.profile_info?.name;
  const { country, lang } = useUserGeo();

  useEffect(() => {
    dispatch(getDashboardListData());
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);
  const formatTime = (date) => {
    return date.toLocaleString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
      hour12: false,
      timeZone: "Europe/London", // ✅ UK timezone
    });
  };
  return (
    <div>
      <div className={styles["dashboard-wrapper"]}>
        <header className={styles["dashboard-header"]}>
          <div className={styles.greeting}> Hello, {userName}!</div>
          <div className={styles.date}>{formatTime(currentTime)}</div>
        </header>

        <div
          className={styles.hiddenDiv}
          style={{ visibility: "hidden", backgroundColor: "#F9F9F9" }}
        >
          hhh
        </div>

        <div className={styles["dashboard-content-parent"]}>
          <div
            className={styles["dashboard-content"]}
            ref={contentRef}
            style={{
              maxHeight: showDashboardContent
                ? `${contentRef.current?.scrollHeight}px`
                : "0px",
              overflow: "hidden",
              transition: "max-height 0.5s ease",
              padding: "0px",
              margin: "0px",
            }}
          >
            <footer className={styles["dashboard-footer"]}>
              No commissions, no hidden fees—just a straight forward process.
            </footer>

            <div
              className={styles.hideIcon}
              onClick={() => setShowDashboardContent(!showDashboardContent)}
            >
              <span>{showDashboardContent ? "Hide" : "Show"}</span>
              <img
                style={{ cursor: "pointer" }}
                src={PolygonArrowDown}
                className={showDashboardContent ? "" : styles.rotate}
              />
            </div>
            {/* <div className={styles.arrowMain}>
              <span>
                <img
                  style={{ cursor: "pointer" }}
                  src={polygon}
                  onClick={() => setShowDashboardContent(!showDashboardContent)}
                  className={showDashboardContent ? "" : styles.rotate}
                />
              </span>
            </div> */}

            <div className={styles["main-section"]}>
              <div className={styles["left-column"]}>
                <h3 className={styles["section-title"]}>
                  Welcome to Localists.com
                </h3>
                <h5 className={styles["section-sub-title"]}>
                  We’re here to help you grow your business and connect with
                  more local customers.
                </h5>
                <ul className={styles["steps-list"]}>
                  <li className={styles["setpPara"]}>
                    <strong>1</strong>
                    <p>
                      {" "}
                      <b>Customers tell us what they need</b>{" "}
                      <p>
                        Local customers share the services they're looking for
                        by answering key questions relating to the service.
                      </p>
                    </p>
                  </li>
                  {/* <hr className={styles.breaker} /> */}
                  <li className={styles["setpPara"]}>
                    <strong>2</strong>{" "}
                    <p>
                      <b>Localists.com finds the right leads for you</b>
                      <p>
                        We match your business with leads that fit your services
                        and location, delivered instantly to your inbox and
                        dashboard.
                      </p>{" "}
                    </p>
                  </li>
                  {/* <hr className={styles.breaker} /> */}
                  <li className={styles["setpPara"]}>
                    <strong>3</strong>{" "}
                    <p>
                      <b>You review and select your leads</b>{" "}
                      <p>
                        {" "}
                        See full customer details straight away and choose the
                        opportunities that work best for your business.
                      </p>{" "}
                    </p>
                  </li>
                  {/* <hr className={styles.breaker} /> */}
                  <li className={styles["setpPara"]}>
                    <strong>4</strong>{" "}
                    <p>
                      <b>You connect with the customer directly</b>{" "}
                      <p>
                        Reach out by phone or email to introduce your services
                        and secure new business.
                      </p>{" "}
                    </p>
                  </li>
                  {/* <hr className={styles.breaker} /> */}
                  <li className={styles["setpPara"]}>
                    <strong>5</strong>{" "}
                    <p>
                      <b>You win new work — no hassle,</b>
                      <p>
                        No hidden fees No hidden costs or long term commitment.
                        There are no commissions or extra costs — just a clear,
                        simple way to grow your business through Localists.com.
                      </p>{" "}
                    </p>
                  </li>
                  {/* <hr className={styles.breaker} /> */}
                </ul>
              </div>

              <div className={styles["right-column"]}>
                <div className={styles["video-box"]}>
                  <div className={styles["play-button"]}>
                    <img src={playbtn} />
                  </div>
                </div>

                <a className={styles["view-leads-blue"]} href="#">
                  View 76 Live Leads Now - Start winning jobs now*
                </a>
                <Link
                  to="/sellers/leads"
                  className={styles["view-leads-black"]}
                >
                  View live leads
                </Link>

                <div className={styles["info-box"]}>
                  <h4>
                    How much do{" "}
                    <span className={styles.textColor}> Localists.com </span>
                    charge for leads?
                  </h4>
                  <p>
                    Getting leads on{" "}
                    <span className={styles.textColor}>Localists.com </span>
                    is completely free — you only pay when you choose to contact
                    a customer you're interested in. All our leads are priced in
                    credits, depending on the sector, location and the specific
                    requirements of the job.
                  </p>
                  <p>
                    We offer all new local professionals a special offer that
                    boosts your credit purchase by 20%. Our Credit Boost Pack
                    gives you more opportunities to contact leads and win more
                    jobs.
                  </p>
                </div>

                <div className={styles["help-box"]}>
                  <h4>
                    <img src={question} /> Need Assistance?
                  </h4>
                  <p>
                    We’re here to help you get the most out of Localists.com.
                    Explore plenty of tips, guides, and resources in our{" "}
                    <a
                      href={`/${lang}/${country}/contact-us`}
                      className={styles.textColor}
                    >
                      Help Center
                    </a>{" "}
                    .
                  </p>
                  <p>
                    Our dedicated customer success team is also available 24/7
                    to support you whenever you need assistance.
                  </p>

                  <div className={styles["contact-info"]}>
                    <div>
                      <span>
                        <img src={emailIcon1} /> &nbsp; contact@localists.com{" "}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <footer className={styles["dashboard-footer"]}>
            No commissions, no hidden fees—just a straight forward process.
          </footer>

          <div
            className={styles.hideIcon}
            onClick={() => setShowDashboardContent(!showDashboardContent)}
          >
            <span>{showDashboardContent ? "Hide" : "Show"}</span>
            <img
              style={{ cursor: "pointer" }}
              src={PolygonArrowDown}
              className={showDashboardContent ? "" : styles.rotate}
            />
          </div>
        </div>
      </div>

      <DashboardCards data={dashboardData} />
    </div>
  );
};
export default Dashboard;
