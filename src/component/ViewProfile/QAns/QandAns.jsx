import React, { useState } from "react";
import styles from "./QandAns.module.css";
import ProfileArrowUp from "../../../assets/Icons/ProfileArrow.svg"

const faqData = [
  {
    question: "What kind of accounting services do you provide?",
    answer:
      "Reference site about Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator.",
  },
  {
    question: "Why is it so important for businesses to hire a great accountant?",
    answer: "",
  },
  {
    question: "What do you love most about your job?",
    answer: "",
  },
  {
    question: "What inspired you to start your own business?",
    answer: "",
  },
  {
    question: "Why should our clients choose you?",
    answer: "",
  },
];

const QandAns = ({details}) => {
  const [openIndex, setOpenIndex] = useState(0);
const data = details?.qa
  const toggleIndex = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={styles.container} style={{borderBottom:'1px solid #eee', marginBottom:'12px'}}>
      <h2>Q+A's</h2>
      {data?.map((item, index) => (
        <div key={index} className={styles.faqItem} >
          <div className={styles.question} onClick={() => toggleIndex(index)}>
        {item.questions}
               <img src={ProfileArrowUp} alt="arrow" className={`${styles.arrow} ${openIndex === index ? styles.up : styles.down}`} />
          </div>
          {openIndex === index && item.answer && (
            <div className={styles.answer}>{item.answer}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default QandAns;
