import { configureStore } from "@reduxjs/toolkit";
import findJobSlice from "./FindJobs/findJobSlice";
import authSlice from "./Auth/authSlice";
import buyerSlice from "./Buyer/BuyerSlice";
import sellerSlice from "./Seller/SellerSlice";
import notificationReducer from "./Seller/notificationService";
import leadSettingSlice from "./LeadSetting/leadSettingSlice";
import suggestQuestionsSlice from "./LeadSetting/SuggestQuestionSlice";
import myprofileSlice from "./MyProfile/myProfileSlice";
import myCreditSlice from "./MyProfile/MyCredit/MyCreditSlice";
import companyLook from "./Company/companyLookup";
import dashboardSlice from "./Dashboard/dashboardSlice";

export const reducers = {
  findJobs: findJobSlice,
  auth: authSlice,
  buyer: buyerSlice,
  seller: sellerSlice,
  notification: notificationReducer,
  leadSetting: leadSettingSlice,
  suggestQuestion: suggestQuestionsSlice,
  myProfile: myprofileSlice,
  companyLook: companyLook,
  myCredit: myCreditSlice,
  dashboard: dashboardSlice,
};

// Factory to create a fresh store, accepts preloadedState for SSR hydration
export const createStore = (preloadedState = {}) =>
  configureStore({
    reducer: reducers,
    preloadedState,
  });

// Default singleton store for CSR (no preloadedState here)
const store = createStore();

export default store;
