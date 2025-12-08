import styles from "./bannerwrapper.module.css";

const BannerWrapper = ({ image, children, headingText = "" }) => {
  const bannerStyle = {
    backgroundImage: `url(${image})`,
  };

  return (
    <div className={styles.contactSection}>
      <div className={styles.bannerImage} style={bannerStyle}>
        {headingText && <h1 className={styles.bannerTitle}>{headingText}</h1>}

        {children && <div className={styles.bannerContent}>{children}</div>}
      </div>
    </div>
  );
};

export default BannerWrapper;
