import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./store/index.js";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { OAuth_Client_ID } from "./Api/axiosInstance.js";
import { initGTM } from "./utils/gtm.jsx";

initGTM("GTM-TKD2TB3J");

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      {/* <GoogleOAuthProvider clientId={OAuth_Client_ID}> */}
      <App />
      {/* </GoogleOAuthProvider> */}
    </Provider>
  </StrictMode>
);
