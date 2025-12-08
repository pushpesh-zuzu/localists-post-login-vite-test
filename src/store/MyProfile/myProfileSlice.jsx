import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance, { baseURL } from "../../Api/axiosInstance";
import { showToast } from "../../utils";
export const getCustomerLinkApi = () => {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.get(`review/get-customer-link`);

      if (response) {
        dispatch(setGetCustomerLinkData(response?.data?.data));
      }
    } catch (error) {
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    } finally {
    }
  };
};

export const addSubmitReviewApi = (ReviewData) => {
  return async (dispatch) => {
    dispatch(setReviewListLoader(true));
    try {
      const response = await axiosInstance.post(
        `review/submit-review`,
        ReviewData
      );
      if (response) {
        // dispatch(setPreferencesList(response?.data?.data));
        return response?.data;
      }
    } catch (error) {
      showToast("error", error?.response?.data?.message);
    } finally {
      dispatch(setReviewListLoader(false));
    }
  };
};

export const getReviewListApi = (reviewUserId) => {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.get(
        `review/get-reviews/${reviewUserId}`
      );

      if (response) {
        dispatch(setGetReviewData(response?.data?.data));
      }
    } catch (error) {
      //    showToast("error", error?.response?.data?.message || "Something went wrong");
    } finally {
    }
  };
};

export const sellerEditProfileApi = (profileData) => {
  return async (dispatch) => {
    dispatch(setReviewListLoader(true));
    try {
      const response = await axiosInstance.post(
        `users/edit-profile`,
        profileData
      );
      if (response) {
        dispatch(setEditProfileList(response?.data?.data));
        return response?.data;
      }
    } catch (error) {
      showToast("error", error?.response?.data?.message);
    } finally {
      dispatch(setReviewListLoader(false));
    }
  };
};

export const sellerUpdateProfileApi = (profileUpdateData) => {
  return async (dispatch) => {
    dispatch(setSellerUpdateLoader(true));
    try {
      const response = await axiosInstance.post(
        `users/update-profile`,
        profileUpdateData
      );
      if (response) {
        dispatch(setEditProfileList(response?.data?.data));
        return response?.data;
      }
    } catch (error) {
      showToast("error", error?.response?.data?.message);
    } finally {
      dispatch(setSellerUpdateLoader(false));
    }
  };
};

export const sellerUpdatePasswordApi = (UpdateData) => {
  return async (dispatch) => {
    dispatch(setSellerUpdateLoader(true));
    try {
      const response = await axiosInstance.post(
        `users/change-password`,
        UpdateData
      );
      if (response) {
        // dispatch(setEditProfileList(response?.data?.data));
        return response?.data;
      }
    } catch (error) {
      showToast("error", error?.response?.data?.message);
    } finally {
      dispatch(setSellerUpdateLoader(false));
    }
  };
};

export const sellerPhoneNumberVerifyApi = (phoneData) => {
  return async (dispatch) => {
    dispatch(setSellerUpdateLoader(true));
    try {
      const response = await axiosInstance.post(`request-otp`, phoneData);
      if (response) {
        // dispatch(setEditProfileList(response?.data?.data));
        return response?.data;
      }
    } catch (error) {
      showToast("error", error?.response?.data?.message);
    } finally {
      dispatch(setSellerUpdateLoader(false));
    }
  };
};

export const createUserTokenApiCall = (userAccessToken) => {
  return async (dispatch) => {
    dispatch(setSellerUpdateLoader(true));
    try {
      const response = await axiosInstance.post(
        `https://dev.localists.com/admin/api/users/facebook/create-token`,
        { user_access_token: userAccessToken }
      );
      if (response) {
        dispatch(setFacebookReview(response?.data));
        return response?.data;
      }
    } catch (error) {
      showToast("error", error?.response?.data?.message);
    } finally {
      dispatch(setSellerUpdateLoader(false));
    }
  };
};

export const getUserTokenApicall = (userAccessToken) => {
  return async (dispatch) => {
    dispatch(setSellerUpdateLoader(true));
    try {
      const response = await axiosInstance.post(
        `https://dev.localists.com/admin/api/users/facebook/get-token`,
        {}
      );

      if (response) {
        dispatch(setEditProfileList(response?.data?.data));
        return response?.data;
      }
    } catch (error) {
      showToast("error", error?.response?.data?.message);
    } finally {
      dispatch(setSellerUpdateLoader(false));
    }
  };
};

