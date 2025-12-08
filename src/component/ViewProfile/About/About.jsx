import { useState } from "react";
import styles from "./About.module.css";
import businessImg from "../../../assets/Images/Setting/businessImg.svg";
import staffImg from "../../../assets/Images/Setting/staffImg.svg";
import localistHireImg from "../../../assets/Images/Setting/localistHireImg.svg";
import responseTimeImg from "../../../assets/Images/Setting/responseTimeImg.svg";

const About = ({ details }) => {
  const [showFull, setShowFull] = useState(false);

  const aboutText = details?.about_company || "";
  const shortText =
    aboutText.length > 300 ? aboutText.slice(0, 300) + "..." : aboutText;

  const data = [
    {
      title: `${
        details?.hire_count ? details?.hire_count : "0"
      } hires on Localists`,
      icon: businessImg,
    },
    {
      title:
        `${
          details?.company_total_years ? details?.company_total_years : "0"
        } Years in business` || "4 Years in business",
      icon: staffImg,
    },
    {
      title: `${
        details?.response_time ? details?.response_time : "0 mins"
      } response time`,
      icon: localistHireImg,
    },
    {
      title: `${details?.company_size ?? "No"} Staff` || "Not specified",
      icon: responseTimeImg,
    },
  ];

  return (
    <div className={styles.aboutContainer}>
      <h2>About</h2>
      <div className={styles.Business_Description}>
        <p>
          {" "}
          {showFull ? aboutText : shortText}
          {aboutText.length > 300 && (
            <span
              onClick={() => setShowFull(!showFull)}
              className={styles.readMore}
            >
              {showFull ? " Read less" : " Read more"}
            </span>
          )}
        </p>
      </div>
      <div className={styles.aboutContent}>
        {data.map((item, index) => (
          <div key={index} className={styles.aboutItem}>
            <span>
              <img src={item?.icon} alt="img" />
            </span>
            <h3>{item.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};
export default About;
