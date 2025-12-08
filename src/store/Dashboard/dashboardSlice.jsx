import { createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Api/axiosInstance";

const initialState = {
  dashboardData: [],
  dashboardLoader: false,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: initialState,
  reducers: {
    setDashboardList(state, action) {
      state.dashboardData = action.payload;
    },
    setDashboardListLoader(state, action) {
      state.dashboardLoader = action.payload;
    },
  },
});

export const getDashboardListData = () => {
  return async (dispatch) => {
    dispatch(setDashboardListLoader(true));
    try {
      const response = await axiosInstance.get(
        `users/get-seller-dashboard-stats`
      );
      if (response) {
        dispatch(setDashboardList(response?.data?.data));
      }
    } catch (error) {
    } finally {
      dispatch(setDashboardListLoader(false));
    }
  };
};

export const { setDashboardList, setDashboardListLoader } =
  dashboardSlice.actions;

export default dashboardSlice.reducer;
