import HowLoaclistsWorks from "./HowLoaclistsWorks/HowLoaclistsWorks";
import FindLocalServices from "./FindLocalServices/FindLocalServices";
import ServicesSteps from "./ServicesSteps/ServicesSteps";
import ResigterNow from "./RegisterNow/RegisterNow";
import { Helmet } from "react-helmet-async";

const HowItWorks = () => {
  return (
    <>
      <Helmet>
        <title> How It Works for Customers - Localists</title>
        <meta
          name="description"
          content="Find trusted local professionals fast with Localists.com. Enter your details, get up to 5 free quotes, compare, and save – no commission or hidden fees."
        />
      </Helmet>
      <HowLoaclistsWorks />
      <FindLocalServices />
      <ServicesSteps />
      <ResigterNow />
    </>
  );
};

export default HowItWorks;
