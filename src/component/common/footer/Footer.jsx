import { useEffect, useState } from "react";
import styles from "./footer.module.css";
import logodesktop from "../../../assets/Images/logodesktop.svg";
import logomobile from "../../../assets/Images/logomobile.svg";

  import mailIcon from "../../../assets/Icons/emailIcon.svg";
import { Collapse, Select } from "antd";
const { Panel } = Collapse;
import { CaretRightOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { showToast } from "../../../utils";
import { useUserGeo } from "../../../utils/geo";
import XIcon from "../../../ReactIcon/XIcon";
import FacebookIcon from "../../../ReactIcon/FacebookIcon";
import InstagramIcon from "../../../ReactIcon/InstagramIcon";
import LinkedInIcon from "../../../ReactIcon/LinkedInIcon";
import CountryDropdowns from "./CountryDropdowns";

const { Option } = Select;

const FooterContent = () => (
  <>
    <div className={styles.footerRight}>
      <div className={styles.socialIcons}>
        <Link
          to={"https://www.facebook.com/localistsuk/"}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FacebookIcon
                    className="w-[35px] h-[35px]"
                  />
        </Link>
        <Link
          to={"https://www.linkedin.com/company/localistsuk/"}
          target="_blank"
          rel="noopener noreferrer"
        >
          <LinkedInIcon
                    className="w-[35px] h-[35px]"
                  />
        </Link>
        <Link
          to={"https://x.com/LocalistsUK"}
          target="_blank"
          rel="noopener noreferrer"
        >
          <XIcon className="w-[35px] h-[35px]" />
        </Link>
        <Link
          to={"https://www.instagram.com/localists_official/"}
          target="_blank"
          rel="noopener noreferrer"
        >
          <InstagramIcon
                   
                    className="w-[35px] h-[35px]"
                  />
        </Link>
      </div>
      {/* <div className={styles.countryDropdown}>
        <Select
          defaultValue="🇬🇧 UK"
          style={{ width: 160 }}
          className={styles.selectDropdown}
          suffixIcon={null}
          open={false}
        >
          <Option value="🇬🇧 UK">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ height: "28px", width: "16px" }}>United Kingdom</span>
              <img
                src={UKFlag}
                alt="UK Flag"
                width={16}
                height={24}
                style={{
                  height: "16px",
                  width: "24px",
                  marginTop: "auto",
                  marginBottom: "auto",
                }}
              />
            </div>
          </Option>
        </Select>
      </div> */}
      <div className={styles.selectmain}><CountryDropdowns/></div>
      {/* <div className={styles.trustpilot}>
        <img src={trustpilotLogo} alt="Trustpilot Rating" />
      </div> */}
    </div>

    <div className={styles.footerContactSection}>
      <div className={styles.contactMthods}>
        <img src={mailIcon} alt="email" />
        <p>contact@localists.com</p>
      </div>
      {/* <div className={styles.contactMthods}>
        <img src={callIcon} alt="phone" />
        <p>+91 0000000000</p>
      </div> */}
      {/* <div className={styles.contactMthods}>
        <img src={timerIcon} alt="working hours" />
        <p>(Mon-Fri, 9:00am-6:00pm)</p>
        
      </div> */}
    </div>
  </>
);

const Footer = ({floatingMargin=false}) => {
  const { country, lang } = useUserGeo();
  const [activeKeys, setActiveKeys] = useState("");
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" && window.innerWidth < 520
  );
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 520);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onChange = (key) => {
    setActiveKeys(key);
  };
  const { userToken } = useSelector((state) => state.auth);

  const { registerToken } = useSelector((state) => state.findJobs);

  const baseURL = import.meta.env.VITE_COOKIE_DOMAIN;

  const handleJoinAsProfessional = () => {
    if (userToken || registerToken) {
      showToast(
        "info",
        "You're already logged in. Please switch to seller and add your service."
      );
    }
  };
  const handleHelpCenter = () => {
    navigate("/help-center");
  };

  return (
    <footer className={`${styles.footer} ${floatingMargin ? styles.flotingMargin:''}`}>
      <div className={styles.footerContainer}>
        <div className={styles.footerLeft}>
          {/* <Link target="_blank"  to={`/${lang}/${country}`} className={styles.link}> */}
          <div className={styles.logo}>
            <img
              src={
                typeof window !== "undefined" && window.innerWidth > 640
                  ? logodesktop
                  : logomobile
              }
              alt="Localist Logo"
              loading="eager"
            />
          </div>
          {/* </Link> */}
          <p className={styles.footerDesc}>
            Localists is the world’s fastest-growing marketplace, and we have no
            intention of slowing down any time soon.
          </p>

          <div className={styles.contactSection}>
            <span>Need Help?</span>
            <Link target="_blank"  to={`${baseURL}${lang}/${country}/contact-us`} className={styles.link}>
              <button>Contact Us</button>
            </Link>
          </div>
        </div>

        {/* Desktop Links */}
        <div className={styles.footerLinks}>
          <div>
            <h4>For Customers</h4>
            <ul>
              <Link target="_blank"  to={`${baseURL}${lang}/${country}/`} className={styles.link}>
                <li>Find a Professional</li>
              </Link>

              <Link target="_blank" 
                className={styles.link}
                to={`${baseURL}${lang}/${country}/how-it-works-for-customers`}
              >
                <li
                  onClick={() => {
                    window.scrollTo(0, 0);
                  }}
                >
                  How it works
                </li>
              </Link>

              <Link target="_blank" 
                to={`${baseURL}${lang}/${country}/login`}
                className={styles.link}
                onClick={(e) => {
                  if (userToken || registerToken) {
                    e.preventDefault();
                    showToast("info", "You're already logged in.");
                  } else {
                    window.scrollTo(0, 0);
                  }
                }}
              >
                <li>Login</li>
              </Link>
            </ul>
          </div>

          <div>
            <h4>For Professionals</h4>
            <ul>
              <Link target="_blank" 
              
                to={`${baseURL}${lang}/${country}/how-it-works-for-sellers`}
                className={styles.link}
              >
                <li>How it works</li>
              </Link>
              <Link target="_blank" 
                className={`${styles.link} ${styles.mobileItem}`}
                to={`${baseURL}${lang}/${country}/sellers/pricing`}
              >
                <li>Pricing</li>
              </Link>
              <Link target="_blank" 
                to={`${baseURL}${lang}/${country}/sellers/create`}
                className={styles.link}
                onClick={(e) => {
                  if (userToken || registerToken) {
                    e.preventDefault();
                    showToast(
                      "info",
                      "You're already logged in. Please switch to seller and add your service."
                    );
                  } else {
                    window.scrollTo(0, 0);
                  }
                }}
              >
                <li>Join as a Professional</li>
              </Link>
              {/* {userToken && (userToken?.user_type === 1 || userToken?.user_type === 3) && (
                <Link target="_blank"  to="/sellers/leads" className={styles.link}>
                  <li > New Leads</li>
                </Link>
              )}
              {userToken && (userToken?.user_type === 1 || userToken?.user_type === 3) && (
                <Link target="_blank"  to="/sellers/leads/save-for-later" className={styles.link}>
                  <li > Saved Leads</li>
                </Link>
              )}
              {userToken && (userToken?.user_type === 1 || userToken?.user_type === 3) && (
                <Link target="_blank"  to="/sellers/leads/my-responses" className={styles.link}>
                  <li >  My Responses</li>
                </Link>
              )}
              {userToken && (userToken?.user_type === 1 || userToken?.user_type === 3) && (
                <Link target="_blank"  to="/settings" className={styles.link}>
                  <li >  Settings</li>
                </Link>
              )}
              {userToken && (userToken?.user_type === 1 || userToken?.user_type === 3) && (
                <Link target="_blank"  to="/help-center" className={styles.link}>
                  <li >  Help</li>
                </Link>
              )} */}
              {/* <Link target="_blank"  to="/help-center" className={styles.link}>
                <li onClick={handleHelpCenter}>Help Centre</li>
              </Link> */}
            </ul>
          </div>

          <div>
            <h4>About</h4>
            <ul>
              <Link target="_blank"  className={styles.link} to={`${baseURL}${lang}/${country}/about-us`}>
                <li>About Localists</li>
              </Link>
            </ul>
            <ul>
              <Link target="_blank"  className={styles.link} to={`${baseURL}${lang}/${country}/blog`}>
                <li>Blog</li>
              </Link>
            </ul>
          </div>
        </div>

        {/* Mobile Links (NO styles.link here) */}
        <Collapse
          defaultActiveKey={activeKeys}
          accordion
          expandIcon={({ isActive }) => (
            <CaretRightOutlined
              style={{ color: "#00AFE3", fontSize: "24px" }}
              rotate={isActive ? -90 : 90}
            />
          )}
          bordered={false}
          onChange={onChange}
          expandIconPosition="end"
          className={styles.footerLinkMobile}
        >
          <Panel
            className={styles.footerNavLinks}
            header="For Customers"
            key="1"
          >
            <ul>
              <Link target="_blank"  to={`${baseURL}${lang}/${country}/`}>
                <li className={styles.mobileItem}>Find a Professional</li>
              </Link>
              <Link target="_blank"  to={`${baseURL}${lang}/${country}/how-it-works-for-customers`}>
                <li className={styles.mobileItem}>How it works</li>
              </Link>
              <Link target="_blank" 
                to={
                  (!userToken || !registerToken) && `${baseURL}${lang}/${country}/login`
                }
              >
                <li
                  className={styles.mobileItem}
                  onClick={() => {
                    if (userToken || registerToken) {
                      showToast("info", "You're already logged in.");
                    } else {
                      navigate(`${baseURL}${lang}/${country}/login`);
                      window.scrollTo(0, 0);
                    }
                  }}
                >
                  Login
                </li>
              </Link>
            </ul>
          </Panel>

          <Panel
            className={styles.footerNavLinks}
            header="For Professionals"
            key="2"
          >
            <ul>
              <Link target="_blank"  to={`${baseURL}${lang}/${country}/how-it-works-for-sellers`}>
                <li className={styles.mobileItem}>How it works</li>
              </Link>
              <Link target="_blank"  to={`${baseURL}${lang}/${country}/sellers/pricing`}>
                <li className={styles.mobileItem}>Pricing</li>
              </Link>

              <li
                className={styles.mobileItem}
                onClick={() => {
                  if (!userToken && !registerToken) {
                    // Not logged in → Navigate
                    navigate(`${baseURL}${lang}/${country}/sellers/create`);
                    window.scrollTo(0, 0);
                  } else {
                    handleJoinAsProfessional();
                  }
                }}
              >
                Join as a Professional
              </li>
            </ul>
          </Panel>
          {/* <Link target="_blank" 
            className={styles.footerNavLinks}
            style={{ color: "#000" }}
            to={`${baseURL}${lang}/${country}/about-us`}
          > */}
            <Panel
              className={styles.footerNavLinks}
              header="About"
              key="3"
            >
             <ul>
              <Link target="_blank"to={`${baseURL}${lang}/${country}/about-us`}>
                <li className={styles.mobileItem}>About Localists</li>
              </Link>
               <Link target="_blank"to={`${baseURL}${lang}/${country}/blog`}>
                <li className={styles.mobileItem}>Blog</li>
              </Link>
              </ul>
            </Panel>
          {/* </Link> */}
        </Collapse>

        {isMobile ? (
          <span className={styles.contactCountyWrapper}>
            <FooterContent />
          </span>
        ) : (
          <FooterContent />
        )}
      </div>

      <div className={styles.footerBottom}>
        <p>
          © 2026 Localists.{" "}
          <Link target="_blank" 
            style={{ textDecoration: "none", color: "#000" }}
            to={`${baseURL}${lang}/${country}/terms`}
          >
            Terms & Conditions{" "}
          </Link>
          /{" "}
          <Link target="_blank" 
            style={{ textDecoration: "none", color: "#000" }}
            to={`${baseURL}${lang}/${country}/cookie-policy`}
          >
            Cookie policy {" "}
          </Link>
          /
          <Link target="_blank" 
            style={{ textDecoration: "none", color: "#000" }}
            to={`${baseURL}${lang}/${country}/privacy-policy`}
          >
           {" "} Privacy policy
          </Link>
        </p>

        {/* <div className={styles.trustpilotMobile}>
          <img src={trustpilotLogo} alt="Trustpilot Rating" />
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;
