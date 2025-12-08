import { createBrowserRouter, createMemoryRouter } from "react-router-dom";
import React, { lazy } from "react";
import MainLayout from "../layouts/MainLayout";
import NotFound from "../pages/NotFound";
import InProgressPage from "../pages/InProgressPage";
import Dashboard from "../component/dashboard/dashboard";
import ProtectedRoute from "./Protected";
import BuyerPanelPage from "../pages/BuyerPanelPage";
import BuyerAccountSettings from "../component/buyerAccountSettings/BuyerAccountSettings";
import BuyerNotification from "../component/buyerPanel/buyerNotification/BuyerNotification";
import Leads from "../component/Leads/Leads";
import Settings from "../component/settings/Settings";
import LeadSetting from "../component/Leads/LeadSetting";
import BidsList from "../component/buyerPanel/PlaceNewRequest/BuyerRegistration/BidsList/BidsList";
import ProtectedLogin from "./ProtectedLogin";
import HelpCenterPage from "../pages/HelpCenterPage";
import SuggestQuestions from "../component/Leads/LeadSettings/SuggestQuestions/SuggestQuestions";
import PricingPage from "../pages/PricingPage";
import NewQuestion from "../component/Leads/LeadSettings/SuggestQuestions/NewQuestion/NewQuestion";
import EditQuestion from "../component/Leads/LeadSettings/SuggestQuestions/EditQuestion/EditQuestion";
import RemoveQuestion from "../component/Leads/LeadSettings/SuggestQuestions/RemoveQuestion/RemoveQuestion";
import ManualBidList from "../component/buyerPanel/PlaceNewRequest/BuyerRegistration/ManualBidList/ManualBidList";
import LeadProfileData from "../component/Leads/LeadLists/LeadProfileView/LeadProfileView";
import MyResponse from "../component/myResponses/MyResponse";
import SaveForLater from "../component/saveForLater/SaveForLater";
import ViewProfile from "../component/myResponses/ViewProfile/viewProfile";
import MyProfile from "../component/MyProfile/MyProfile";
import AccountDetails from "../component/AccountDetails/AccountDetails";
import MyCredit from "../component/MyCredit/MyCredit";
import ViewProfiles from "../component/ViewProfile";
import MyCredits from "../component/MyCredit/MyCredit/MyCredit";
import InvoiceAndBilling from "../component/MyCredit/InvoiceAndBilling/InvoiceAndBilling";
import MyPaymentDetails from "../component/MyCredit/MyPaymentDetails/MyPaymentDetails";
import EmailNotification from "../component/SellerNotification/EmailNotification/EmailNotification";
import BrowserNotification from "../component/SellerNotification/BrowserNotification/BrowserNotification";
import BuyerFirstStep from "../component/buyerPanel/buyerClose/buyerCloseStep/buyerFirstStep";
import BuyerSecondStep from "../component/buyerPanel/buyerClose/buyerSecondStep/BuyerSecond";

