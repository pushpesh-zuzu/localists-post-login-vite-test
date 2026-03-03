// import Logo from "../../../public/Logo";
import styles from "./VerifiedBadge.module.css";

export default function VerifiedBadge() {
  return (
    <div className={styles.card}>
      
      <div className={styles.top}>
        <h3 className={styles.title}>
          VERIFIED SERVICE <br /> PROVIDER
        </h3>
      </div>

      <div className={styles.bottom}>
        {/* <Logo className={styles.logo} /> */}
      </div>

    </div>
  );
}