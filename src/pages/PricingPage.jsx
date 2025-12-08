import React from "react";
import Pricing from "../component/Pricing";
import CalonicalTags from "../component/common/CalonicalTags/CalonicalTags";
import { Helmet } from "react-helmet-async";

const PricingPage = () => {
  return (
    <>
      <Helmet>
          <meta
            property="og:title"
            content="Pricing | Join Free & Connect with Customers - Localists"
          />
          <meta
            name="twitter:title"
            content="Pricing | Join Free & Connect with Customers - Localists"
          />
          <meta
            property="og:description"
            content="Register free on Localists and get customer leads. Only pay a small fee to connect with the ones you want. Keep 100% of what you earn."
          />
      </Helmet>
      <CalonicalTags isRequiredjsonLd={false} />
      <Pricing />
    </>
  );
};

export default PricingPage;
