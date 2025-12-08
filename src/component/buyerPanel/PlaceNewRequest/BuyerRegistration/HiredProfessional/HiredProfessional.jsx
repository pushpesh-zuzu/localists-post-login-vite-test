import React, { useEffect, useState } from "react";
import styles from "./HiredProfessional.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getAddSumbitLeadDataApi,
  getAutoBid,
  getAutoBidData,
} from "../../../../../store/LeadSetting/leadSettingSlice";
import { showToast } from "../../../../../utils";
import { getbuyerrequestList } from "../../../../../store/Buyer/BuyerSlice";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const HiredProfessional = ({ closeModal, serviceId }) => {
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState("");
  const { autoBidList, autoBidListData, addSubmitLeadLoader } = useSelector(
    (state) => state.leadSetting
  );
  const { userToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (autoBidListData && Array.isArray(autoBidListData)) {
      const formattedOptions = autoBidListData?.map((item) => ({
        id: item.id,
        name: item.name,
      }));
      setOptions(formattedOptions);
    } else {
      setOptions([]);
    }
  }, [autoBidListData]);
  useEffect(() => {
    const data = {
      user_id: userToken?.remember_tokens,
      lead_id: serviceId,
    };
    dispatch(getAutoBidData(data));
  }, []);

  const handleSubmit = () => {
    let name = "";

    if (selected === "someone_else") {
      name = "Someone not on Localist";
    } else {
      const selectedOption = options.find((option) => option.id === selected);
      name = selectedOption ? selectedOption.name : "";
    }

    if (!selected && selected !== "someone_else") {
      showToast("error", "Please select option");
      return;
    }

    const data = {
      lead_id: serviceId,
      name: name,
      seller_id: selected === "someone_else" ? 0 : selected,
    };

    dispatch(getAddSumbitLeadDataApi(data)).then((result) => {
      if (result) {
        showToast("success", result?.message);
        closeModal();
        dispatch(getbuyerrequestList());
      }
    });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3 className={styles.title}>Select Hired Professional</h3>
        <div className={styles.options}>
          {options.map((option) => (
            <label key={option.id} className={styles.radioLabel}>
              <input
                type="radio"
                name="hired"
                value={option.id}
                checked={selected === option.id}
                onChange={() => setSelected(option.id)}
              />
              {option.name}
            </label>
          ))}
        </div>
        <div className={styles.options}>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="hired"
              value="someone_else"
              checked={selected === "someone_else"}
              onChange={() => setSelected("someone_else")}
            />
            Someone not on Localists
          </label>
        </div>
        <div className={styles.buttonRow}>
          <button onClick={closeModal} className={styles.cancelBtn}>
            Cancel
          </button>
          <button onClick={handleSubmit} className={styles.submitBtn}>
            {addSubmitLeadLoader ? (
              <Spin
                indicator={<LoadingOutlined spin style={{ color: "white" }} />}
              />
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HiredProfessional;
