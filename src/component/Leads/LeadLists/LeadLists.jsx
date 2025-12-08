import styles from "./LeadLists.module.css";
import MatchingLeads from "./MatchingLeads/MatchingLeads";
import LeadsCards from "./LeadsCards/LeadsCards";
import FeelingStuckFooter from "./FeelingStuckFooter/FeelingStuckFooter";
import CreditMatch from "./CreditMatch/CreditMatch";

const LeadLists = () => {
  return (
    <div className={styles.leadListsContainer}>
      <CreditMatch />
      <MatchingLeads />
      <LeadsCards />
      <FeelingStuckFooter />
    </div>
  );
};

export default LeadLists;
