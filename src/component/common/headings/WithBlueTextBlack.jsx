import styles from "./withbluetextblack.module.css";
function WithBlueTextBlack({
  firstblueText = "",
  secondText = "",
  firstblue = true,
  thirdText = "",
  textalign='center'
}) {
  return (
    <div className={styles.container} style={{textAlign:textalign}}>
      <h2 className={styles.heading} >
        {firstblue ? (
          <>
            {firstblueText && (
              <span className={styles.primaryText}>{firstblueText} </span>
            )}{" "}
            {secondText && (
              <span className={styles.textColor}>{secondText}</span>
            )}
          </>
        ) : (
          <>
            {secondText && (
              <span className={styles.textColor}>{secondText} </span>
            )}
            {firstblueText && (
              <span className={styles.primaryText}>{firstblueText}</span>
            )}{" "}
          </>
        )}
        {thirdText && <span className={styles.textColor}>{thirdText}</span>}
      </h2>
    </div>
  );
}

export default WithBlueTextBlack;
