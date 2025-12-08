import React, { useEffect, useState } from "react";
import styles from "./NewQuestion.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { suggestQuestions } from "../../../../../store/LeadSetting/SuggestQuestionSlice";
import { CloseOutlined } from "@ant-design/icons";
import { showToast } from "../../../../../utils";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const NewQuestion = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const serviceId = location.state?.serviceId;
  const { userToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { suggestQuestionsLoader } = useSelector(
    (state) => state.suggestQuestion
  );
  const [question, setQuestion] = useState("");
  const [answerType, setAnswerType] = useState("");
  const [suggestedAnswers, setSuggestedAnswers] = useState([""]);

  useEffect(() => {
    // Optional: can be used to fetch existing data
  }, [serviceId]);

  const handleSuggestedChange = (index, value) => {
    const updated = [...suggestedAnswers];
    updated[index] = value;
    setSuggestedAnswers(updated);
  };

  const handleRemoveSuggested = (index) => {
    const updated = suggestedAnswers.filter((_, i) => i !== index);
    setSuggestedAnswers(updated);
  };

  const handleAddSuggested = () => {
    setSuggestedAnswers([...suggestedAnswers, ""]);
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("user_id", userToken?.remember_tokens || "");
    formData.append("question", question);
    formData.append("answer_type", answerType);
    formData.append("service_id", serviceId);
    formData.append("question_id", 0);
    formData.append("type", "add");
    formData.append("reason", "");

    if (answerType === "select" || answerType === "checkbox") {
      const filteredAnswers = suggestedAnswers.filter((a) => a.trim() !== "");
      formData.append("answer", filteredAnswers.join(","));
    } else {
      formData.append("answer", "");
    }

    dispatch(suggestQuestions(formData)).then((result) => {
      if (result?.success) {
        showToast("success", result?.message);
      }
      navigate("/settings/leads/my-services");
    });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Suggest a new question</h2>
      <p className={styles.subtitle}>
        What question would you like to see added to future Branding & Brand
        Management requests?
      </p>

      <div className={styles.card}>
        <div>
          <label className={styles.label}>Question</label>
          <input
            type="text"
            className={styles.input}
            placeholder="Title..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </div>

        <div>
          <label className={styles.label}>Type of answer</label>
          <select
            className={styles.select}
            value={answerType}
            onChange={(e) => setAnswerType(e.target.value)}
          >
            <option value="">Select an option</option>
            <option value="select">Select box</option>
            <option value="checkbox">Check box</option>
            <option value="text">Short open text</option>
            <option value="textarea">Large open text</option>
            <option value="date">Date</option>
          </select>
        </div>

        {(answerType === "select" || answerType === "checkbox") && (
          <div>
            <label className={styles.label}>Suggested Answers</label>
            {suggestedAnswers.map((answer, index) => (
              <div key={index} className={styles.suggestedAnswerRow}>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Suggested answer..."
                  value={answer}
                  onChange={(e) => handleSuggestedChange(index, e.target.value)}
                />
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => handleRemoveSuggested(index)}
                >
                  <CloseOutlined />
                </button>
              </div>
            ))}
            <button
              type="button"
              className={styles.addBtn}
              onClick={handleAddSuggested}
            >
              Add Answer
            </button>
          </div>
        )}

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
                indicator={<LoadingOutlined spin style={{ color: "white" }} />}
              />
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewQuestion;
