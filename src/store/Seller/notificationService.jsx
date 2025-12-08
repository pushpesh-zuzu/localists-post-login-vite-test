import axiosInstance from "../../Api/axiosInstance";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notificationList: [],
  lastId: null,
  notificationLoader: false,
  addNotificationLoader: false,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotificationList: (state, action) => {
      state.notificationList = action.payload.data;
      state.lastId = action.payload.lastId;
    },
    setNotificationLoader: (state, action) => {
      state.notificationLoader = action.payload;
    },
  },
});

export const { setNotificationList, setNotificationLoader } =
  notificationSlice.actions;
export default notificationSlice.reducer;

export const getNotificationList = (payload) => {
  return async (dispatch) => {
    dispatch(setNotificationLoader(true));
    try {
      const response = await axiosInstance.post(
        "notification/fetch-all-notifications",
        payload
      );
      const data = response?.data?.data || [];
      const lastId = response?.data?.last_id || [];
      dispatch(setNotificationList({ data, lastId }));
      return data;
    } catch (err) {
      console.error(
        "Notification fetch failed:",
        err?.response?.data?.message || err.message
      );
    } finally {
      dispatch(setNotificationLoader(false));
    }
  };
};

export const markNotificationsAsRead = (payload) => {
  return async (dispatch) => {
    try {
      await axiosInstance.post(`notification/mark-all-read`, payload);
      dispatch(getNotificationList(payload));
    } catch (error) {}
  };
};
