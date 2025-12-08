import React from "react";
import BannerWrapper from "../common/bannerWrapper/BannerWrapper";
import { aboutUsBanner } from "../../assets/Images/MainBanners";
import WhoWeAre from "./WhoWeAre";
import styles from "./aboutus.module.css";
import Stats from "./Stats";
import LeadershipCard from "./LeaderShipCard";
import OurInvestor from "./OurInvestor";
import GetInTouchButton from "./GetInTouch";
import { Helmet } from "react-helmet-async";
import CalonicalTags from "../common/CalonicalTags/CalonicalTags";
function AboutUs() {
  return (
    <div>
      <Helmet>
        <title>Meet Our Leadership Team & Investors - Localists</title>
        <meta
          name="description"
          content="Meet our experienced leadership team and the investors driving Localists, the world’s fastest-growing local services marketplace. Get free quotes."
        />
        <meta
          property="og:title"
          content="Meet Our Leadership Team & Investors - Localists"
        />
        <meta
          name="twitter:title"
          content="Meet Our Leadership Team & Investors - Localists"
        />
        <meta
          property="og:description"
          content="Meet our experienced leadership team and the investors driving Localists, the world’s fastest-growing local services marketplace. Get free quotes."
        />
      </Helmet>
      <CalonicalTags bannerImage={aboutUsBanner} isRequiredjsonLd={false}/>
      <BannerWrapper headingText="About Us" image={aboutUsBanner} />
      <WhoWeAre />
      {/* <Stats /> */}
      {/* <LeadershipCard /> */}
      {/* <OurInvestor/> */}
      <GetInTouchButton />
    </div>
  );
}

export default AboutUs;
