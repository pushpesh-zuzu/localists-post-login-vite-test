import { createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Api/axiosInstance";
import { showToast } from "../../utils";

const initialState = {
  preferenceLoader: false,
  preferenceList: [],
  leadPreferenceLoader: false,
  serviceLoader: false,
  leadPreferenceData: [],
  leadRequestLoader: false,
  leadRequestList: [],
  getlocationData: [],
  autoBidList: [],
  removeLoader: false,
  bidListLoader: false,
  isDirty: false,
  removeLocationLoader: false,
  serviceWiseData: [],
  autoBidListData: [],
  manualBidLoader: false,
  autobidLoader: false,
  getCreditLoader: false,
  getCreditListData: [],
  filterListData: [],
  profileLeadViewData: {},
  creditPlanList: [],
  saveLaterLoader: false,
  saveForLaterDataList: [],
  totalCredit: {},
  purchasedData: {},
  sellerRecommended: [],
  filters: {
    keyword: "",
    unread: false,
    leadSpotlights: [],
    buyerActions: [],
    submittedWhen: "",
    selectedServices: [],
    location: "",
    credits: [],
    contactPreferences: [],
  },
  sevenDaysAutoBidLoader: false,
  sevenDays: [],
  onlineRemote: [],
  sevenPausedData: {},
  getOnlineRemote: {},
  getPendingLeadList: [],
  getHiredLeadList: [],
  getActivies: [],
  getSwitcgAutoBidData: {},
  addSubmitLeadLoader: false,
  getSellerNotes: {},
  sellerNotesLoader: false,
  purchasePendingList: [],
  data: [],
  leadListLoader: false,
  ratingFilterData: [],
  expandRadiusLoader: false,
  viewProfileData: {},
  reviewProfileData: {},
};

export const getleadPreferencesList = (serviceId) => {
  return async (dispatch) => {
    dispatch(setServiceListLoader(true));
    try {
      const response = await axiosInstance.post(
        `users/get-services`,
        serviceId
      );
      if (response) {
        dispatch(setPreferencesList(response?.data?.data));
      }
    } catch (error) {
    } finally {
      dispatch(setServiceListLoader(false));
    }
  };
};

export const leadPreferencesData = (leadPreferencesData) => {
  return async (dispatch) => {
    dispatch(setleadPreferencesLoader(true));
    try {
      const response = await axiosInstance.post(
        `users/lead-preferences`,
        leadPreferencesData
      );

      if (response) {
        return response.data;
      }
    } catch (error) {
    } finally {
      dispatch(setleadPreferencesLoader(false));
    }
  };
};
export const leadPreferences = (leadPreferencesData) => {
  return async (dispatch) => {
    dispatch(setleadPreferencesListLoader(true));
    try {
      const response = await axiosInstance.post(
        `users/get-lead-preferences`,
        leadPreferencesData
      );

      if (response) {
        dispatch(setLeadPreferenceData(response?.data?.data));
      }
    } catch (error) {
    } finally {
      dispatch(setleadPreferencesListLoader(false));
    }
  };
};
export const isOnlineRemote = (onlineData) => {
  return async (dispatch) => {
    dispatch(setleadPreferencesListLoader(true));
    try {
      const response = await axiosInstance.post(
        `users/online-remote-switch`,
        onlineData
      );

      if (response) {
        dispatch(setOnlineRemoteData(response?.data?.data));
        return response.data;
      }
    } catch (error) {
    } finally {
      dispatch(setleadPreferencesListLoader(false));
    }
  };
};
export const totalCreditData = (totalCreditData) => {
  return async (dispatch) => {
    dispatch(setleadPreferencesListLoader(true));
    try {
      const response = await axiosInstance.post(
        `users/total-credit`,
        totalCreditData
      );
      if (response) {
        dispatch(setTotalCreditData(response?.data?.data));
      }
    } catch (error) {
    } finally {
      dispatch(setleadPreferencesListLoader(false));
    }
  };
};
export const getLeadRequestList = (leadRequestData) => {
  return async (dispatch) => {
    dispatch(setLeadListLoader(true));
    try {
      const response = await axiosInstance.post(
        `users/get-lead-request`,
        leadRequestData
      );
      if (response) {
        dispatch(setLeadRequestListData(response?.data?.data));
        return response.data;
      }
    } catch (error) {
    } finally {
      dispatch(setLeadListLoader(false));
    }
  };
};
export const getLeadFiterApiList = (leadFilterData, isLeads) => {
  return async (dispatch) => {
    dispatch(setLeadListLoader(true));
    try {
      const response = await axiosInstance.post(
        `users/sort-by-credit-value`,
        leadFilterData
      );
      if (response) {
        if (isLeads) {
          dispatch(setSaveForLaterData(response?.data?.data));
        } else {
          dispatch(setLeadRequestListData(response?.data?.data));
        }
        return response.data;
      }
    } catch (error) {
    } finally {
      dispatch(setLeadListLoader(false));
    }
  };
};
export const getLeadProfileRequestList = (leadProfileData) => {
  return async (dispatch) => {
    dispatch(setLeadListProfileLoader(true));
    try {
      const response = await axiosInstance.post(
        `users/get-lead-profile`,
        leadProfileData
      );
      if (response) {
        dispatch(setProfileLeadRequestListData(response?.data?.data));
        return response.data;
      }
    } catch (error) {
    } finally {
      dispatch(setLeadListProfileLoader(false));
    }
  };
};
export const addServiceLead = (ServiceData) => {
  return async (dispatch) => {
    dispatch(setleadPreferencesListLoader(true));
    try {
      const response = await axiosInstance.post(
        `users/add_service`,
        ServiceData
      );

      if (response) {
        return response.data;
      }
    } catch (error) {
      const errorData = error?.response?.data?.message;

      if (errorData && typeof errorData === "object") {
        Object.values(errorData).forEach((messages) => {
          if (Array.isArray(messages)) {
            messages.forEach((msg) => showToast("error", msg));
          } else {
            showToast("error", messages);
          }
        });
      } else {
        showToast(
          "error",
          errorData || "Something went wrong. Please try again."
        );
      }

      return { success: false, error: errorData };
    } finally {
      dispatch(setleadPreferencesListLoader(false));
    }
  };
};
export const addLocationLead = (locationData) => {
  console.log(locationData);
  return async (dispatch) => {
    dispatch(setleadPreferencesListLoader(true));
    try {
      const response = await axiosInstance.post(
        `users/add_location`,
        locationData
      );
      if (response) {
        return response.data;
      }
    } catch (error) {
      const errorData = error?.response?.data?.message;

      if (errorData && typeof errorData === "object") {
        Object.values(errorData).forEach((messages) => {
          if (Array.isArray(messages)) {
            messages.forEach((msg) => showToast("error", msg));
          } else {
            showToast("error", messages);
          }
        });
      } else {
        showToast(
          "error",
          errorData || "Something went wrong. Please try again."
        );
      }

      return { success: false, error: errorData };
    } finally {
      dispatch(setleadPreferencesListLoader(false));
    }
  };
};
export const editLocationLead = (locationData) => {
  return async (dispatch) => {
    dispatch(setleadPreferencesListLoader(true));
    try {
      const response = await axiosInstance.post(
        `users/edit-location`,
        locationData
      );
      if (response) {
        return response.data;
      }
    } catch (error) {
      const errorData = error?.response?.data?.message;

      if (errorData && typeof errorData === "object") {
        Object.values(errorData).forEach((messages) => {
          if (Array.isArray(messages)) {
            messages.forEach((msg) => showToast("error", msg));
          } else {
            showToast("error", messages);
          }
        });
      } else {
        showToast(
          "error",
          errorData || "Something went wrong. Please try again."
        );
      }

      return { success: false, error: errorData };
    } finally {
      dispatch(setleadPreferencesListLoader(false));
    }
  };
};

export const getLocationLead = (getlocationData) => {
  return async (dispatch) => {
    dispatch(setleadPreferencesListLoader(true));
    try {
      const response = await axiosInstance.post(
        `users/get_user_locations`,
        getlocationData
      );

      if (response) {
        dispatch(setGetLocationData(response?.data?.data));
      }
    } catch (error) {
    } finally {
      dispatch(setleadPreferencesListLoader(false));
    }
  };
};
export const getAutoBid = (bidData) => {
  return async (dispatch) => {
    dispatch(setAutoBidListLoader(true));
    try {
      const response = await axiosInstance.post(`users/manual-leads`, bidData);

      if (response) {
        dispatch(setAutoBidData(response?.data?.data));
      }
    } catch (error) {
    } finally {
      dispatch(setAutoBidListLoader(false));
    }
  };
};
export const getAutoBidData = (autoBidData) => {
  return async (dispatch) => {
    dispatch(setAutoBidLoader(true));
    try {
      const response = await axiosInstance.post(
        `users/autobid-list`,
        autoBidData
      );

      if (response) {
        dispatch(setAutoBidListData(response?.data?.data));
      }
    } catch (error) {
    } finally {
      dispatch(setAutoBidLoader(false));
    }
  };
};
export const removeItemData = (removeData) => {
  return async (dispatch) => {
    dispatch(setRemoveListLoader(true));
    try {
      const response = await axiosInstance.post(
        `users/remove-service`,
        removeData
      );

      if (response) {
        return response.data;
      }
    } catch (error) {
    } finally {
      dispatch(setRemoveListLoader(false));
    }
  };
};
export const getSaveLaterListData = (removeLocationData) => {
  return async (dispatch) => {
    dispatch(setRemoveLocationListLoader(true));
    try {
      const response = await axiosInstance.post(
        `users/get-save-for-later-list`,
        removeLocationData
      );

      if (response) {
        dispatch(setSaveForLaterData(response?.data?.data));
        return response.data;
      }
    } catch (error) {
    } finally {
      dispatch(setRemoveLocationListLoader(false));
    }
  };
};
export const removeItemLocationData = (removeLocationData) => {
  return async (dispatch) => {
    dispatch(setRemoveLocationListLoader(true));
    try {
      const response = await axiosInstance.post(
        `users/remove-location`,
        removeLocationData
      );

      if (response) {
        return response.data;
      }
    } catch (error) {
    } finally {
      dispatch(setRemoveLocationListLoader(false));
    }
  };
};
export const getServiceWiseLocationData = (serviceWiseLocationData) => {
  return async (dispatch) => {
    dispatch(setRemoveLocationListLoader(true));
    try {
      const response = await axiosInstance.post(
        `users/get-service-wise-location`,
        serviceWiseLocationData
      );

      if (response) {
        dispatch(setServiceWiseData(response?.data?.data));
        return response.data;
      }
    } catch (error) {
    } finally {
      dispatch(setRemoveLocationListLoader(false));
    }
  };
};

export const getAddManualBidData = (manualBidData) => {
  return async (dispatch) => {
    dispatch(setManualBidListLoader(true));
    try {
      const response = await axiosInstance.post(
        `users/add-manual-bid`,
        manualBidData
      );

      if (response) {
        dispatch(setServiceWiseData(response?.data?.data));
        return response.data;
      }
    } catch (error) {
      showToast("error", error?.response?.data?.message);
    } finally {
      dispatch(setManualBidListLoader(false));
    }
  };
};
export const getCreditPlanList = () => {
  return async (dispatch) => {
    dispatch(setGetCreditListLoader(true));
    try {
      const response = await axiosInstance.get(`users/get-plans`);
      if (response) {
        dispatch(setCreditsPlanList(response?.data?.data));
      }
    } catch (error) {
    } finally {
      dispatch(setGetCreditListLoader(false));
    }
  };
};
export const getCreditList = () => {
  return async (dispatch) => {
    dispatch(setGetCreditListLoader(true));
    try {
      const response = await axiosInstance.get(`users/get-credit-list`);
      if (response) {
        dispatch(setCreditsList(response?.data?.data));
      }
    } catch (error) {
    } finally {
      dispatch(setGetCreditListLoader(false));
    }
  };
};

export const getAddMultipleManualBidData = (multiplemanualBidData) => {
  return async (dispatch) => {
    dispatch(setManualBidListLoader(true));
    try {
      const response = await axiosInstance.post(
        `users/add-multiple-manual-bid`,
        multiplemanualBidData
      );

      if (response) {
        dispatch(setServiceWiseData(response?.data?.data));
        return response.data;
      }
    } catch (error) {
      showToast("error", error?.response?.data?.message);
    } finally {
      dispatch(setManualBidListLoader(false));
    }
  };
};

export const getfilterListData = (filterData) => {
  return async (dispatch) => {
    dispatch(setManualBidListLoader(true));
    try {
      const response = await axiosInstance.post(
        `users/leads-by-filter`,
        filterData
      );

      if (response) {
        dispatch(setFilterWiseData(response?.data?.data));
        return response.data;
      }
    } catch (error) {
    } finally {
      dispatch(setManualBidListLoader(false));
    }
  };
};
export const saveForLaterApi = (saveForLaterData) => {
  return async (dispatch) => {
    dispatch(setSaveLaterListLoader(true));
    try {
      const response = await axiosInstance.post(
        `users/save-for-later`,
        saveForLaterData
      );

      if (response) {
        dispatch(setFilterWiseData(response?.data?.data));
        return response.data;
      }
    } catch (error) {
    } finally {
      dispatch(setSaveLaterListLoader(false));
    }
  };
};

export const getSellerRecommendedApi = (saveForLaterData) => {
  return async (dispatch) => {
    dispatch(setSaveLaterListLoader(true));
    try {
      const response = await axiosInstance.post(
        `users/get-seller-recommended-leads`,
        saveForLaterData
      );

      if (response) {
        dispatch(setSellerRecommendedData(response?.data?.data));
        return response.data;
      }
    } catch (error) {
    } finally {
      dispatch(setSaveLaterListLoader(false));
    }
  };
};
export const getSevenWeekBidApi = (SevenDayData) => {
  return async (dispatch) => {
    dispatch(setSevenDaysAutobidLoader(true));
    try {
      const response = await axiosInstance.post(
        `users/seven-days-autobid-pause`,
        SevenDayData
      );

      if (response) {
        dispatch(setSevenDaysData(response?.data?.data));
        return response.data;
      }
    } catch (error) {
      showToast("error", error?.response?.data?.message);
    } finally {
      dispatch(setSevenDaysAutobidLoader(false));
    }
  };
};
export const getSevenWeekPausedBidApi = (SevenPauseData) => {
  return async (dispatch) => {
    dispatch(setSevenDaysAutobidLoader(true));
    try {
      const response = await axiosInstance.post(
        `users/get-seven-days-autobid-pause`,
        SevenPauseData
      );

      if (response) {
        dispatch(setSevenPausedDaysData(response?.data?.data));
        return response.data;
      }
    } catch (error) {
    } finally {
      dispatch(setSevenDaysAutobidLoader(false));
    }
  };
};
export const getOnlineRemoteApi = (remoteData) => {
  return async (dispatch) => {
    dispatch(setSevenDaysAutobidLoader(true));
    try {
      const response = await axiosInstance.post(
        `users/get-online-remote-switch`,
        remoteData
      );

      if (response) {
        dispatch(setGetOnlineRemoteData(response?.data?.data));
        return response.data;
      }
    } catch (error) {
    } finally {
      dispatch(setSevenDaysAutobidLoader(false));
    }
  };
};

export const getPendingLeadDataApi = (remoteData) => {
  return async (dispatch) => {
    dispatch(setSevenDaysAutobidLoader(true));
    try {
      const response = await axiosInstance.post(
        `users/get-pending-leads`,
        remoteData
      );

      if (response) {
        dispatch(setData(response?.data?.data));
        return response.data;
      }
    } catch (error) {
    } finally {
      dispatch(setSevenDaysAutobidLoader(false));
    }
  };
};

export const getHiredLeadDataApi = (remoteData) => {
  return async (dispatch) => {
    dispatch(setSevenDaysAutobidLoader(true));
    try {
      const response = await axiosInstance.post(
        `users/get-hired-leads`,
        remoteData
      );

      if (response) {
        dispatch(setData(response?.data?.data));
        return response.data;
      }
    } catch (error) {
    } finally {
      dispatch(setSevenDaysAutobidLoader(false));
    }
  };
};

export const getAddHiredLeadDataApi = (AddHiredLeadData) => {
  return async (dispatch) => {
    dispatch(setSevenDaysAutobidLoader(true));
    try {
      const response = await axiosInstance.post(
        `users/add-hired-leads`,
        AddHiredLeadData
      );

      if (response) {
        dispatch(setData(response?.data?.data));
        return response.data;
      }
    } catch (error) {
      showToast("error", error?.response?.data?.message);
    } finally {
      dispatch(setSevenDaysAutobidLoader(false));
    }
  };
};

export const getAddSumbitLeadDataApi = (AddSubmitLeadData) => {
  return async (dispatch) => {
    dispatch(setAddSubmitLeadLoader(true));
    try {
      const response = await axiosInstance.post(
        `users/submit-leads`,
        AddSubmitLeadData
      );

      if (response) {
        dispatch(setGetHiredLeadsData(response?.data?.data));
        return response.data;
      }
    } catch (error) {
      showToast("error", error?.response?.data?.message);
    } finally {
      dispatch(setAddSubmitLeadLoader(false));
    }
  };
};
export const getBuyerActivitiesApi = (ActivitiesData) => {
  return async (dispatch) => {
    dispatch(setSevenDaysAutobidLoader(true));
    try {
      const response = await axiosInstance.post(
        `users/buyer-activities`,
        ActivitiesData
      );

      if (response) {
        dispatch(setGetActivitiesData(response?.data?.data));
        return response.data;
      }
    } catch (error) {
      showToast("error", error?.response?.data?.message);
    } finally {
      dispatch(setSevenDaysAutobidLoader(false));
    }
  };
};
export const getBuyerViewProfieApi = (buyerProfileData) => {
  return async (dispatch) => {
    dispatch(setSevenDaysAutobidLoader(true));
    try {
      const response = await axiosInstance.post(
        `users/buyer-view-profile`,
        buyerProfileData
      );

      if (response) {
        dispatch(setGetHiredLeadsData(response?.data?.data));
        return response.data;
      }
    } catch (error) {
      showToast("error", error?.response?.data?.message);
    } finally {
      dispatch(setSevenDaysAutobidLoader(false));
    }
  };
};
export const getBuyerSortByLocationApi = (buyerSortByLocationData) => {
  return async (dispatch) => {
    dispatch(setAutoBidListLoader(true));
    try {
      const response = await axiosInstance.post(
        `users/sort-by-location`,
        buyerSortByLocationData
      );

      if (response) {
        dispatch(setAutoBidData(response?.data?.data));
        return response.data;
      }
    } catch (error) {
      showToast("error", error?.response?.data?.message);
    } finally {
      dispatch(setAutoBidListLoader(false));
    }
  };
};
export const getBuyerSortByResponseApi = (buyerSortByResponseData) => {
  return async (dispatch) => {
    dispatch(setAutoBidListLoader(true));
    try {
      const response = await axiosInstance.post(
        `users/response-time-filter`,
        buyerSortByResponseData
      );

      if (response) {
        dispatch(setAutoBidData(response?.data?.data));
        return response.data;
      }
    } catch (error) {
      showToast("error", error?.response?.data?.message);
    } finally {
      dispatch(setAutoBidListLoader(false));
    }
  };
};
export const sellerResponseStatusApi = (sellerResponseStatusData) => {
  return async (dispatch) => {
    dispatch(setSevenDaysAutobidLoader(true));
    try {
      const response = await axiosInstance.post(
        `users/response-status`,
        sellerResponseStatusData
      );

      if (response) {
        return response.data;
      }
    } catch (error) {
      showToast("error", error?.response?.data?.message);
    } finally {
      dispatch(setSevenDaysAutobidLoader(false));
    }
  };
};
export const switchAutobidApi = (switchAutobidApiData) => {
  return async (dispatch) => {
    dispatch(setSevenDaysAutobidLoader(true));
    try {
      const response = await axiosInstance.post(
        `users/switch-autobid`,
        switchAutobidApiData
      );

      if (response) {
        return response.data;
      }
    } catch (error) {
      showToast("error", error?.response?.data?.message);
    } finally {
      dispatch(setSevenDaysAutobidLoader(false));
    }
  };
};

export const getswitchAutobidApi = (switchAutobidApiData) => {
  return async (dispatch) => {
    dispatch(setSevenDaysAutobidLoader(true));
    try {
      const response = await axiosInstance.post(
        `users/get-switch-autobid`,
        switchAutobidApiData
      );

      if (response) {
        dispatch(setGetSwitchAutoBidData(response?.data?.data));
        return response.data;
      }
    } catch (error) {
      showToast("error", error?.response?.data?.message);
    } finally {
      dispatch(setSevenDaysAutobidLoader(false));
    }
  };
};
export const addSellerNotesApi = (sellerApiData) => {
  return async (dispatch) => {
    dispatch(setSellerNotesLoader(true));
    try {
      const response = await axiosInstance.post(
        `users/seller-notes`,
        sellerApiData
      );

      if (response) {
        return response.data;
      }
    } catch (error) {
      showToast("error", error?.response?.data?.message);
    } finally {
      dispatch(setSellerNotesLoader(false));
    }
  };
};
export const getSellerNotesApi = (sellerData) => {
  return async (dispatch) => {
    dispatch(setSevenDaysAutobidLoader(true));
    try {
      const response = await axiosInstance.post(
        `users/get-seller-notes`,
        sellerData
      );

      if (response) {
        dispatch(setGetSellerNotesData(response?.data?.data));
        return response.data;
      }
    } catch (error) {
      showToast("error", error?.response?.data?.message);
    } finally {
      dispatch(setSevenDaysAutobidLoader(false));
    }
  };
};
export const purchaseTypeStatusApi = (purchaseData) => {
  return async (dispatch) => {
    dispatch(setSevenDaysAutobidLoader(true));
    try {
      const response = await axiosInstance.post(
        `users/pending-purchase-type-filter`,
        purchaseData
      );

      if (response) {
        dispatch(setData(response?.data?.data));
        return response.data;
      }
    } catch (error) {
      showToast("error", error?.response?.data?.message);
    } finally {
      dispatch(setSevenDaysAutobidLoader(false));
    }
  };
};
export const purchaseTypeHiredStatusApi = (purchaseData) => {
  return async (dispatch) => {
    dispatch(setSevenDaysAutobidLoader(true));
    try {
      const response = await axiosInstance.post(
        `users/hired-purchase-type-filter`,
        purchaseData
      );

      if (response) {
        dispatch(setData(response?.data?.data));
        return response.data;
      }
    } catch (error) {
      showToast("error", error?.response?.data?.message);
    } finally {
      dispatch(setSevenDaysAutobidLoader(false));
    }
  };
};

export const getRatingFilterApi = (ratingFilterData) => {
  return async (dispatch) => {
    dispatch(setSevenDaysAutobidLoader(true));
    try {
      const response = await axiosInstance.post(
        `users/get-rating-filter`,
        ratingFilterData
      );

      if (response) {
        dispatch(setRatingFilterData(response?.data?.data));
        return response.data;
      }
    } catch (error) {
      showToast("error", error?.response?.data?.message);
    } finally {
      dispatch(setSevenDaysAutobidLoader(false));
    }
  };
};

export const ratingFilterApi = (ratingData) => {
  return async (dispatch) => {
    dispatch(setSevenDaysAutobidLoader(true));
    try {
      const response = await axiosInstance.post(
        `users/rating-filter`,
        ratingData
      );

      if (response) {
        dispatch(setAutoBidData(response?.data?.data));
        return response.data;
      }
    } catch (error) {
      showToast("error", error?.response?.data?.message);
    } finally {
      dispatch(setSevenDaysAutobidLoader(false));
    }
  };
};
export const getleadPrimaryServiceList = (serviceId) => {
  return async (dispatch) => {
    dispatch(setServiceListLoader(true));
    try {
      const response = await axiosInstance.post(
        `users/change-primary-service`,
        serviceId
      );
      if (response) {
        dispatch(setPreferencesList(response?.data?.data));
        return response.data;
      }
    } catch (error) {
    } finally {
      dispatch(setServiceListLoader(false));
    }
  };
};

export const getExpandRadiusList = (RadiusId) => {
  return async (dispatch) => {
    dispatch(setExpandRadiusLoader(true));
    try {
      const response = await axiosInstance.post(
        `users/expand-radius`,
        RadiusId
      );
      if (response) {
        return response.data;
      }
    } catch (error) {
    } finally {
      dispatch(setExpandRadiusLoader(false));
    }
  };
};
export const addViewProfileList = (profileId) => {
  return async (dispatch) => {
    dispatch(setExpandRadiusLoader(true));
    try {
      const response = await axiosInstance.post(
        `users/get-seller-profile`,
        profileId
      );
      if (response) {
        dispatch(setViewProfileData(response?.data?.data));
        return response.data;
      }
    } catch (error) {
    } finally {
      dispatch(setExpandRadiusLoader(false));
    }
  };
};
export const ReviewProfile = (profile_uuid) => {
  return async (dispatch) => {
    dispatch(setExpandRadiusLoader(true));
    try {
      const response = await axiosInstance.post(`review/get-profile`, null, {
        params: { profile_uuid },
      });

      if (response) {
        dispatch(setReviewProfile(response?.data?.data));
        return response.data;
      }
    } catch (error) {
    } finally {
      dispatch(setExpandRadiusLoader(false));
    }
  };
};
export const deleteNoteApi = (noteId) => {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.post(``, noteId);
      if (response) {
        return response.data;
      }
    } catch (error) {
    } finally {
    }
  };
};
const leadSettingSlice = createSlice({
  name: "leadSetting",
  initialState: initialState,
  reducers: {
    setIsDirtyRedux(state, action) {
      state.isDirty = action.payload;
    },
    setleadPreferencesListLoader(state, action) {
      state.preferenceLoader = action.payload;
    },
    setPreferencesList(state, action) {
      state.preferenceList = action.payload;
    },
    setleadPreferencesLoader(state, action) {
      state.leadPreferenceLoader = action.payload;
    },
    setServiceListLoader(state, action) {
      state.serviceLoader = action.payload;
    },
    setLeadPreferenceData(state, action) {
      state.leadPreferenceData = action.payload;
    },
    setLeadListLoader(state, action) {
      state.leadRequestLoader = action.payload;
    },
    setLeadRequestListData(state, action) {
      state.leadRequestList = action.payload;
    },
    setGetLocationData(state, action) {
      state.getlocationData = action.payload;
    },
    setAutoBidData(state, action) {
      state.autoBidList = action.payload;
    },
    setRemoveListLoader(state, action) {
      state.removeLoader = action.payload;
    },
    setAutoBidListLoader(state, action) {
      state.bidListLoader = action.payload;
    },
    setRemoveLocationListLoader(state, action) {
      state.removeLocationLoader = action.payload;
    },
    setServiceWiseData(state, action) {
      state.serviceWiseData = action.payload;
    },
    setAutoBidListData(state, action) {
      state.autoBidListData = action.payload;
    },
    setManualBidListLoader(state, action) {
      state.manualBidLoader = action.payload;
    },
    setAutoBidLoader(state, action) {
      state.autobidLoader = action.payload;
    },
    setGetCreditListLoader(state, action) {
      state.getCreditLoader = action.payload;
    },
    setCreditsList(state, action) {
      state.getCreditListData = action.payload;
    },
    setFilterWiseData(state, action) {
      state.filterListData = action.payload;
    },
    setProfileLeadRequestListData(state, action) {
      state.profileLeadViewData = action.payload;
    },
    setCreditsPlanList(state, action) {
      state.creditPlanList = action.payload;
    },
    setSaveLaterListLoader(state, action) {
      state.saveLaterLoader = action.payload;
    },
    setSaveForLaterData(state, action) {
      state.saveForLaterDataList = action.payload;
    },
    setTotalCreditData(state, action) {
      state.totalCredit = action.payload;
    },
    setPurchasedData(state, action) {
      state.purchasedData = action.payload;
    },
    setFilters(state, action) {
      state.filters = action.payload;
    },
    setSellerRecommendedData(state, action) {
      state.sellerRecommended = action.payload;
    },
    setSevenDaysAutobidLoader(state, action) {
      state.sevenDaysAutoBidLoader = action.payload;
    },
    setSevenDaysData(state, action) {
      state.sevenDays = action.payload;
    },
    setOnlineRemoteData(state, action) {
      state.onlineRemote = action.payload;
    },
    setSevenPausedDaysData(state, action) {
      state.sevenPausedData = action.payload;
    },
    setGetOnlineRemoteData(state, action) {
      state.getOnlineRemote = action.payload;
    },
    setGetPendingLeadsData(state, action) {
      state.getPendingLeadList = action.payload;
    },
    setGetHiredLeadsData(state, action) {
      state.getHiredLeadList = action.payload;
    },
    setGetActivitiesData(state, action) {
      state.getActivies = action.payload;
    },
    setGetSwitchAutoBidData(state, action) {
      state.getSwitcgAutoBidData = action.payload;
    },
    setAddSubmitLeadLoader(state, action) {
      state.addSubmitLeadLoader = action.payload;
    },
    setGetSellerNotesData(state, action) {
      state.getSellerNotes = action.payload;
    },
    setSellerNotesLoader(state, action) {
      state.sellerNotesLoader = action.payload;
    },
    setPurchasePendingData(state, action) {
      state.purchasePendingList = action.payload;
    },
    setData(state, action) {
      state.data = action.payload;
    },
    setLeadListProfileLoader(state, action) {
      state.leadListLoader = action.payload;
    },
    setRatingFilterData(state, action) {
      state.ratingFilterData = action.payload;
    },
    setExpandRadiusLoader(state, action) {
      state.expandRadiusLoader = action.payload;
    },
    setViewProfileData(state, action) {
      state.viewProfileData = action.payload;
    },
    setReviewProfile(state, action) {
      state.reviewProfileData = action.payload;
    },
  },
});

