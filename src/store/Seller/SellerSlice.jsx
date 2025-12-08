import { createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Api/axiosInstance";

const initialState = {
  notificationList: [],
  notificationLoader: false,
  addNotificationLoader: false,
};

export const getNotificationData = (NotificationData) => {
  return async (dispatch) => {
    dispatch(setNotificationLoader(true));
    try {
      const response = await axiosInstance.post(
        `notification/get-notification-settings`,
        NotificationData
      );
      if (response) {
        dispatch(setGetNotificationData(response?.data?.data));
        return response.data;
      }
    } catch (error) {
    } finally {
      dispatch(setNotificationLoader(false));
    }
  };
};

export const addNotificationData = (addNotificationData) => {
  return async (dispatch) => {
    dispatch(setAddNotificationLoader(true));
    try {
      const response = await axiosInstance.post(
        `notification/add-update-notification-settings`,
        addNotificationData
      );

      if (response) {
        dispatch(setGetNotificationData(response?.data?.data));
        return response.data;
      }
    } catch (error) {
    } finally {
      dispatch(setAddNotificationLoader(false));
    }
  };
};

const sellerSlice = createSlice({
  name: "seller",
  initialState: initialState,
  reducers: {
    setGetNotificationData(state, action) {
      state.notificationList = action.payload;
    },
    setNotificationLoader(state, action) {
      state.notificationLoader = action.payload;
    },
    setAddNotificationLoader(state, action) {
      state.addNotificationLoader = action.payload;
    },
  },
});

export const {
  setAddNotificationLoader,
  setNotificationLoader,
  setGetNotificationData,
} = sellerSlice.actions;

export default sellerSlice.reducer;
