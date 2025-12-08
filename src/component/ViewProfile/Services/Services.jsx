import React, { useState } from "react";
import styles from "./services.module.css";
import ProfileArrowUp from "../../../assets/Icons/ProfileArrow.svg";

const service = [
  {
    title: "Corporate Tax",
    content:
      "Reference site about Lorem Ipsum, giving information on its origins...",
  },
  { title: "Construction Accounting", content: "..." },
  { title: "Accounts Production", content: "..." },
  { title: "Tax Planning", content: "..." },
  { title: "Overdue Accounts and Tax", content: "..." },
  { title: "Management Accounts", content: "..." },
];

const Services = ({ details }) => {
  const data = details?.services;
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className={styles.section}>
      <h2>Services</h2>
      <div className={styles.accordion}>
        {data?.map((item, index) =>
          item?.user_services?.map((service, subIndex) => (
            <div key={`${index}-${subIndex}`}>
              <div
                className={styles.accordionHeader}
                onClick={() =>
                  setOpenIndex(
                    openIndex === `${index}-${subIndex}`
                      ? null
                      : `${index}-${subIndex}`
                  )
                }
              >
                {service.name}
                <img
                  src={ProfileArrowUp}
                  alt="arrow"
                  className={`${styles.arrow} ${
                    openIndex === `${index}-${subIndex}`
                      ? styles.up
                      : styles.down
                  }`}
                />
              </div>
              {openIndex === `${index}-${subIndex}` && (
                <div className={styles.accordionContent}>
                  {service.description || "No description available"}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default Services;
