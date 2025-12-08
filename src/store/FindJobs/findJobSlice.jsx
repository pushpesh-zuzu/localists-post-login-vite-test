import { createSlice } from "@reduxjs/toolkit";
import { showToast } from "../../utils";
import axiosInstance from "../../Api/axiosInstance.js";
import { fetchCompanyDetails } from "../../../src/store/Company/companyLookup";
import { changeSequenceServices } from "../../utils/allservices.js";
import { safeLocalStorage } from "../../utils/localStorage.js";
const initialState = {
  popularList: [],
  popularLoader: false,
  hasPopulatedFromCompany: false,
  searchServiceLoader: false,
  service: [],
  registerData:
    JSON.parse(safeLocalStorage.getItem("registerDataToken")) || null,
  registerLoader: false,
  registerStep: 0,
  registerToken: JSON.parse(safeLocalStorage.getItem("registerTokens")) || null,
  selectedServiceId: null,
  selectedServices: [],
  categoriesListLoader: false,
  pendingLoader: false,
  CategoriesList: [],
  allServiceList: [],
  pendingLead: [],
  errorMessage: [],
  errorCheckComanyName: null,
  buyerRegisterFormData: {
    email: "",
    name: "",
    phone: "",
  },
  country: {},
  city: {},
  postalcode: {},
  selectedServiceFormData: {
    miles1: "20",
    postcode: null,
    cities: "",
    coordinates: [],
    is_online: 0,
    nation_wide: 0,
    name: "",
    email: "",
    company_reg_number: "",
    phone: "",
    company_name: "",
    company_size: null,
    company_sales_team: null,
    company_website: "",
    is_company_website: 1,
    new_jobs: null,
    social_media: null,
    address: "",
    city: "",
    country: "",
    apartment: "",
    zipcode: "",
    service_id: [],
    auto_bid: 1,
    miles2: "20",
    expanded_radius: "",
    coordinates2: "",
    validPostCode: false,
    validPostCode2: false,
    postcode2: null,
    entry_url: "",
    user_ip_address: "",
  },
  authToken: JSON.parse(safeLocalStorage.getItem("registerTokens")) || null,
};
export const getPopularServiceList = () => {
  return async (dispatch) => {
    dispatch(setPopularServiceListLoader(true));
    try {
      const response = await axiosInstance.get(`users/popular-services`);
      if (response) {
        dispatch(setPopularList(response?.data?.data));
      }
    } catch (error) {
    } finally {
      dispatch(setPopularServiceListLoader(false));
    }
  };
};

export const getPopularServiceListUser = (ServiceData) => {
  return async (dispatch) => {
    dispatch(setPopularServiceListLoader(true));
    try {
      const response = await axiosInstance.post(
        `users/user-available-popular-services`,
        ServiceData
      );
      if (response) {
        dispatch(setPopularList(response?.data?.data));
      }
    } catch (error) {
    } finally {
      dispatch(setPopularServiceListLoader(false));
    }
  };
};

export const searchService = (ServiceData) => {
  return async (dispatch) => {
    dispatch(setsearchServiceLoader(true));
    try {
      const response = await axiosInstance.post(
        `users/search-services`,
        ServiceData
      );

      if (response) {
        dispatch(setService(response?.data?.data));
      }
    } catch (error) {
    } finally {
      dispatch(setsearchServiceLoader(false));
    }
  };
};
export const searchAvailableService = (ServiceData) => {
  return async (dispatch) => {
    dispatch(setsearchServiceLoader(true));
    try {
      const response = await axiosInstance.post(
        `users/search-available-services`,
        ServiceData
      );

      if (response) {
        dispatch(setAvailableService(response?.data?.data));
      }
    } catch (error) {
    } finally {
      dispatch(setsearchServiceLoader(false));
    }
  };
};
export const registerUserData = (registerData) => {
  return async (dispatch) => {
    dispatch(setRegisterLoader(true));
    try {
      const response = await axiosInstance.post(
        `users/registration`,
        registerData
      );

      if (response) {
        dispatch(setRegisterData(response?.data?.data));
        dispatch(setRegisterToken(response?.data?.data?.remember_tokens));
        dispatch(setAuthToken(response?.data?.data?.remember_tokens));
        return response.data;
      } else {
        showToast(
          "error",
          response?.message || "Register failed. Please try again."
        );
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
          error?.response?.data?.message || "Register failed. Please try again."
        );
        dispatch(setErrorMessage(error?.response?.data?.message));
      }
    } finally {
      dispatch(setRegisterLoader(false));
    }
  };
};
export const getCategoriesList = () => {
  return async (dispatch) => {
    dispatch(setCategoriesListLoader(true));
    try {
      const response = await axiosInstance.get(`users/get-categories`);
      if (response) {
        dispatch(setCategoriesList(response?.data?.data));
      }
    } catch (error) {
    } finally {
      dispatch(setCategoriesListLoader(false));
    }
  };
};

