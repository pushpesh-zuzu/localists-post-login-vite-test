import React, { useState } from "react";
import styles from "./GrowthSteps.module.css";
import { GrowthStepsData } from "../../../constant/ServicePanel";
import { Link, useParams } from "react-router-dom";
import LeadInfoModal from "./LeadStaticModal";

const GrowthSteps = () => {
  const { lang, country } = useParams();
  const currentLang = lang || "en";
  const currentCountry = country || "gb";
  const [showModal, setShowModal] = useState(false);

  const handleCardClick = (item) => {
    if (item?.id === 2) {
      setShowModal(true);
    }
  };
  return (
    <>
      <div className={styles.growContainer}>
        <div className={styles.growHeader}>
          <div style={{ textAlign: "center" }}>
            <h2 className={styles.heading}>
              Your next client is already looking for You
            </h2>
          </div>
          <div className={styles.container}>
            {GrowthStepsData.map((item) => (
              <div className={styles.card} key={item.id}>
                <div>
                  <div className={styles.header}>
                    <div className={styles.iconContainer}>
                      <img
                        src={item.image}
                        alt="icon"
                        className={styles.icon}
                      />
                    </div>
                    <h3 className={styles.title}>
                      {item.title1}{" "}
                      <span>
                        <br />
                        {item.title2}
                      </span>
                    </h3>
                  </div>
                  <ul className={styles.list}>
                    {item.Description1 && <li>{item.Description1}</li>}
                    {item.Description2 && <li>{item.Description2}</li>}
                    {item.Description3 && <li>{item.Description3}</li>}
                  </ul>
                </div>
                {/* <button className={styles.button} onClick={() => navigate(item.path)}>{item.button}</button> */}
                <Link
                  style={{ textDecoration: "none", textAlign: "center" }}
                  to={
                    item.id == 1 || item.id == 3
                      ? `/${currentLang}/${currentCountry}/${item.path}`
                      : "#"
                  }
                  className={styles.button}
                  onClick={() => handleCardClick(item)}
                >
                  {item.button}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
      <LeadInfoModal visible={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};
export default GrowthSteps;
