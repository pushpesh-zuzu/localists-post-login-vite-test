import React from "react";
import styles from "./howitwork.module.css";
import howitworkdigitalmanseller from "../../assets/Images/HowItWorks/howitworkdigitalmanseller.jpg";
import howitworkwommenseller from "../../assets/Images/HowItWorks/howitworkwommenseller.jpg";
import howitworkyouprofessionseller from "../../assets/Images/HowItWorks/howitworkyouprofessionseller.jpg";
import smileyman from "../../assets/Images/HowItWorks/smileyman.jpg";
import plumber from "../../assets/Images/HowItWorks/plumber.jpg";


const data = [
  {
    id: 1,
    title: "Customers come to us with their need",
    paragraphs: [
      "At Localists, we make it easy for local professionals and businesses like you to win more work. Every day, we connect thousands of service providers from builders and gardeners to accountants and business consultants, with high-quality clients who are ready to hire.At Localists, we make it easy for local professionals and businesses like you to win more work. Every day, we connect thousands of service providers from builders and gardeners to accountants and business consultants, with high-quality clients who are ready to hire.",
      "When customers post a request, telling us exactly what they’re after and where they need it done. We match them with the right service provider in their area.",
      "We don’t just take a vague request; we ask the right questions so you get proper, detailed leads that actually fit your skills.",
    ],
    images: [howitworkyouprofessionseller],
  },
  {
    id: 2,
    title: "We match them with you",
    paragraphs: [
      `When a request matches your services, customers can see your profile and reach out directly. You’ll also get the lead straight to your inbox, so you never miss a chance.`,
      `You only pay a small fee for each introduction, and in return, you’ll get the customer contact details (phone number and email), so you can make contact or provide a quote right away.`,
    ],
    images: [howitworkdigitalmanseller],
  },
  {
    id: 3,
    title: "You win the work and grow your business",
    paragraphs: [
      "We make it simple for you to win new work without the stress of marketing. We bring the opportunities to you - fresh, relevant, and local. The quicker you respond, the more work you’ll win. And we’ll be right here with support if you ever need it.",
    ],
    images: [howitworkwommenseller],
  },
  {
    id: 4,
    title: "Why professionals love localists",
    paragraphs: ["When you join Localists as a seller you’ll get:"],
    list: [
      "High visibility profile that shows off your work and builds your reputation.",
      "Steady flow of quality leads that aren’t just clicks, but genuine customers looking to book your services.",
      "Full control over the jobs you accept",
      "Friendly support from our customer success team whenever you need it."
    ],
    images: [plumber,smileyman],
  },
];

const HowItWorksDetail = () => {
  return (
    <div className={styles.stepsContainer}>
      {data.map((step, index) => (
        <div key={step.id} className={styles.stepWrapper}>
          {index % 2 === 0 ? (
            <>
              <div className={styles.imageContainer}>
                {step.images.map((image, imgIndex) => (
                  <img
                    key={imgIndex}
                    src={image}
                    alt={`${step.title} - Image ${imgIndex + 1}`}
                    className={styles.stepImage}
                  />
                ))}
                {/* {index === 0 && (
                  <div className={styles.popover}>Enter Your Requirements</div>
                )} */}
              </div>
              <div className={styles.textContainer}>
                <div className={styles.titleContainer}>
                  <h2 className={styles.stepTitle}>{step.title}</h2>
                </div>
                <div className={styles.paragraphsContainer}>
                  {step.paragraphs.map((paragraph, paraIndex) => (
                    <p key={paraIndex} className={styles.stepParagraph}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className={styles.textContainer}>
                <div className={styles.titleContainer}>
                  <h2 className={styles.stepTitle}>{step.title}</h2>
                </div>
                <div className={styles.paragraphsContainer}>
                  {step.paragraphs.map((paragraph, paraIndex) => (
                    <p key={paraIndex} className={styles.stepParagraph}>
                      {paragraph}
                    </p>
                  ))}
                </div>
                  {step?.list?.map((listitem,index) => (
                    <ul key={index}>
                      <li>{listitem}</li>
                    </ul>
                  ))}
              </div>
              <div className={`${styles.imageContainer}`}>
                {step.images.map((image, imgIndex) => (
                  <img
                    key={imgIndex}
                    src={image}
                    alt={`${step.title} - Image ${imgIndex + 1}`}
                   className={`${styles.stepImage} ${(step.id ===4 && imgIndex === 0) ? styles.singleImageDisplayed : ""}`}
                    style={{marginTop:imgIndex ===1?'30px':''}}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default HowItWorksDetail;
