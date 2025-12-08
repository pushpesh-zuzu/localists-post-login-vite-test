import React, { useEffect, useState } from "react";
import styles from "./MyCredit.module.css";
import { useDispatch, useSelector } from "react-redux";
import { getswitchAutobidApi, switchAutobidApi } from "../../store/LeadSetting/leadSettingSlice";

const MyCredit = () => {
  const dispatch = useDispatch();

  const { registerData } = useSelector((state) => state.findJobs);
  const { userToken } = useSelector((state) => state.auth);
  const { getSwitcgAutoBidData } = useSelector((state) => state.leadSetting);

  const [automation, setAutomation] = useState(false);

  const userId =
    userToken?.remember_tokens ?? registerData?.remember_tokens;

  // API se data aane ke baad automation state update karo
  useEffect(() => {
    if (getSwitcgAutoBidData?.isautobid !== undefined) {
      setAutomation(getSwitcgAutoBidData.isautobid === 1);
    }
  }, [getSwitcgAutoBidData]);

  // Initial API call
  useEffect(() => {
    if (userId) {
      dispatch(getswitchAutobidApi({ user_id: userId }));
    }
  }, [userId, dispatch]);

  const handleToggle = () => {
    const newValue = !automation;
    setAutomation(newValue);

    dispatch(
      switchAutobidApi({
        is_autobid: Number(newValue),
        user_id: userId,
      })
    );
  };

  return (
    <div className={styles.container}>
        <h1>My Credit</h1>
      <div className={styles.toggle}>
        <span>Automations</span>
        <label className={styles.switch}>
          <input
            type="checkbox"
            checked={automation}
            onChange={handleToggle}
          />
          <span className={styles.slider}></span>
        </label>
      </div>
    </div>
  );
};

export default MyCredit;
