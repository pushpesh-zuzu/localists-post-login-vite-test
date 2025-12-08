import React from "react";
import HowItWorks from "../component/howItWorks";
import CalonicalTags from "../component/common/CalonicalTags/CalonicalTags";
import { Helmet } from "react-helmet-async";

const HowItWorksPageCustomers = () => {
  return (
    <>
      <Helmet>
        <meta
          property="og:title"
          content="How It Works for Customers - Localists"
        />
        <meta
          name="twitter:title"
          content="How It Works for Customers - Localists"
        />
        <meta
          property="og:description"
          content="Find trusted local professionals fast with Localists.com. Enter your details, get up to 5 free quotes, compare, and save – no commission or hidden fees."
        />
      </Helmet>
      <CalonicalTags isRequiredjsonLd={false} />
      <HowItWorks />
    </>
  );
};

export default HowItWorksPageCustomers;
