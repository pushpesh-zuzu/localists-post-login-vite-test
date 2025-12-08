import styles from "./AllServices.module.css";
import { Link, useParams } from "react-router-dom";

const AllServiceLevel1 = ({ data }) => {
  const { lang, country } = useParams();
  const currentLang = lang || "en";
  const currentCountry = country || "gb";

  return (
    <div className={styles.container}>
      {/* Keep this title only once */}
      <h2 className={styles.title}>
        All <span className={styles.blueTitle}>Services</span>
      </h2>

      <div className={styles.categoryContainer}>
        <div className={styles.servicesContainer}>
          {data?.map(({ name, path }, idx) => {
            const servicePath = `/${currentLang}/${currentCountry}${path}`;

            return (
              path ? <Link
                style={{ color: "#000", cursor: "pointer",textDecoration:'none' }}
                key={idx}
                to={servicePath}
                className={styles.serviceItem}
              >
                {name}
              </Link> :
              <div className={styles.serviceItem}>{name}</div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AllServiceLevel1;
