import React from "react";
import styles from "./breadcrum.module.css";
import { Link, useParams } from "react-router-dom";

const Breadcrumb = ({ breadcrumb }) => {
  if (!Array.isArray(breadcrumb) || breadcrumb.length === 1 || 0) return null;
      const { lang, country } = useParams(); 
      const currentLang = lang || "en";
      const currentCountry = country || "gb";

  return (
    <nav aria-label="breadcrumb">
      <p className={styles.breadcrumb}>
        {breadcrumb.map((item, index) => {
          const isLast = index === breadcrumb.length - 1;
          return (
            <React.Fragment key={index}>
              {isLast ? (
                // Last item: black color, bold, not clickable
                <span className={`${styles.lastItem} ${styles.active}`}>
                  {item.title}
                </span>
              ) : (
                <>
                  {/* All other items: blue color and clickable */}
                  <Link to={`/${currentLang}/${currentCountry}${item.path}`} className={styles.link}>
                    {item.title}
                  </Link>
                  <span className={styles.separator}> / </span>
                </>
              )}
            </React.Fragment>
          );
        })}
      </p>
    </nav>
  );
};

export default Breadcrumb;