export const sellerPhoneNumberVerifyDataApi = (otpData) => {
  return async (dispatch) => {
    dispatch(setSellerUpdateLoader(true));
    try {
      const response = await axiosInstance.post(`verify-otp`, otpData);
      if (response) {
        // dispatch(setEditProfileList(response?.data?.data));
        return response?.data;
      }
    } catch (error) {
      showToast("error", error?.response?.data?.message);
    } finally {
      dispatch(setSellerUpdateLoader(false));
    }
  };
};

// Async thunk for submitting seller profile
export const updateSellerProfile = createAsyncThunk(
  "myProfile/updateSellerProfile",
  async (formState, { rejectWithValue }) => {
    try {
      const allowedKeys = [
        "type",
        "company_logo",
        "company_name",
        "profile_image",
        "name",
        "company_email",
        "company_phone",
        "company_website",
        "company_location",
        "company_reg_number",
        "company_locaion_reason",
        "company_size",
        "company_total_years",
        "about_company",
        "business_profile_name",
        "company_address",
      ];

      const body = new FormData();
      allowedKeys.forEach((key) => {
        const val = formState[key];
        if (val != null && !key.endsWith("Preview")) {
          body.append(key, val);
        }
      });
      const response = await axiosInstance.post(
        `${baseURL}users/update-seller-profile`,
        body,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      // return rejectWithValue(error.response?.data || "Unknown error");
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  }
);

export const updateSellerPhotos = createAsyncThunk(
  "myProfile/updateSellerPhotos",
  async (body, { rejectWithValue }) => {
    try {
      for (let [key, value] of body.entries()) {
        if (value instanceof File) {
        } else {
        }
      }

      const response = await axiosInstance.post(
        `${baseURL}users/update-seller-profile`,
        body,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Unknown error");
    }
  }
);

// Thunk for social media links update
export const updateSellerSocialLinks = createAsyncThunk(
  "myProfile/updateSellerSocialLinks",
  async (formState, { rejectWithValue }) => {
    try {
      const body = new FormData();
      body.append("type", "social_media");

      const fields = [
        "fb_link",
        "twitter_link",
        "tiktok_link",
        "insta_link",
        "linkedin_link",
        "extra_links",
        "has_fb_link",
        "has_twitter_link",
        "has_tiktok_link",
        "has_insta_link",
        "has_linkedin_link",
        "has_extra_links",
      ];

      fields.forEach((field) => {
        body.append(field, formState[field] || "");
      });

      const response = await axiosInstance.post(
        `${baseURL}users/update-seller-profile`,
        body,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Unknown error");
    }
  }
);

// Thunk to handle accreditations submission

export const updateSellerAccreditations = createAsyncThunk(
  "myProfile/updateSellerAccreditations",
  async (accordionGroups, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("type", "accreditations");
      formData.append(
        "has_accreditations",
        accordionGroups.has_accreditations ?? ""
      );

      // Convert object with numeric keys → array
      const groupsArray = Object.values(accordionGroups).filter(
        (item) =>
          typeof item === "object" && item !== null && !Array.isArray(item)
      );

      groupsArray.forEach((group, index) => {
        formData.append(`accre_id[${index}]`, group.id ?? "");

        const name =
          Array.isArray(group.accreditations) && group.accreditations.length > 0
            ? group.accreditations[0]
            : group.newAccreditation || "";
        formData.append(`accre_name[${index}]`, name);

        // Handle image logic
        if (group.image instanceof File) {
          formData.append(`accre_file[${index}]`, group.image);
          formData.append(`accre_existing[${index}]`, "");
        } else if (group.image && group.image.previewUrl) {
          const parts = group.image.previewUrl.split("/");
          const filename = parts[parts.length - 1];
          formData.append(`accre_file[${index}]`, "");
          formData.append(`accre_existing[${index}]`, filename);
        } else {
          formData.append(`accre_file[${index}]`, "");
          formData.append(`accre_existing[${index}]`, "");
        }
      });

      const response = await axiosInstance.post(
        `${baseURL}users/update-seller-profile`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      return response.data;
    } catch (error) {
      console.error("Error updating accreditations:", error);
      return rejectWithValue(error.response?.data || "Unknown error");
    }
  }
);

export const deleteSellerAccreditation = createAsyncThunk(
  "myProfile/deleteSellerAccreditation",
  async (id, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("type", "delete_accreditation");
      formData.append("accre_id", id);

      const response = await axiosInstance.post(
        `${baseURL}users/update-seller-profile`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      return { id, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Unknown error");
    }
  }
);

export const updateSellerQandA = createAsyncThunk(
  "myProfile/updateSellerQandA",
  async (answersObj, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      const questions = [
        {
          id: "businessDuration",
          label: "Tell us how long you’ve been running your business.",
        },
        {
          id: "equipment",
          label: "Do you provide your own tools and materials?",
        },
        {
          id: "jobLove",
          label: "What do you enjoy most about your work?",
        },
        {
          id: "startBusiness",
          label: "What inspired you to start your own business?",
        },
        {
          id: "clientChoose",
          label: "Why should Localists.com customers choose your business?",
        },
        {
          id: "remoteServices",
          label:
            "Can you provide your services online or remotely? If so, please add details.",
        },
        {
          id: "safeFromCovid",
          label:
            "What changes have you made to keep your customers safe from Covid-19?",
        },
      ];

      questions.forEach((q) => {
        formData.append("questions[]", q.label);
        formData.append("answers[]", answersObj[q.id] || "");
      });

      const response = await axiosInstance.post(
        `${baseURL}users/seller-myprofile-qa`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Submission failed");
    }
  }
);

// Thunk to update Facebook review link
export const updateFacebookReviewLink = createAsyncThunk(
  "myProfile/updateFacebookReviewLink",
  async (fbLink, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("type", "accreditations"); // required by backend
      formData.append("fb_link", fbLink);
      formData.append("accre_name", ""); // backend expects it to exist

      const response = await axiosInstance.post(
        `${baseURL}users/update-seller-profile`,
        formData
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Submission failed");
    }
  }
);

const initialState = {
  customerLinkData: [],
  reviewLoader: false,
  reviewListData: [],
  editProfileList: [],
  sellerLoader: false,
  isDirtyRedux: false,
  // NEW state for update logic
  updateSuccess: false,
  updateError: null,
  // New for photo upload
  photoUpdateSuccess: false,
  photoUpdateError: null,

  //New for social media links
  socialUpdateSuccess: false,
  socialUpdateError: null,

  //New for Accreditations
  accreditationsUpdateSuccess: false,
  accreditationsUpdateError: null,

  //New for Q&A
  qnaUpdateSuccess: false,
  qnaUpdateError: null,

  //New for Review
  facebookReviewUpdateSuccess: false,
  facebookReviewUpdateError: null,
};

const myprofileSlice = createSlice({
  name: "myProfile",
  initialState,
  reducers: {
    setIsDirtyRedux(state, action) {
      state.isDirtyRedux = action.payload;
    },
    setGetCustomerLinkData(state, action) {
      state.customerLinkData = action.payload;
    },
    setReviewListLoader(state, action) {
      state.reviewLoader = action.payload;
    },
    setGetReviewData(state, action) {
      state.reviewListData = action.payload;
    },
    setEditProfileList(state, action) {
      state.editProfileList = action.payload;
    },
    setFacebookReview(state, action) {
      state.facebookReviews = action.payload;
    },
    setSellerUpdateLoader(state, action) {
      state.sellerLoader = action.payload;
    },
    clearUpdateStatus(state) {
      state.updateSuccess = false;
      state.updateError = null;
    },
    clearPhotoUpdateStatus(state) {
      state.photoUpdateSuccess = false;
      state.photoUpdateError = null;
    },
    clearSocialUpdateStatus(state) {
      state.socialUpdateSuccess = false;
      state.socialUpdateError = null;
    },
    clearAccreditationsStatus(state) {
      state.accreditationsUpdateSuccess = false;
      state.accreditationsUpdateError = null;
    },
    clearQnaStatus(state) {
      state.qnaUpdateSuccess = false;
      state.qnaUpdateError = null;
    },
    clearFacebookReviewStatus(state) {
      state.facebookReviewUpdateSuccess = false;
      state.facebookReviewUpdateError = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // for profile
      .addCase(updateSellerProfile.pending, (state) => {
        state.sellerLoader = true;
        state.updateSuccess = false;
        state.updateError = null;
      })
      .addCase(updateSellerProfile.fulfilled, (state) => {
        state.sellerLoader = false;
        state.updateSuccess = true;
      })
      .addCase(updateSellerProfile.rejected, (state, action) => {
        state.sellerLoader = false;
        state.updateSuccess = false;
        state.updateError = action.payload;
      })

      // for photos
      .addCase(updateSellerPhotos.pending, (state) => {
        state.sellerLoader = true;
        state.photoUpdateSuccess = false;
        state.photoUpdateError = null;
      })
      .addCase(updateSellerPhotos.fulfilled, (state) => {
        state.sellerLoader = false;
        state.photoUpdateSuccess = true;
      })
      .addCase(updateSellerPhotos.rejected, (state, action) => {
        state.sellerLoader = false;
        state.photoUpdateSuccess = false;
        state.photoUpdateError = action.payload;
      })

      // Social media
      .addCase(updateSellerSocialLinks.pending, (state) => {
        state.sellerLoader = true;
        state.socialUpdateSuccess = false;
        state.socialUpdateError = null;
      })
      .addCase(updateSellerSocialLinks.fulfilled, (state) => {
        state.sellerLoader = false;
        state.socialUpdateSuccess = true;
      })
      .addCase(updateSellerSocialLinks.rejected, (state, action) => {
        state.sellerLoader = false;
        state.socialUpdateSuccess = false;
        state.socialUpdateError = action.payload;
      })

      //For Accreditations
      .addCase(updateSellerAccreditations.pending, (state) => {
        state.sellerLoader = true;
        state.accreditationsUpdateSuccess = false;
        state.accreditationsUpdateError = null;
      })
      .addCase(updateSellerAccreditations.fulfilled, (state) => {
        state.sellerLoader = false;
        state.accreditationsUpdateSuccess = true;
      })
      .addCase(updateSellerAccreditations.rejected, (state, action) => {
        state.sellerLoader = false;
        state.accreditationsUpdateSuccess = false;
        state.accreditationsUpdateError = action.payload;
      })
      //for Q&A
      .addCase(updateSellerQandA.pending, (state) => {
        state.sellerLoader = true;
        state.qnaUpdateSuccess = false;
        state.qnaUpdateError = null;
      })
      .addCase(updateSellerQandA.fulfilled, (state) => {
        state.sellerLoader = false;
        state.qnaUpdateSuccess = true;
      })
      .addCase(updateSellerQandA.rejected, (state, action) => {
        state.sellerLoader = false;
        state.qnaUpdateSuccess = false;
        state.qnaUpdateError = action.payload;
      })
      //for Reviews
      .addCase(updateFacebookReviewLink.pending, (state) => {
        state.sellerLoader = true;
        state.facebookReviewUpdateSuccess = false;
        state.facebookReviewUpdateError = null;
      })
      .addCase(updateFacebookReviewLink.fulfilled, (state) => {
        state.sellerLoader = false;
        state.facebookReviewUpdateSuccess = true;
      })
      .addCase(updateFacebookReviewLink.rejected, (state, action) => {
        state.sellerLoader = false;
        state.facebookReviewUpdateSuccess = false;
        state.facebookReviewUpdateError = action.payload;
      });
  },
});

export const {
  setIsDirtyRedux,
  setGetCustomerLinkData,
  setReviewListLoader,
  setGetReviewData,
  setEditProfileList,
  setFacebookReview,
  setSellerUpdateLoader,
  clearUpdateStatus,
  clearPhotoUpdateStatus,
  clearSocialUpdateStatus,
  clearAccreditationsStatus,
  clearQnaStatus,
  clearFacebookReviewStatus,
} = myprofileSlice.actions;

export default myprofileSlice.reducer;
