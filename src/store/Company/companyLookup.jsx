import { createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Api/axiosInstance";
import { checkAddressApi, checkCompanyNameApi } from "../FindJobs/findJobSlice";

const initialState = {
  companyData: {},
  companyLoader: false,
  companyError: null,
};

export const fetchCompanyDetails = (regNumber, user_id = null) => {
  return async (dispatch) => {
    dispatch(setCompanyLoader(true));
    dispatch(clearCompanyData());

    try {
      let url = `users/fetch_company_details/${regNumber}`;
      if (user_id) {
        url += `?user_id=${user_id}`;
      }

      const response = await axiosInstance.get(url);

      // ✅ Company found and valid
      if (response.data && !response.data.error && !response.data.body) {
        dispatch(setCompanyData(response.data));

        dispatch(
          setCompanyData(
            {
              company_name: response.data.company_name,
              company_reg_number: response.data.company_number,
              company_address: `${
                response.data.registered_office_address.address_line_1
              }, ${
                response.data.registered_office_address.address_line_2 || ""
              }, ${response.data.registered_office_address.locality || ""}, ${
                response.data.registered_office_address.postal_code || ""
              }`,
            },
            true
          )
        );

        dispatch(
          checkAddressApi({
            company_location:
              response.data.registered_office_address.address_line_1,
          })
        );

        return true;
      } else {
        // ❌ Not found
        dispatch(setCompanyError("Company not found"));
        dispatch(clearCompanyData());
        dispatch(
          setSelectedServiceFormData({
            company_reg_number: "",
            company_name: "",
            company_address: "",
            company_city: "",
            company_postcode: "",
            company_country: "",
          })
        );
        return false;
      }
    } catch (error) {
      // 🧠 Already registered / API error
      let message =
        "Your account is already registered with this Company Name. Please contact us if this is not correct.";

      const body = error?.response?.data?.body;
      if (body) {
        try {
          const parsed = JSON.parse(body);
          message = parsed.message || message;
        } catch (e) {}
      }

      dispatch(setCompanyError(message));

      // 🧹 Clear both company data and form data (so UI inputs reset)
      dispatch(clearCompanyData());
      dispatch(
        setSelectedServiceFormData({
          company_reg_number: "",
          company_name: "",
          company_address: "",
          company_city: "",
          company_postcode: "",
          company_country: "",
        })
      );

      return false;
    } finally {
      dispatch(setCompanyLoader(false));
    }
  };
};

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    setCompanyData(state, action) {
      state.companyData = action.payload;
    },
    setCompanyLoader(state, action) {
      state.companyLoader = action.payload;
    },
    setCompanyError(state, action) {
      state.companyError = action.payload;
    },
    clearCompanyData(state) {
      state.companyData = {};
    },
  },
});

export const {
  setCompanyData,
  setCompanyLoader,
  setCompanyError,
  clearCompanyData,
} = companySlice.actions;

export default companySlice.reducer;
