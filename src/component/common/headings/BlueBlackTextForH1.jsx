import styles from "./withbluetextblack.module.css";
function BlueBlackTextForH1({
  firstblueText = "",
  secondText = "",
  firstblue = true,
  thirdText = "",
}) {
  return (
    <div className={styles.containerh}>
      <h1 className={styles.headingH1}>
        {firstblue ? (
          <>
            {firstblueText && (
              <span className={styles.primaryTextH1}>{firstblueText} </span>
            )}{" "}
            {secondText && (
              <span className={styles.textColorH1}>{secondText}</span>
            )}
          </>
        ) : (
          <>      
             {secondText && (
              <span className={styles.textColorH1}>{secondText} </span>
            )}
            {firstblueText && (
              <span className={styles.primaryTextH1}>{firstblueText}</span>
            )}{" "}
          </>
        )}
        {thirdText && <span className={styles.textColorH1}>{thirdText}</span>}
      </h1>
    </div>
  );
}

export default BlueBlackTextForH1;