export const getAllServiceList = () => {
  return async (dispatch) => {
    dispatch(setPopularServiceListLoader(true));
    try {
      const response = await axiosInstance.get(`users/all-services`);
      if (response) {
        dispatch(setAllServiceList(response?.data?.data));
      }
    } catch (error) {
    } finally {
      dispatch(setPopularServiceListLoader(false));
    }
  };
};

export const pendingLeadData = (pendingData) => {
  return async (dispatch) => {
    dispatch(setPendingLeadLoader(true));
    try {
      const response = await axiosInstance.post(
        `users/pending-leads`,
        pendingData,
        {
          headers: {
            Authorization: null,
          },
        }
      );

      if (response?.data?.data) {
        dispatch(setPendingLeadData(response.data.data));
      }
    } catch (error) {
    } finally {
      dispatch(setPendingLeadLoader(false));
    }
  };
};

export const checkEmailIdApi = (emailData) => {
  return async (dispatch) => {
    dispatch(setsearchServiceLoader(true));
    try {
      const response = await axiosInstance.post(`check/email-id`, emailData);

      if (response) {
        return response.data;
      }
    } catch (error) {
      showToast("error", error?.response?.data?.message);
    } finally {
      dispatch(setsearchServiceLoader(false));
    }
  };
};
export const checkCompanyNameApi = (companyData, isapi = false) => {
  return async (dispatch) => {
    dispatch(setsearchServiceLoader(true));
    try {
      const response = await axiosInstance.post(
        `check/company-name`,
        companyData
      );

      if (response && response?.success == true) {
        dispatch(setErrorCheckComanyName(response?.data?.success));
        return response.data;
      }
    } catch (error) {
      const errorData = error?.response?.data?.message;
      dispatch(setErrorCheckComanyName(error?.response?.data));
      showToast("error", error?.response?.data.message?.company_reg_number[0]);
      if (errorData && typeof errorData === "object" && !isapi) {
        Object.values(errorData).forEach((messages) => {
          if (Array.isArray(messages)) {
            messages.forEach((msg) => showToast("error", msg));
            if (companyData.company_reg_number) {
              dispatch(fetchCompanyDetails(companyData.company_reg_number));
            }
          } else {
            showToast("error", messages);
          }
        });
      } else {
        showToast(
          "error",
          error?.response?.data?.message || "Register failed. Please try again."
        );

        dispatch(setErrorMessage(error?.response?.data?.message));
      }
    } finally {
      dispatch(setsearchServiceLoader(false));
    }
  };
};

export const checkCompanyNameWithoutRegApi = (companyData) => {
  return async (dispatch) => {
    dispatch(setsearchServiceLoader(true));
    try {
      const response = await axiosInstance.post(
        `check/company-name-without-reg`,
        companyData
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
          error?.response?.data?.message || "Register failed. Please try again."
        );

        dispatch(setErrorMessage(error?.response?.data?.message));
      }
    } finally {
      dispatch(setsearchServiceLoader(false));
    }
  };
};

export const checkPhoneNumberApi = (phoneData) => {
  return async (dispatch) => {
    dispatch(setsearchServiceLoader(true));
    try {
      const response = await axiosInstance.post(
        `check/phone-number`,
        phoneData
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
          error?.response?.data?.message || "Register failed. Please try again."
        );
        dispatch(setErrorMessage(error?.response?.data?.message));
      }
    } finally {
      dispatch(setsearchServiceLoader(false));
    }
  };
};

export const checkAddressApi = (addressData) => {
  return async (dispatch) => {
    dispatch(setsearchServiceLoader(true));
    try {
      const response = await axiosInstance.post(
        `check/company-location`,
        addressData
      );

      if (response) {
        return response.data;
      }
    } catch (error) {
      showToast("error", error?.response?.data?.message);
    } finally {
      dispatch(setsearchServiceLoader(false));
    }
  };
};

