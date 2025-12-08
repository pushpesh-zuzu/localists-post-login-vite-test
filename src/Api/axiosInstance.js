import axios from "axios";
import { clearAuthData } from "../utils";
import { getBarkToken } from "../utils/getCookies";
export const baseURL = import.meta.env.VITE_REACT_APP_API_BASE_URL;
export const googleAPI = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
export const OAuth_Client_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token =
      getBarkToken() ||
      JSON.parse(localStorage.getItem("registerTokens")) ||
      JSON.parse(localStorage.getItem("createRequestToken")) ||
      null;
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error?.response?.status === 401) {
      clearAuthData();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
