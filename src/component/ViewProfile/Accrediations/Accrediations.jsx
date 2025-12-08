import styles from "./Accrediations.module.css";
import iIcon from "../../../assets/Images/iIcon.svg";
import IMG from "../../../assets/Images/Setting/newAccoredationImg.svg";
import { BASE_IMAGE } from "../../../utils";

const Accrediations = ({ details }) => {
  const data = details?.accreditations;
  return (
    <div className={styles.accrediationsContainer}>
      <h2 style={{ marginBottom: 20 }}>Accreditations</h2>

      {data && data.length > 0
        ? data.map((item, index) => (
            <div key={index} className={styles.accrediationsBoxContainer}>
              <div>
                <img
                  src={
                    item?.image
                      ? `${BASE_IMAGE}/accreditations/${item.image}`
                      : IMG
                  }
                  alt="accrediation"
                  className={styles.accrediationImage}
                  width={93}
                  height={93}
                />
              </div>
              <div className={styles.accrediationsBox}>{item?.name}</div>
            </div>
          ))
        : ""}
      <div className={styles.infoBox}>
        <span className={styles.infoIcon}>
          <img src={iIcon} alt="" style={{ marginTop: "4px" }} />
        </span>
        <span>
          Professionals report their own accreditations. Please ask them for
          more details if required.{" "}
        </span>
      </div>
    </div>
  );
};
export default Accrediations;