const findJobSlice = createSlice({
  name: "findJobs",
  initialState: initialState,
  reducers: {
    setPopularList(state, action) {
      state.popularList = action.payload;
    },
    setPopularServiceListLoader(state, action) {
      state.popularLoader = action.payload;
    },
    setService(state, action) {
      state.service = action.payload;
    },
    setAvailableService(state, action) {
      state.service = action.payload;
    },
    setHasPopulatedFromCompany: (state, action) => {
      state.hasPopulatedFromCompany = action.payload;
    },
    setsearchServiceLoader(state, action) {
      state.searchServiceLoader = action.payload;
    },
    setRegisterLoader(state, action) {
      state.registerLoader = action.payload;
    },
    setRegisterStep(state, action) {
      state.registerStep = action.payload;
    },
    setRegisterToken(state, action) {
      state.registerToken = action.payload;
      safeLocalStorage.setItem(
        "registerTokens",
        JSON.stringify(action.payload)
      );
    },
    setSelectedServiceId(state, action) {
      state.selectedServiceId = action.payload;
      state.selectedServiceFormData.service_id = [action.payload];
    },
    setSelectedServiceFormData(state, action) {
      state.selectedServiceFormData = {
        ...state.selectedServiceFormData,
        ...action.payload,
      };
    },
    setselectedServices(state, action) {
      state.selectedServices = action.payload;
    },
    setRegisterData(state, action) {
      state.registerData = action.payload;
      safeLocalStorage.setItem(
        "registerDataToken",
        JSON.stringify(action.payload)
      );
    },
    setErrorMessage(state, action) {
      state.errorMessage = action.payload;
    },
    setErrorCheckComanyName(state, action) {
      state.errorCheckComanyName = action.payload;
    },
    setCategoriesListLoader(state, action) {
      state.categoriesListLoader = action.payload;
    },
    setCategoriesList(state, action) {
      state.CategoriesList = action.payload;
    },
    setAllServiceList(state, action) {
      state.allServiceList = changeSequenceServices(action.payload, 2);
    },
    setPendingLeadLoader(state, action) {
      state.pendingLoader = action.payload;
    },
    setPendingLeadData(state, action) {
      state.pendingLead = action.payload;
    },
    setbuyerRegisterFormData(state, action) {
      state.buyerRegisterFormData = {
        ...state.buyerRegisterFormData,
        ...action.payload,
      };
    },
    setCountry(state, action) {
      state.country = action.payload;
    },
    setCity(state, action) {
      state.city = action.payload;
    },
    setPostalCode(state, action) {
      state.postalcode = action.payload;
    },
    clearBuyerRegisterFormData(state, action) {
      state.buyerRegisterFormData = {
        email: "",
        name: "",
        phone: "",
      };
    },
    setAuthToken(state, action) {
      if (!action.payload) {
        state.authToken = state.registerToken;
      } else {
        state.authToken = action.payload;
      }
    },
    clearAuthToken(state) {
      state.authToken = null;
    },
    clearServiceFormData(state, action) {
      state.selectedServiceFormData = {
        miles1: "20",
        postcode: null,
        cities: null,
        coordinates: [],
        nation_wide: 0,
        name: "",
        email: "",
        password: "",
        phone: "",
        company_name: "",
        company_size: null,
        company_sales_team: null,
        company_website: "",
        is_company_website: 1,
        new_jobs: null,
        social_media: null,
        address: "",
        state: "",
        city: "",
        zipcode: "",
        is_zipcode: 1,
        suite: "",
        service_id: [],
        auto_bid: 1,
        miles2: "30",
        company_reg_number: "",
        validPostCode: false,
        entry_url: "",
        user_ip_address: "",
      };
    },
  },
});

export const {
  setPopularServiceListLoader,
  setPopularList,
  setsearchServiceLoader,
  setService,
  setAvailableService,
  setRegisterLoader,
  setRegisterStep,
  setRegisterToken,
  setSelectedServiceId,
  setSelectedServiceFormData,
  setselectedServices,
  setRegisterData,
  setCategoriesListLoader,
  setCategoriesList,
  setAllServiceList,
  clearServiceFormData,
  setPendingLeadLoader,
  setPendingLeadData,
  setbuyerRegisterFormData,
  clearBuyerRegisterFormData,
  setErrorMessage,
  setAuthToken,
  setCountry,
  setCity,
  setPostalCode,
  setErrorCheckComanyName,
  setHasPopulatedFromCompany,
  clearAuthToken,
} = findJobSlice.actions;
export default findJobSlice.reducer;
