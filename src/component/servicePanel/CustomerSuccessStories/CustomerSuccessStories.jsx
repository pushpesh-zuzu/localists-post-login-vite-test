import React from "react";
import styles from "./CustomerSuccessStories.module.css";
import { CustomerSuccessStoriesData } from "../../../constant/ServicePanel";

const CustomerSuccessStories = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>
        What successful professionals on
 <span>  Localists </span> have to say
      </h2>
      <p className={styles.subHeading}>
        See what other small businesses have to say about Localists
      </p>
      <div className={styles.cardsContainer}>
        {CustomerSuccessStoriesData.map((story) => (
          <div key={story.id} className={styles.card}>
            <img src={story.image} alt={story.name} className={styles.image} />
            <div className={styles.content}>
              <p className={styles.description}>{story.description}</p>
              <p className={styles.name}>{story.name}</p>
              <p className={styles.company}>{story.company}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerSuccessStories;
