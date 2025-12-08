import React from "react";
import FindLocalJobs from "./FindLocalJobs/FindLocalJobs";
import GrowthSteps from "./GrowthSteps/GrowthSteps";
import CustomerSuccessStories from "./CustomerSuccessStories/CustomerSuccessStories";
import RatedGreat from "./RatedGreat/RatedGreat";
import { Helmet } from "react-helmet-async";

const ServicePanel = () => {
  return (
    <>
      <Helmet>
        <title>Join Localists for Professionals | Free Sign-Up</title>
        <meta
          name="description"
          content="Join Localists free as a professional. Get verified leads with no hidden fees. Pay only for the customers you want and keep all your earnings."
        />
      </Helmet>
      <FindLocalJobs />
      <GrowthSteps />
      <CustomerSuccessStories />
      {/* <RatedGreat /> */}
    </>
  );
};
export default ServicePanel;
