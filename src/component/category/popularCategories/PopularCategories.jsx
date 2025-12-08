import styles from "./PopularCategories.module.css";
import { PopularCategoriesData } from "../../../constant/Category";

const PopularCategories = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        Popular <span className={styles.highlight}>Categories</span>
      </h2>
      <div className={styles.grid}>
        {PopularCategoriesData?.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.rowWrapper}>
            <div className={styles.row}>
              <div key={row.id} className={styles.card}>
                <img src={row.image} alt={row.title} className={styles.image} />
                {row?.availableOnline && (
                  <span className={styles.availableOnline}>
                    Available Online
                  </span>
                )}
                <button className={styles.cardbButton}>{row.title}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularCategories;
