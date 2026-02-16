import React, { useEffect, useRef, useMemo, useState } from "react";
import { RouterProvider } from "react-router-dom";
import createAppRouter from "./routes/Router";
import "react-toastify/dist/ReactToastify.css";
const LazyToastContainer = React.lazy(() =>
  import("react-toastify").then((m) => ({ default: m.ToastContainer }))
);
import { useSelector, useDispatch } from "react-redux";
import { Helmet } from "react-helmet-async";
import FullScreenSpinner from "./component/common/fullScreenSpinner/FullScreenSpinner";
import LeadBuyerHelpModal from "./component/common/LeadBuyerHelpModal/LeadBuyerHelpModal";
import { getDashboardListData } from "./store/Dashboard/dashboardSlice";


function App({ initialUrl, hostname, createRouterFactory }) {
  const dispatch = useDispatch()
  const { selectedServiceFormData, registerStep } = useSelector(
    (state) => state.findJobs
  );
  const { userToken } = useSelector((state) => state.auth);
  const { registerToken } = useSelector((state) => state.findJobs);
  const { dashboardData } = useSelector((state) => state.dashboard);

  const [showLeadBuyerPopup, setShowLeadBuyerPopup] = useState(false);
  const dashboardFetchedRef = useRef(false);
  const popupTriggeredRef = useRef(false);

  // console.log("dashboardList", userToken, dashboardData?.account_details, showLeadBuyerPopup)

  useEffect(() => {
    if (userToken && !dashboardFetchedRef.current) {
      dashboardFetchedRef.current = true;
      dispatch(getDashboardListData());
    }
  }, [userToken, dispatch]);

  useEffect(() => {
    if ([1, 2, 3, 4].includes(registerStep)) {
      const formData = {
        ...selectedServiceFormData,
        auto_bid: selectedServiceFormData?.auto_bid ? 1 : 0,
        nation_wide: selectedServiceFormData?.nation_wide ? 1 : 0,
        is_online: selectedServiceFormData?.is_online ? 1 : 0,
        active_status: 1,
        user_type: 1,
        loggedUser: 1,
        cities: selectedServiceFormData?.city,
        form_status: 0,
      };

      const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = "";
        localStorage.setItem("unsavedData", JSON.stringify(formData));
      };

      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, [registerStep, selectedServiceFormData]);

  useEffect(() => {
    const unsaved = localStorage.getItem("unsavedData");
    if (unsaved) {
      fetch(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}users/registration`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: unsaved,
        }
      )
        .then(() => localStorage.removeItem("unsavedData"))
        .catch((err) => console.error("Failed to save abandoned data", err));
    }
  }, []);

  useEffect(() => {
    const planType = dashboardData?.account_details?.plan_type;

    if (
      userToken &&
      planType === "None" &&
      !popupTriggeredRef.current &&
      !sessionStorage.getItem("leadBuyerPopup")

    ) {
      popupTriggeredRef.current = true;

      setTimeout(() => {
        setShowLeadBuyerPopup(true);
        sessionStorage.setItem("leadBuyerPopup", "true");
      }, 30000); // change to 30000 later
    }
  }, [userToken, dashboardData]);

  const routerFactory = createRouterFactory || createAppRouter;
  const router = useMemo(
    () => routerFactory(initialUrl),
    [routerFactory, initialUrl]
  );

  const isDevEnvironment =
    typeof window !== "undefined"
      ? window.location.hostname === "dev.localists.com"
      : hostname === "dev.localists.com";

  const isPs1Environment =
    typeof window !== "undefined"
      ? window.location.hostname === "ps1.localists.com"
      : hostname === "ps1.localists.com";

  const isReactLocalist =
    typeof window !== "undefined"
      ? window.location.hostname === "react.localists.com"
      : hostname === "react.localists.com";

  useEffect(() => {
    !userToken &&
      !registerToken &&
      localStorage.setItem("isRegistrationComplete", "false");
  }, [userToken, registerToken]);
  return (
    <>
      {(isDevEnvironment || isPs1Environment || isReactLocalist) && (
        <Helmet>
          <meta name="robots" content="noindex" />
        </Helmet>
      )}
      <React.Suspense fallback={<FullScreenSpinner />}>
        {showLeadBuyerPopup && (
          <LeadBuyerHelpModal onClose={() => setShowLeadBuyerPopup(false)} />
        )}
        <RouterProvider router={router} />
      </React.Suspense>
      {typeof window !== "undefined" && (
        <React.Suspense fallback={null}>
          <LazyToastContainer />
        </React.Suspense>
      )}
    </>
  );
}

export default App;
