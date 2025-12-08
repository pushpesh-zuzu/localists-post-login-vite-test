import { handleScrollToBottom } from "../../../utils/scroll";
import styles from "./HowItWorks.module.css";
const HowItWorks = ({ctaText,howItWorksData}) => {
    return (
      <div className={styles.container}>
        <h2 className={styles.heading}>
        How  
        <span className={styles.highlight}> Localists </span>Works
        </h2>
        <div className={styles.stepsContainer}>
          {howItWorksData.map((item, index) => (
            <div className={styles.step} key={index}>
              <div className={styles.imageWrapper}>
                <img src={item.image} alt={item.title} className={styles.icon} />
              </div>
              <div className={styles.content}>
                <h3 className={styles.title}>
                  {item.heading1} 
                  <span className={styles.blueText}>{" "} {item.heading2}</span>
                   <span className={item.heading1}> {item?.heading3}</span>
                  <br className={styles.lineBreak} /> 
                  {item?.break && <br className={styles.lineBreak} />}
                </h3>  
                <p className={styles.description}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
        <button onClick={()=>handleScrollToBottom()} className={styles.ctaButton}>
          Get Quotes From {ctaText} Near You
        </button>
      </div>
    );
  };
  
  export default HowItWorks;