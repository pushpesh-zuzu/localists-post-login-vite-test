import PropTypes from "prop-types";
import styles from "./GetQuotes.module.css";
import { handleScrollToBottom } from "../../../utils/scroll";

const GetQuotesLocation = ({ service, needSString = true, location }) => {
  return (
    <div className={styles.container}>
      <button onClick={() => handleScrollToBottom()} className={styles.button}>
        Get Quotes
      </button>

      {service && (
        <p className={styles.text}>
          From {service}
          {needSString ? "s" : ""}
        </p>
      )}
    </div>
  );
};

// GetQuotes.propTypes = {
//   service: PropTypes.string.isRequired,
// };
export default GetQuotesLocation;
