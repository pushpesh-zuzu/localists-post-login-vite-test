import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { showToast } from "../utils";
import NavigationDetectorWithConfirmations from "../component/common/navigationDetected/NavigationDetectorWithConfirmations";
import NavigationDetectorDesktop from "../component/common/navigationDetected/NavigationDetectorDesktop";

/**
 * SSR-safe ProtectedRoute
 * - On the server, always render children to avoid SSR/CSR mismatches.
 * - On the client, wait until mounted before deciding to redirect.
 * - When unauthenticated, redirect to login and preserve "from" location.
 */
const ProtectedRoutePPC = ({ children }) => {
  const location = useLocation();
  const { userToken } = useSelector((state) => state.auth);
  const { registerToken } = useSelector((state) => state.findJobs);
  const { requestUserId } = useSelector((state) => state.buyer);

  const toastShown = useRef(false);
  // Avoid redirecting during server render to prevent hydration mismatches
  const isServer = typeof window === "undefined";
  if (isServer) {
    return children;
  }

  // Ensure we only decide after first client mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const isRegistrationComplete = localStorage.getItem("isRegistrationComplete");
  const isAuthenticated = Boolean(userToken || registerToken);

  useEffect(() => {
    if (mounted && isAuthenticated && !toastShown.current) {
      // showToast("error", "Please log in to continue.");
      toastShown.current = true;
    }
  }, [mounted, isAuthenticated]);

  // While mounting, render a non-empty placeholder to avoid a blank outlet
  if (!mounted) {
    return <div style={{ minHeight: "40vh" }} />;
  }

  if (isAuthenticated && isRegistrationComplete === "true") {
    return <Navigate to="/buyers/create" replace state={{ from: location }} />;
  }

  return (
    <>
      {/* {requestUserId === null && (
        <div>
          {window.innerWidth > 768 && typeof window !== "undefined" ? (
            <NavigationDetectorDesktop />
          ) : (
            <NavigationDetectorWithConfirmations />
          )}
        </div>
      )} */}
      {children}
    </>
  );
};

export default ProtectedRoutePPC;
