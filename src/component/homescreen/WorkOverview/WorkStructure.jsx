import { useState } from "react";
import { WORK_STEPS } from "../../../constant/Homepage";
import BuyerRegistration from "../../buyerPanel/PlaceNewRequest/BuyerRegistration/BuyerRegistration";
import StepsBox from "./StepsBox";
import styles from "./workstructure.module.css";
import { useSelector } from "react-redux";
import { handleScrollToBottom } from "../../../utils/scroll";

const WorkStructure = () => {
  const [show,setShow] = useState(false)
  const handleOpen = () => {
    setShow(true)
  }
  const handleClose = () => {
    setShow(false)
  }
  const { userToken } = useSelector((state) => state.auth)
  return (
    <div className={styles.workContainer}>
      <h3 className={styles.header}>
        How <span>We Work</span>
      </h3>
      <div className={styles.description}>
        Get competitive home improvements quotes from leading suppliers in{" "}
        <span>3 simples step!</span>
      </div>
      <div className={styles.workstepContainer}>
        {WORK_STEPS.map((item) => (
          <StepsBox key={item.id} step={item} />
        ))}
      </div>
      <div className={styles.footer}>
        <button className={styles.quoteButton} onClick={()=>{handleScrollToBottom()}}>Get a Free Quote</button>
      </div>
      {/* {show && (userToken?.active_status == 2 || !userToken )  && (
          <>
            <BuyerRegistration closeModal={handleClose}  />
          </>
        )} */}
    </div>
  );
};

export default WorkStructure;
