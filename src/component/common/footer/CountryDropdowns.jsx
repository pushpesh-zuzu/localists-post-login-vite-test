"use client";
import styles from "./CountryDropdown.module.css";
import ArrowSolidBalckSelect from "../../../ReactIcon/ArrowSolidBalckSelect";
import UKFlag from "../../../assets/Icons/UKFlag.png";

export default function CountryDropdown() {
  return (
    <div className={styles.wrapper}>
      {/* Accessibility label */}
      <label htmlFor="country-select" className={styles.srOnly}>
        Selected Country
      </label>

      <div className={styles.flagWrapper}>
        <img
          width={22}
          height={13}
          src={UKFlag}
          alt="UK Flag"
          className={styles.flagImage}
        />
      </div>

      <select
        id="country-select"
        disabled
        className={styles.select}
      >
        <option value="UK">United Kingdom</option>
      </select>

      <div className={styles.arrowWrapper}>
        <ArrowSolidBalckSelect className={styles.arrowIcon} />
      </div>
    </div>
  );
}