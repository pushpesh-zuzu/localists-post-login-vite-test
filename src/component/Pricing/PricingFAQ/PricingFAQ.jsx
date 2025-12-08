import React, { useState } from "react";
import styles from "./PricingFAQ.module.css";
import { DownOutlined, UpOutlined } from "@ant-design/icons";

const faqData = [
  {
    question: "Do I get the customer’s contact details?",
    answer:
      "Yes, once you unlock a lead, you’ll receive the customer’s phone number and email.",
  },
  {
    question: "Do I pay for sending follow-up messages?",
    answer:
      " No. There is no cost associated with follow-up messages. Once you’ve unlocked the lead, you can contact the customer as much as needed to finalise your project details.",
  },
  {
    question: "How long do my credits last?",
    answer:
      "Your credits are valid up to 12 months from the date of purchase.",
  },
  {
    question: "Will I be charged extra along the way?",
    answer:
      "At Localists, we value transparency. So you can rest assured there are no commissions or surprise fees along the way. You only pay for the credits you use to unlock potential leads. ",
  },
];

const PricingFAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFAQ = (index) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  return (
    <div className={styles.faqWrapper}>
      <h2 className={styles.heading}>
        Frequently asked <span>questions</span>
      </h2>
      <div className={styles.faqList}>
        {faqData.map((item, index) => (
          <div key={index} className={styles.faqItem}>
            <div
              className={
                openIndex === index ? styles.blueQuestion : styles.question
              }
              onClick={() => toggleFAQ(index)}
            >
              <h4>{item.question}</h4>
              {openIndex === index ? (
                <UpOutlined className={styles.icon} />
              ) : (
                <DownOutlined className={styles.icon} />
              )}
            </div>
            {openIndex === index && item.answer && (
              <p className={styles.answer}>{item.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingFAQ;