import WhatServiceYouNeed from "../component/buyerPanel/PlaceNewRequest/BuyerRegistration/WhatServiceYouNeed/WhatServiceYouNeed";
import ConversionRedirect from "../component/buyerPanel/PlaceNewRequest/BuyerRegistration/ConversionRedirect/ConversionRedirect";
import ThankuPage from "../component/common/ThankuPage/ThankuPage";
import ContactUs from "../component/ContactUs/ContactUs";
const baseURL = import.meta.env.VITE_PRELOGIN_URL;
const routes = [
 
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        path: "/en/gb",
        loader: () => {
          window.location.href = baseURL;
          return null;
        },
      },
      {
        path: "en/gb/contact-us",
        element: <ContactUs />,
      },
      {
        index: true,
        path: "/",
        loader: () => {
          window.location.href = baseURL;
          return null;
        },
      },
      {
        path: "thank-you",
        element: <ThankuPage />,
      },

      {
        path: "conversion/:requestId",
        element: <ConversionRedirect />,
      },
      {
        path: "/buyers/create",
        element: (
          <ProtectedRoute>
            <BuyerPanelPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/user/settings",
        element: (
          <ProtectedRoute>
            <BuyerAccountSettings />
          </ProtectedRoute>
        ),
      },
      {
        path: "/user/notification",
        element: (
          <ProtectedRoute>
            <BuyerNotification />
          </ProtectedRoute>
        ),
      },
      {
        path: "sellers/dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "sellers/leads",
        element: (
          <ProtectedRoute>
            <Leads />
          </ProtectedRoute>
        ),
      },
      {
        path: "/leads",
        element: (
          <ProtectedRoute>
            <Leads />
          </ProtectedRoute>
        ),
      },
      {
        path: "/settings",
        element: (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        ),
      },
      {
        path: "/settings/profile/my-profile",
        element: (
          <ProtectedRoute>
            <MyProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/settings/profile/account-details",
        element: (
          <ProtectedRoute>
            <AccountDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "/settings/leads/my-services",
        element: (
          <ProtectedRoute>
            <LeadSetting />
          </ProtectedRoute>
        ),
      },
      {
        path: "/bids-list/:requestId",
        element: (
          <ProtectedRoute>
            <BidsList />
          </ProtectedRoute>
        ),
      },
      {
        path: "/bids-list/reply/:requestId",
        element: (
          <ProtectedRoute>
            <ManualBidList />
          </ProtectedRoute>
        ),
      },
      { path: "/help-center", element: <HelpCenterPage /> },

      {
        path: "/feedback/questions",
        element: (
          <ProtectedRoute>
            <SuggestQuestions />
          </ProtectedRoute>
        ),
      },
      {
        path: "/feedback/questions/new",
        element: (
          <ProtectedRoute>
            <NewQuestion />
          </ProtectedRoute>
        ),
      },
      {
        path: "/feedback/questions/edit",
        element: (
          <ProtectedRoute>
            <EditQuestion />
          </ProtectedRoute>
        ),
      },
      {
        path: "/feedback/questions/remove",
        element: (
          <ProtectedRoute>
            <RemoveQuestion />
          </ProtectedRoute>
        ),
      },
      {
        path: "/lead/profile-view/:profileId",
        element: (
          <ProtectedRoute>
            <LeadProfileData />
          </ProtectedRoute>
        ),
      },
      {
        path: "/sellers/leads/my-responses",
        element: (
          <ProtectedRoute>
            <MyResponse />
          </ProtectedRoute>
        ),
      },
      {
        path: "sellers/leads/save-for-later",
        element: (
          <ProtectedRoute>
            <SaveForLater />
          </ProtectedRoute>
        ),
      },
      {
        path: "/pending/view-profile/:profileId",
        element: (
          <ProtectedRoute>
            <ViewProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/mycredit",
        element: (
          <ProtectedRoute>
            <MyCredit />
          </ProtectedRoute>
        ),
      },
      {
        path: "/settings/billing/my-credits",
        element: (
          <ProtectedRoute>
            <MyCredits />
          </ProtectedRoute>
        ),
      },
      {
        path: "/settings/billing/invoice-billing-details",
        element: (
          <ProtectedRoute>
            <InvoiceAndBilling />
          </ProtectedRoute>
        ),
      },
      {
        path: "/settings/billing/payment-details",
        element: (
          <ProtectedRoute>
            <MyPaymentDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "/view-profile/:company_name/:requestId",
        element: (
          <ViewProfiles />
        ),
      },
      {
        path: "/review/:profileId",
        element: (
          <ViewProfiles />
        ),
      },
      {
        path: "/settings/notifications/e-mail-notification",
        element: (
          <ProtectedRoute>
            <EmailNotification />
          </ProtectedRoute>
        ),
      },
      {
        path: "/settings/notifications/browser-notification",
        element: (
          <ProtectedRoute>
            <BrowserNotification />
          </ProtectedRoute>
        ),
      },
      {
        path: "/inprogress",
        element: (
          <ProtectedRoute>
            <InProgressPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/buyer-close/:id",
        element: (
          <ProtectedRoute>
            <BuyerFirstStep />
          </ProtectedRoute>
        ),
      },
      {
        path: "/buyer-second-step",
        element: (
          <ProtectedRoute>
            <BuyerSecondStep />
          </ProtectedRoute>
        ),
      },
      {
        path: "/whats-service",
        element: (
          <ProtectedRoute>
            <WhatServiceYouNeed />
          </ProtectedRoute>
        ),
      },
      { path: "*", element: <NotFound /> },
    ],
  },
];

export function createAppRouter(initialUrl) {
  if (typeof window === "undefined") {
    return createMemoryRouter(routes, {
      initialEntries: [initialUrl || "/"],
    });
  }
  return createBrowserRouter(routes);
}

export default createAppRouter;
