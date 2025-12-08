import React from "react";
import styles from "./CategoriesHelpCenter.module.css";
import CustomersImg from "../../../assets/Images/HelpCenter/CustomersImg.svg";
import ProfessionalsImg from "../../../assets/Images/HelpCenter/ProfessionalsImg.svg";
import GeneralImg from "../../../assets/Images/HelpCenter/GeneralImg.svg";

const CategoriesHelpCenter = () => {
  const categories = [
    {
      title: "General",
      description: "Learn about the localists.com platform",
      image: GeneralImg,
    },
    {
      title: "Professionals",
      description: "How Localist works for professionals",
      image: ProfessionalsImg,
    },
    {
      title: "Customers",
      description: "How localists.com works for customers",
      image: CustomersImg,
    },
  ];

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.heading}>Categories</h2>
      <div className={styles.cardContainer}>
        {categories.map((item, index) => (
          <div
            key={index}
            className={styles.card}
            style={{ backgroundImage: `url(${item.image})` }}
          >
            <div className={styles.overlay}>
              <h3 className={styles.title}>{item.title}</h3>
              <p className={styles.description}>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesHelpCenter;