export const {
  setIsDirtyRedux,
  setData,
  setleadPreferencesListLoader,
  setAutoBidData,
  setReviewProfile,
  setViewProfileData,
  setExpandRadiusLoader,
  setRatingFilterData,
  setPurchasedData,
  setLeadListProfileLoader,
  setSellerNotesLoader,
  setPurchasePendingData,
  setGetSellerNotesData,
  setGetActivitiesData,
  setAddSubmitLeadLoader,
  setGetSwitchAutoBidData,
  setGetOnlineRemoteData,
  setGetHiredLeadsData,
  setGetPendingLeadsData,
  setSevenDaysData,
  setOnlineRemoteData,
  setSevenPausedDaysData,
  setCreditsList,
  setFilters,
  setSevenDaysAutobidLoader,
  setSellerRecommendedData,
  setSaveForLaterData,
  setTotalCreditData,
  setSaveLaterListLoader,
  setCreditsPlanList,
  setFilterWiseData,
  setProfileLeadRequestListData,
  setGetCreditListLoader,
  setAutoBidLoader,
  setAutoBidListData,
  setManualBidListLoader,
  setServiceWiseData,
  setRemoveLocationListLoader,
  setRemoveListLoader,
  setAutoBidListLoader,
  setGetLocationData,
  setPreferencesList,
  setleadPreferencesLoader,
  setServiceListLoader,
  setLeadPreferenceData,
  setLeadListLoader,
  setLeadRequestListData,
} = leadSettingSlice.actions;

export default leadSettingSlice.reducer;
