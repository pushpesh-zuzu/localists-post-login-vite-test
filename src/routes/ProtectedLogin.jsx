// src/routes/ProtectedLogin.jsx
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import LoginPage from "../pages/authentication/LoginPage";

const ProtectedLogin = () => {
  const location = useLocation();
  const { userToken } = useSelector((state) => state.auth);
  const { registerToken } = useSelector((state) => state.findJobs);

  // useEffect(() => {
  //   if (userToken || registerToken) {
  //     toast.info("You're already logged in.");
  //   }
  // }, [userToken, registerToken]);

  if (userToken || registerToken) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <LoginPage />;
};

export default ProtectedLogin;
