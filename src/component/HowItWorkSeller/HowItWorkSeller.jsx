import React from "react";
import BannerWrapper from "../common/bannerWrapper/BannerWrapper";
import SearchServicesPin from "../common/SeachServicesPin/SearchServicesPin";
import styles from "./howitworkseller.module.css";
import HowItWorksDetail from "./HowItWorkDetails";
import howitworkseller from "../../assets/Images/HowItWorks/howitworkseller.jpg";
import ResigterNow from "../howItWorks/RegisterNow/RegisterNow";
import BlueBlackTextForH1 from "../common/headings/BlueBlackTextForH1";
import { Helmet } from "react-helmet-async";
import CalonicalTags from "../common/CalonicalTags/CalonicalTags";

function HowItWorkSeller() {
  const style = {
    backgroundImage: `url(${howitworkseller})`,
  };
  return (
    <>
      <Helmet>
        <title>How It Works for Professionals & Businesses - Localists</title>
        <meta
          name="description"
          content="Learn how Localists connect you with ready-to-hire customers in your area. Get quality leads, grow your business, and boost your visibility online today."
        />
        <meta
          property="og:title"
          content="How It Works for Professionals & Businesses - Localists"
        />
        <meta
          name="twitter:title"
          content="How It Works for Professionals & Businesses - Localists"
        />
        <meta
          property="og:description"
          content="Learn how Localists connect you with ready-to-hire customers in your area. Get quality leads, grow your business, and boost your visibility online today."
        />
      </Helmet>
      <CalonicalTags isRequiredjsonLd={false}/>
      <div className={styles.container} style={style}>
        <div className={styles.text}>
          <BlueBlackTextForH1
            firstblue={false}
            secondText=" How It Works –"
            firstblueText="Localists"
            thirdText="for Professionals"
          />
          <SearchServicesPin
            className={styles.search}
            title="5,000+ UK professionals trust Localists to grow. Get new jobs every day, select only the ones you want, and connect instantly with clients."
          />
        </div>
      </div>
      <HowItWorksDetail />
      <ResigterNow />
    </>
  );
}

export default HowItWorkSeller;
