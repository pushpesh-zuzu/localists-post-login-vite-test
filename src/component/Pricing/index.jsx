import React from "react";
import styles from "./Pricing.module.css";
import PricingSection from "./PricingSection/PricingSection";
import CreditBuyingProcess from "./CreditBuyingProcess/CreditBuyingProcess";
import PricingCards from "./PricingCards/PricingCards";
import PricingFAQ from "./PricingFAQ/PricingFAQ";
import StartWinning from "./StartWinning/StartWinning";
import { Helmet } from "react-helmet-async";

const Pricing = () => {
  return (
    <>
      <Helmet>
        <title>Pricing | Join Free & Connect with Customers - Localists</title>
        <meta
          name="description"
          content="Register free on Localists and get customer leads. Only pay a small fee to connect with the ones you want. Keep 100% of what you earn."
        />
      </Helmet>

      <div className={styles.pricingContainer}>
        <PricingSection />
        <CreditBuyingProcess />
        <PricingCards />
      </div>
      <PricingFAQ />
      <StartWinning />
    </>
  );
};

export default Pricing;
