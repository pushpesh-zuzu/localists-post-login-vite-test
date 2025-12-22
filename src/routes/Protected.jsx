import { Navigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getCookie } from "../utils/getCookies";
import { setUserToken } from "../store/Auth/authSlice";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const dispatch = useDispatch();

  // Cookies always read at top
  const token = getCookie("barkToken");
  const userDataStr = getCookie("barkUserToken");

  let userData = null;
  try {
    userData = userDataStr ? userDataStr : null;
  } catch (e) {
    console.error("Invalid JSON in cookie");
  }

  const [rehydrated, setRehydrated] = useState(false);

  // 1st Hook (ALWAYS on top)
  useEffect(() => {
    const timeout = setTimeout(() => setRehydrated(true), 150);
    return () => clearTimeout(timeout);
  }, []);

  // 2nd Hook (ALWAYS on top)
  useEffect(() => {
    if (userData) {
      dispatch(setUserToken(userData));
    }
  }, [userData, dispatch]);

  if (!rehydrated) {
    return <div style={{ minHeight: "40vh" }}></div>;
  }

  const isAuthenticated = token !== "undefined" ? Boolean(token) : false;
  const baseURL = import.meta.env.VITE_COOKIE_DOMAIN;
  if (!isAuthenticated) {
    window.location.href = `${baseURL}en/gb/login`;
    return null;
  }

  return children;
};

export default ProtectedRoute;
