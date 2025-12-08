import PropTypes from "prop-types";
import styles from "./GetQuotes.module.css";
import { handleScrollToBottom } from "../../../utils/scroll";

const GetQuotes = ({ ctaText, needSString = true }) => {
  return (
    <div className={styles.container}>
      <button onClick={() => handleScrollToBottom()} className={styles.button}>
        Get Quotes
      </button>

      {ctaText && (
        <p className={styles.text}>
          From {ctaText}
          {needSString ? "s" : ""} Service Providers Today
        </p>
      )}
    </div>
  );
};

// GetQuotes.propTypes = {
//   ctaText: PropTypes.string.isRequired,
// };
export default GetQuotes;
