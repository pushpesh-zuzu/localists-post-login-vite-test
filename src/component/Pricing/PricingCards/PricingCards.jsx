import React from "react";
import styles from "./PricingCards.module.css";
import creditsAtTheReady from "../../../assets/Images/Pricing/creditsAtTheReadyImg.svg";
import youareincontrol from "../../../assets/Images/Pricing/youAreInControlImg.svg";
import jobrelatedprice from "../../../assets/Images/Pricing/jobRelatedPricesImg.svg";
import newbusiness from "../../../assets/Images/Pricing/newBusinessImg.svg";

const cardData = [
  {
    title: "No commission. No hidden fees.",
    description:
      "We use a straightforward credit system. Buy a credit pack, and use your credits to connect with the customers you want. It's that easy.",
    linkText: "No commission, no hidden fees.",
    image: creditsAtTheReady,
  },
  {
    title: "You have total control",
    description:
      "When we send you leads, you decide which leads are worth it. Every lead shows its cost in credits upfront, so you know exactly what you’re spending.",
    image: youareincontrol,
  },
  {
    title: "Transparent pricing",
    description:
      "The credit cost of a lead depends on the service, the size of the job, and demand in your area, keeping things fair and flexible.",
    image: jobrelatedprice,
  },
  {
    title: "Our pricing promise",
    description:
      "We’re so confident you’ll win business with your first credit pack, we’ll return all your credits if you don’t. No questions asked.",
    image: newbusiness,
  },
];

const PricingCards = () => {
  return (
    <div className={styles.container}>
      {cardData.map((card, index) => (
        <div
          key={index}
          className={`${styles.card} ${
            (index + 1) % 2 === 0 ? styles.reverse : ""
          }`}
        >
          <div
            className={`${styles.imageSection} ${styles[`image${index + 1}`]}`}
          >
            <img src={card.image} alt={card.title} />
          </div>

          <div  className={`${styles.centerLine} ${styles[`line${index}`]}`}></div>

          <div className={styles.textSectionContainer}>
            <div
              className={`${styles.textSection} ${
                index === 1 || index === 3 ? styles.shiftLeft : ""
              }`}
            >
              <h3>{card.title}</h3>
              <p>
                {card.description}
                {card.linkText && (
                  <>
                    {" "}
                    <span href="#">{card.linkText}</span>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PricingCards;
