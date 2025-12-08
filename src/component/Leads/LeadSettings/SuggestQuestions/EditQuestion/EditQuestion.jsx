import React, { useEffect, useState } from "react";
import styles from "./EditQuestion.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { leadPreferences } from "../../../../../store/LeadSetting/leadSettingSlice";
import { suggestQuestions } from "../../../../../store/LeadSetting/SuggestQuestionSlice";
import { showToast } from "../../../../../utils";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const EditQuestion = () => {
  const [editIndex, setEditIndex] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [editedQuestions, setEditedQuestions] = useState([]);
  const [answerType, setAnswerType] = useState("");
  const [suggestedAnswers, setSuggestedAnswers] = useState([]);

  const dispatch = useDispatch();
  const location = useLocation();
  const serviceId = location.state?.serviceId;
  const { leadPreferenceData } = useSelector((state) => state.leadSetting);
  const { userToken } = useSelector((state) => state.auth);
  const { suggestQuestionsLoader } = useSelector(
    (state) => state.suggestQuestion
  );
  const navigate = useNavigate();

  const onChange = (e) => {
    const type = e.target.value;
    setAnswerType(type);
    setSuggestedAnswers(
      type === "checkbox" || type === "selectbox" ? [""] : []
    );
  };

  useEffect(() => {
    const data = {
      user_id: userToken?.remeber_tokens,
      service_id: serviceId,
    };
    dispatch(leadPreferences(data));
  }, []);

  useEffect(() => {
    if (leadPreferenceData?.length > 0) {
      setEditedQuestions(leadPreferenceData.map((item) => ({ ...item })));
    }
  }, [leadPreferenceData]);

  const handleEditClick = (index) => {
    setEditIndex(index);
    const currentQuestion = editedQuestions[index];
    setEditedText(currentQuestion.questions);
    setAnswerType(currentQuestion?.answer_type || "");

    if (
      currentQuestion?.answer_type === "checkbox" ||
      currentQuestion?.answer_type === "selectbox"
    ) {
      const answers = (currentQuestion?.answer || "")
        .split(",")
        .filter(Boolean);
      setSuggestedAnswers(answers.length > 0 ? answers : [""]);
    } else {
      setSuggestedAnswers([]);
    }
  };

  const handleInputChange = (e) => {
    setEditedText(e.target.value);
  };

  const handleSaveEdit = () => {
    if (editIndex !== null) {
      const updated = [...editedQuestions];
      updated[editIndex].questions = editedText;

      const editedItem = updated[editIndex];

      setEditedQuestions(updated);
      setEditIndex(null);
      setEditedText("");

      handleEditQuestion(
        editedItem.id,
        editedItem.questions,
        answerType,
        suggestedAnswers.join(",")
      );
    }
  };

  const handleEditQuestion = (questionId, questionText, type, answers) => {
    const editData = {
      user_id: userToken?.remeber_tokens,
      service_id: serviceId,
      type: "edit",
      question_id: questionId,
      question: questionText,
      answer_type: type,
      answer: answers,
      reason: "",
    };

    dispatch(suggestQuestions(editData)).then((result) => {
      if (result?.success) {
        showToast("success", result?.message);
      }
      navigate("/settings/leads/my-services");
    });
  };

  return (
    <div className={styles.parentContainer}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Edit a current question</h2>
        <p className={styles.subheading}>
          Which question would you like us to change?
        </p>

        <div className={styles.card}>
          {editedQuestions.map((question, index) =>
            editIndex === null || editIndex === index ? (
              <div
                key={index}
                className={`${styles.questionItem} ${
                  editIndex === index ? styles.noBorder : ""
                }`}
              >
                {editIndex === index ? (
                  <div className={styles.editBlock}>
                    <div className={styles.editInputBlock}>
                      <input
                        className={styles.input}
                        value={editedText}
                        onChange={handleInputChange}
                        autoFocus
                      />
                      <label className={styles.label}>Type of Answer</label>
                      <select
                        className={styles.dropdown}
                        value={answerType}
                        onChange={onChange}
                      >
                        <option value="">Select Answer Type</option>
                        <option value="checkbox">Checkbox</option>
                        <option value="selectbox">Selectbox</option>
                        <option value="short_text">Short Text</option>
                        <option value="long_text">Long Text</option>
                        <option value="date">Date</option>
                      </select>
                    </div>

                    {(answerType === "checkbox" ||
                      answerType === "selectbox") && (
                      <div className={styles.suggestedAnswersBlock}>
                        {suggestedAnswers.map((ans, idx) => (
                          <div key={idx} className={styles.answerRow}>
                            <label className={styles.label}>
                              Suggested Answers
                            </label>
                            <div className={styles.answerInputBlock}>
                              <input
                                className={styles.answerInput}
                                value={ans}
                                onChange={(e) => {
                                  const updated = [...suggestedAnswers];
                                  updated[idx] = e.target.value;
                                  setSuggestedAnswers(updated);
                                }}
                              />
                              <span
                                className={styles.removeBtn}
                                onClick={() => {
                                  const updated = [...suggestedAnswers];
                                  updated.splice(idx, 1);
                                  setSuggestedAnswers(
                                    updated.length ? updated : [""]
                                  );
                                }}
                              >
                                ❌
                              </span>
                            </div>
                          </div>
                        ))}

                        <div className={styles.addAnswerInput}>
                          <button
                            type="button"
                            className={styles.addAnswerBtn}
                            onClick={() => {
                              setSuggestedAnswers([...suggestedAnswers, ""]);
                            }}
                          >
                            Add Answer
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    onClick={() => handleEditClick(index)}
                    className={styles.questionRow}
                  >
                    <span>{question.questions}</span>
                    <span className={styles.arrow}>&#8250;</span>
                  </div>
                )}
              </div>
            ) : null
          )}

          {editIndex !== null && (
            <div className={styles.buttonGroup}>
              <button
                className={styles.backButton}
                onClick={() => setEditIndex(null)}
                disabled={suggestQuestionsLoader}
              >
                Back
              </button>
              <button className={styles.saveButton} onClick={handleSaveEdit}>
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
          )}
        </div>
      </div>
    </div>
  );
};

export default EditQuestion;
