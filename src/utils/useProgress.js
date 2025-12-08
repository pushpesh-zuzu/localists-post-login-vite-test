import { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getProgressPercentageAPI,
  setQuestionsForProgress,
} from "../store/Buyer/BuyerSlice";

export const useProgress = (serviceId) => {
  const dispatch = useDispatch();

  const { questionsForProgress } = useSelector((state) => state.buyer);
  const [progressPercentage, setProgressPercentage] = useState(0);

  // Remove question by number
  const removeQuestionByNumber = useCallback(
    (questionNo) => {
      const cleanedNo = Number(String(questionNo).trim());
      const updatedList = questionsForProgress.filter((item) => {
        const cleanedItemNo = Number(String(item?.number).trim());
        return cleanedItemNo !== cleanedNo;
      });
      // console.log(
      //   "Removed Question Number:",
      //   questionNo,
      //   "Updated List:",
      //   updatedList
      // );
      dispatch(setQuestionsForProgress(updatedList));
    },
    [questionsForProgress, dispatch]
  );

  // Fetch progress from API
  const getProgress = useCallback(
    async (updatedAnswers) => {
      if (!serviceId) return;
      try {
        const formData = new FormData();
        formData.append("questions", JSON.stringify(updatedAnswers));
        formData.append("service_id", serviceId);

        const response = await dispatch(getProgressPercentageAPI(formData));
        console.log("Progress API Response:", response);

        if (response?.percentage !== undefined) {
          setProgressPercentage(response.percentage);
        }
      } catch (error) {
        console.error("Error fetching progress:", error);
      }
    },
    [dispatch, serviceId]
  );

  // Auto call whenever questionsForProgress changes
  useEffect(() => {
    getProgress(questionsForProgress);
  }, [questionsForProgress, getProgress]);

  return {
    questionsForProgress,
    progressPercentage,
    removeQuestionByNumber,
    getProgress,
  };
};
