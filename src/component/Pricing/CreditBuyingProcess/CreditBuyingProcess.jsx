import styles from "./CreditBuyingProcess.module.css";
import ChooseRightCreditIcon from "../../../assets/Images/Pricing/ChooseRightCreditIcon.svg";
import CompletePurchaseIcon from "../../../assets/Images/Pricing/CompletePurchaseIcon.svg";
import RedeemCreditsIcon from "../../../assets/Images/Pricing/RedeemCreditsIcon.svg";

const CreditBuyingProcess = () => {
  const HowItWorksData = [
    {
      id: 1,
      title: "ChooseRightCreditIcon",
      image: ChooseRightCreditIcon,
      description:
        " Pick a credit pack that fits your business needs. Basic or premium, there’s an option for you.",
    },
    {
      id: 2,
      title: "CompletePurchaseIcon",
      image: CompletePurchaseIcon,
      description:
        "Buy credits quickly and safely using your preferred payment method.",
    },
    {
      id: 3,
      title: "RedeemCreditsIcon",
      image: RedeemCreditsIcon,
      description:
        "Spend credits to contact customers you’re interested in. Once unlocked, you’ll get their phone number and email so you can reach out directly.",
    },
  ];
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>
        How to Access <span className={styles.highlight}> Your Leads</span>
      </h2>
      <div className={styles.stepsContainer}>
        {HowItWorksData.map((item, index) => (
          <div className={styles.step} key={index}>
            <div className={styles.imageWrapper}>
              <img src={item.image} alt={item.title} className={styles.icon} />
            </div>
            <div className={styles.content}>
              <p className={styles.description}>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreditBuyingProcess;
