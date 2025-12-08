// FULL MERGED FOOTER FILE WITH handleFooterLinksNavigate

import { useEffect, useState } from "react";
import styles from "./footer.module.css";
import logo from "../../../assets/Images/logo.png";
import facebookIcon from "../../../assets/Icons/facebook.svg";
import linkedinsocialicon from "../../../assets/Icons/linkedinsocialicon.png";
import Xsocialicon from "../../../assets/Icons/Xsocialicon.png";
import UKFlag from "../../../assets/Icons/UKFlag.png";
import instagramIcon from "../../../assets/Icons/instagram.svg";
import mailIcon from "../../../assets/Icons/emailIcon.svg";
import { Collapse, Select } from "antd";
const { Panel } = Collapse;
import { CaretRightOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { showToast } from "../../../utils";
import { useUserGeo } from "../../../utils/geo";

const { Option } = Select;

const FooterContent = () => (
  <>
    <div className={styles.footerRight}>
      <div className={styles.socialIcons}>
        <a href="https://www.facebook.com/localistsuk/" target="_blank" rel="noopener noreferrer">
          <img src={facebookIcon} alt="Facebook" />
        </a>
        <a href="https://www.linkedin.com/company/localistsuk/" target="_blank" rel="noopener noreferrer">
          <img src={linkedinsocialicon} alt="linkedinsocialicon" />
        </a>
        <a href="https://x.com/LocalistsUK" target="_blank" rel="noopener noreferrer">
          <img src={Xsocialicon} alt="Xsocialicon" />
        </a>
        <a href="https://www.instagram.com/localists_official" target="_blank" rel="noopener noreferrer">
          <img src={instagramIcon} alt="Instagram" />
        </a>
      </div>

      <div className={styles.countryDropdown}>
        <Select defaultValue="🇬🇧 UK" style={{ width: 160 }} className={styles.selectDropdown} suffixIcon={null} open={false}>
          <Option value="🇬🇧 UK">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>UK</span>
              <img style={{ height: "16px", margin: "auto 0" }} src={UKFlag} alt="UK Flag" />
            </div>
          </Option>
        </Select>
      </div>
    </div>

    <div className={styles.footerContactSection}>
      <div className={styles.contactMthods}>
        <img src={mailIcon} alt="email" />
        <p>contact@localists.com</p>
      </div>
    </div>
  </>
);


const Footer = () => {
  const { country, lang } = useUserGeo();
  const [activeKeys, setActiveKeys] = useState("");
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" && window.innerWidth < 520);

  const { userToken } = useSelector((state) => state.auth);
  const { registerToken } = useSelector((state) => state.findJobs);

  const handleFooterLinksNavigate = (path) => {
    if (typeof window !== "undefined") {
      const baseURL = import.meta.env.VITE_PRELOGIN_URL;
      window.location.href = `${baseURL}en/gb/${path}`;
    }
  };

  const handleJoinAsProfessional = () => {
    if (userToken || registerToken) {
      showToast("info", "You're already logged in. Please switch to seller and add your service.");
    }
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 520);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onChange = (key) => setActiveKeys(key);

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerLeft}>
          <div className={styles.logo}>
            <img src={logo} alt="Localist Logo" />
          </div>

          <p className={styles.footerDesc}>
            Localists is the world’s fastest-growing marketplace, and we have no intention of slowing down.
          </p>

          <div className={styles.contactSection}>
            <span>Need Help?</span>
            <button onClick={() => handleFooterLinksNavigate("contact-us")}>Contact Us</button>
          </div>
        </div>

        {/* ---------------- Desktop Links ---------------- */}
        <div className={styles.footerLinks}>
          <div>
            <h4>For Customers</h4>
            <ul>
              <li onClick={() => handleFooterLinksNavigate("")}>Find a Professional</li>

              <li onClick={() => handleFooterLinksNavigate("how-it-works-for-customers")}>
                How it works
              </li>

              <li
                onClick={() => {
                  if (userToken || registerToken) showToast("info", "You're already logged in.");
                  else handleFooterLinksNavigate("login");
                }}
              >
                Login
              </li>
            </ul>
          </div>

          <div>
            <h4>For Professionals</h4>
            <ul>
              <li onClick={() => handleFooterLinksNavigate("how-it-works-for-sellers")}>How it works</li>

              <li onClick={() => handleFooterLinksNavigate("sellers/pricing")}>Pricing</li>

              <li
                onClick={() => {
                  if (!userToken && !registerToken) handleFooterLinksNavigate("sellers/create");
                  else handleJoinAsProfessional();
                }}
              >
                Join as a Professional
              </li>
            </ul>
          </div>

          <div>
            <h4>About</h4>
            <ul>
              <li onClick={() => handleFooterLinksNavigate("about-us")}>About Localists</li>
            </ul>
          </div>
        </div>

        {/* ---------------- Mobile Links ---------------- */}
        <Collapse
          defaultActiveKey={activeKeys}
          accordion
          expandIcon={({ isActive }) => (
            <CaretRightOutlined style={{ color: "#00AFE3", fontSize: "24px" }} rotate={isActive ? -90 : 90} />
          )}
          bordered={false}
          onChange={onChange}
          expandIconPosition="end"
          className={styles.footerLinkMobile}
        >
          <Panel header="For Customers" key="1" className={styles.footerNavLinks}>
            <ul>
              <li className={styles.mobileItem} onClick={() => handleFooterLinksNavigate("")}>Find a Professional</li>

              <li className={styles.mobileItem} onClick={() => handleFooterLinksNavigate("how-it-works-for-customers")}>
                How it works
              </li>

              <li
                className={styles.mobileItem}
                onClick={() => {
                  if (userToken || registerToken) showToast("info", "You're already logged in.");
                  else handleFooterLinksNavigate("login");
                }}
              >
                Login
              </li>
            </ul>
          </Panel>

          <Panel header="For Professionals" key="2" className={styles.footerNavLinks}>
            <ul>
              <li className={styles.mobileItem} onClick={() => handleFooterLinksNavigate("how-it-works-for-sellers")}>
                How it works
              </li>

              <li className={styles.mobileItem} onClick={() => handleFooterLinksNavigate("sellers/pricing")}>
                Pricing
              </li>

              <li
                className={styles.mobileItem}
                onClick={() => {
                  if (!userToken && !registerToken) handleFooterLinksNavigate("sellers/create");
                  else handleJoinAsProfessional();
                }}
              >
                Join as a Professional
              </li>
            </ul>
          </Panel>

          <Panel header="About Localists" key="3" className={styles.footerNavLinks}>
            <ul>
              <li className={styles.mobileItem} onClick={() => handleFooterLinksNavigate("about-us")}>
                About Localists
              </li>
            </ul>
          </Panel>
        </Collapse>

        {isMobile ? <span className={styles.contactCountyWrapper}><FooterContent /></span> : <FooterContent />}
      </div>

      {/* Footer Bottom */}
      <div className={styles.footerBottom}>
        <p>
          © 2025 Localists.
          <span style={{ cursor: "pointer" }} onClick={() => handleFooterLinksNavigate("terms")}> Terms & Conditions </span>
          /
          <span style={{ cursor: "pointer" }} onClick={() => handleFooterLinksNavigate("cookie-policy")}> Cookie policy </span>
          /
          <span style={{ cursor: "pointer" }} onClick={() => handleFooterLinksNavigate("privacy-policy")}> Privacy policy </span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;