import { createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Api/axiosInstance";

const initialState = {
  suggestQuestionsLoader: false,
};

export const suggestQuestions = (suggestQuestionsData) => {
  return async (dispatch) => {
    dispatch(setSuggestQuestionsLoader(true));
    try {
      const response = await axiosInstance.post(
        `users/add-suggested-que`,
        suggestQuestionsData
      );

      if (response?.data?.success) {
        return response.data;
      } else {
        throw new Error(response?.data?.message);
      }
    } catch (error) {
      throw error;
    } finally {
      dispatch(setSuggestQuestionsLoader(false));
    }
  };
};

const SuggestQuestionSlice = createSlice({
  name: "suggestQuestion",
  initialState: initialState,
  reducers: {
    setSuggestQuestionsLoader(state, action) {
      state.suggestQuestionsLoader = action.payload;
    },
  },
});

export const { setSuggestQuestionsLoader } = SuggestQuestionSlice.actions;

export default SuggestQuestionSlice.reducer;
