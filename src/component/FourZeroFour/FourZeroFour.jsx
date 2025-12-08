import React from "react";
import styles from "./fourzerofour.module.css";
function FourZeroFour() {
  return (
    <main className={styles.wrapper}>
      <img
        src={"/notfound.png"}
        alt={"page not found"}
        className={styles.image}
        loading="lazy"
        draggable="false"
      />
    </main>
  );
}

export default FourZeroFour;
