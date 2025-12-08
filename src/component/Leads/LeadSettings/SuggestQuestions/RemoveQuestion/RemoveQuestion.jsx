import { useEffect, useState } from "react";
import styles from "./RemoveQuestion.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { leadPreferences } from "../../../../../store/LeadSetting/leadSettingSlice";
import { suggestQuestions } from "../../../../../store/LeadSetting/SuggestQuestionSlice";
import { showToast } from "../../../../../utils";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const RemoveQuestion = () => {
  const [selected, setSelected] = useState("");
  const [reason, setReason] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const serviceId = location.state?.serviceId;
  const { leadPreferenceData } = useSelector((state) => state.leadSetting);
  const { userToken } = useSelector((state) => state.auth);
  const { suggestQuestionsLoader } = useSelector(
    (state) => state.suggestQuestion
  );

  useEffect(() => {
    const data = {
      user_id: userToken?.remeber_tokens,
      service_id: serviceId,
    };
    dispatch(leadPreferences(data));
  }, []);
  const handleSubmit = () => {
    const selectedQuestion = leadPreferenceData.find((q) => q.id === selected);

    const removeData = {
      user_id: userToken?.remember_tokens,
      service_id: serviceId,
      type: "remove",
      question_id: selected,
      question: selectedQuestion?.questions,
      reason,
      answer_type: "",
      answer: "",
    };

    dispatch(suggestQuestions(removeData)).then((result) => {
      if (result?.success) {
        showToast("success", result?.message);
      }
      navigate("/settings/leads/my-services");
    });
  };
  return (
    <div className={styles.parentContainer}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Suggest a question to remove</h2>
        <p className={styles.subheading}>
          Which question would you like us to remove?
        </p>

        <div className={styles.card}>
          <div className={styles.radioGroup}>
            {leadPreferenceData?.map((question, index) => (
              <label key={index} className={styles.radioLabel}>
                <input
                  type="radio"
                  name="question"
                  value={question.id}
                  checked={selected === question.id}
                  onChange={() => setSelected(question?.id)}
                />
                <span className={styles.radioText}>{question?.questions}</span>
              </label>
            ))}
          </div>

          <div className={styles.reasonContainer}>
            <label className={styles.label}>Reason</label>
            <textarea
              className={styles.textarea}
              placeholder="Why should we remove this question?"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          <div className={styles.buttonGroup}>
            <button
              className={styles.backButton}
              onClick={() => navigate(-1)}
              disabled={suggestQuestionsLoader}
            >
              Back
            </button>
            <button className={styles.saveButton} onClick={handleSubmit}>
              {suggestQuestionsLoader ? (
                <Spin
                  indicator={
                    <LoadingOutlined spin style={{ color: "white" }} />
                  }
                />
              ) : (
                "Save"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoveQuestion;
