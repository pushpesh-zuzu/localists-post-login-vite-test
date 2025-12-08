import React, { useState, useEffect } from "react";
import styles from "./ourteams.module.css";
import teamMember from "../../../assets/Images/teamMember.png";
import teamMemberPhone from "../../../assets/Images/teamsMemberPhone.png";
import quotes from "../../../assets/Images/quote.svg";
// import rating from "../../../assets/Images/ratings.svg";
// import dotSlider from "../../../assets/Images/dotSlider.svg";
import { StarFilled } from "@ant-design/icons";

const OurTeams = () => {
  // Static testimonial data
  const testimonials = [
    {
      text: "Brilliant experience! The platform quickly connected me with trustworthy providers. I’d recommend it to anyone in need of reliable, high-quality services.",
      name: "Charlotte",
      rating: 5,
    },
    {
      text: "Fantastic support and such an easy process. I received several quotes almost instantly and was able to choose the right professional for my needs.",
      name: "Oliver",
      rating: 5,
    },
    {
      text: "Great service with a fast response. The team were professional, efficient, and helped me find exactly what I needed without any hassle.",
      name: "Amelia",
      rating: 5,
    },
    {
      text: "Within minutes of submitting my request, I heard back from two local companies ready to help. Couldn’t have asked for a quicker service.",
      name: "George",
      rating: 5,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Manual dot navigation
  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className={styles.teamsContainer}>
      <div className={styles.teamsLeftCotainer}>
        <div className={styles.quotes}>
          <img src={quotes} alt="quotes" />
        </div>

        <div className={styles.ratingWrapper}>
          {[...Array(testimonials[currentIndex].rating)].map((_, index) => (
            //  <img src={rating} alt="rating" />

            <StarFilled className={styles.start} key={index} />
          ))}
        </div>

        <div className={styles.info}>
          <p>{testimonials[currentIndex].text}</p>
          <strong>{testimonials[currentIndex].name}</strong>
        </div>

        <div className={styles.dotSlider}>
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                border: "none",
                cursor: "pointer !important",
                backgroundColor: index === currentIndex ? "#00AFE3" : "#ccc",
                transition: "background-color 0.3s ease",
                outline: "none",
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className={styles.teamsRightCotainer}>
        <img
          src={teamMember}
          alt="team members"
          className={styles.teamMemberPic}
        />
        <img
          src={teamMemberPhone}
          alt="teamMemberPhone"
          className={styles.teamMemberPhone}
        />
      </div>
    </div>
  );
};

export default OurTeams;
