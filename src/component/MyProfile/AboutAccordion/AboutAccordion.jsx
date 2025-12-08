import { useState, useRef, useEffect } from "react";
import styles from "./AboutAccordion.module.css";
import defaultImage from "../../../assets/Images/DefaultProfileImage.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  updateSellerProfile,
  clearUpdateStatus,
} from "../../../store/MyProfile/myProfileSlice";
import { toast } from "react-toastify";
import { BASE_IMAGE, showToast, updateLocalStorageValue } from "../../../utils";
import { setUserToken } from "../../../store/Auth/authSlice";
import {
  checkAddressApi,
  checkCompanyNameApi,
  setRegisterData,
} from "../../../store/FindJobs/findJobSlice";
import { LoadingOutlined } from "@ant-design/icons";
import { Flex, Spin } from "antd";
import { addViewProfileList } from "../../../store/LeadSetting/leadSettingSlice";
import {
  setCompanyError,
  fetchCompanyDetails,
} from "../../../store/Company/companyLookup";
import Cropper from "react-easy-crop";
import { setIsDirtyRedux } from "../../../store/MyProfile/myProfileSlice";

const AboutAccordion = ({ details }) => {
  const dispatch = useDispatch();
  const { updateSuccess, updateError, loading, error, success, isDirtyRedux } =
    useSelector((state) => state.myProfile);
  const { userToken } = useSelector((state) => state.auth);
  const { registerData, errorCheckComanyName } = useSelector(
    (state) => state.findJobs
  );

  const { viewProfileData } = useSelector((state) => state.leadSetting);
  const user_id = userToken?.id ? userToken?.id : registerData?.id;
  const companyData = useSelector((state) => state.companyLook?.companyData);
  const [debouncedCompanyLocation, setDebouncedCompanyLocation] = useState("");
  const [hideAddress, setHideAddress] = useState(false);
  const [debouncedCompanyName, setDebouncedCompanyName] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const [formState, setFormState] = useState({
    type: "about",
    tiktok_link: "",
    insta_link: "",
    linkedin_link: "",
    extra_links: "",
    company_logo: null,
    company_logoPreview: null,
    profile_image: null,
    profile_imagePreview: null,
    company_photos: [],
    company_photosPreview: [],
    company_name: "",
    business_profile_name: "",
    name: "",
    company_email: "",
    company_phone: "",
    company_website: "",
    company_location: "",
    company_locaion_reason: "",

    company_size: "",
    company_total_years: "",
    company_reg_number: "",
    about_company: "",
    is_youtube_video: 1,
    company_youtube_link: "",
    is_fb: 1,
    fb_link: "",
    is_twitter: 1,
    twitter_link: "",
    is_link_desc: 1,
    link_desc: "",
    is_accreditations: 1,
    accre_name: "",
    accreditation_id: "",
    accre_image: null,
    accre_imagePreview: null,
    service_title: "",
    service_desc: "",
    user_service_id: 0,
    deleteData: 0,
    accr_delete_id: "",
    service_delete_id: "",
  });

  const [errors, setErrors] = useState({});
  const fileInputRefs = {
    company_logo: useRef(),
    profile_image: useRef(null),
    accre_image: useRef(),
    company_photos: useRef(),
  };

  const [imageSrc, setImageSrc] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedPreview, setCroppedPreview] = useState(null);

  const [isDirty, setIsDirty] = useState(false);

  const [croppingTarget, setCroppingTarget] = useState("");

  const companyError = useSelector((state) => state.companyLook?.companyError);
  const [businessName, setBusinessName] = useState(
    details?.business_profile_name
  );

  useEffect(() => {
    if (companyError && formState.company_reg_number !== "") {
      showToast("error", companyError);
      setFormState((prev) => ({
        ...prev,
        company_reg_number: "",
      }));
    }

    if (companyError) {
      dispatch(setCompanyError(null));
    }
  }, [companyError, formState.company_reg_number, dispatch]);
  useEffect(() => {
    if (details?.id) {
      // setFormState({
      //   ...formState,
      //   company_email: details?.company_email,
      //   company_phone: details?.company_phone,
      //   company_name: details?.company_name,
      //   business_profile_name: details?.business_profile_name,
      //   name: details?.name,
      //   company_website: details?.company_website,
      //   company_address: companyData?.company_address,
      //   company_location: details?.address,
      //   company_locaion_reason: details?.company_locaion_reason,
      //   company_size: details?.company_size,
      //   company_total_years: details?.company_total_years,
      //   company_reg_number: details?.company_reg_number,
      //   about_company: details?.about_company,
      //   profile_imagePreview: details?.profile_image
      //     ? `${BASE_IMAGE}/users/${details?.profile_image}`
      //     : null,
      //   company_logoPreview: details?.company_logo
      //     ? `${BASE_IMAGE}/users/${details?.company_logo}`
      //     : null,
      // });
      setFormState((prev) => ({
        ...prev,
        company_email: details?.company_email || prev.company_email,
        company_phone: details?.company_phone || prev.company_phone,
        company_name: details?.company_name || prev.company_name,
        business_profile_name:
          details?.business_profile_name || prev.business_profile_name,
        name: details?.name || prev.name,
        company_website: details?.company_website || prev.company_website,
        company_address: companyData?.company_address || prev.company_address,
        company_location: details?.address || prev.company_location,
        company_locaion_reason:
          details?.company_locaion_reason || prev.company_locaion_reason,
        company_size: details?.company_size || prev.company_size,
        company_total_years:
          details?.company_total_years || prev.company_total_years,
        company_reg_number:
          details?.company_reg_number || prev.company_reg_number,
        about_company: details?.about_company || prev.about_company,
        profile_imagePreview: details?.profile_image
          ? `${BASE_IMAGE}/users/${details?.profile_image}`
          : prev.profile_imagePreview,
        company_logoPreview: details?.company_logo
          ? `${BASE_IMAGE}/users/${details?.company_logo}`
          : prev.company_logoPreview,
      }));
    }
  }, [details]);

  useEffect(() => {
    // let data = { ...formState };
    // if (companyData.company_name) {
    //   data.company_name = companyData?.company_name;
    // }
    // if (companyData?.registered_office_address) {
    //   data.company_location =
    //     companyData?.registered_office_address?.address_line_1;
    // }
    // if (companyData.company_address) {
    //   data.company_address = companyData?.company_address;
    // }
    // if (companyData.company_name || companyData?.registered_office_address) {
    //   setFormState({ ...data });
    // }
    setFormState((prev) => ({
      ...prev,
      company_name: companyData?.company_name || prev.company_name,
      company_location:
        companyData?.registered_office_address?.address_line_1 ||
        prev.company_location,
      company_address: companyData?.company_address || prev.company_address,
    }));
  }, [companyData]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setIsDirty(true);
    if (!file) return;

    const { name } = e.target;

    if (name === "profile_image" || name === "company_logo") {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
        setIsCropping(true);
        setZoom(1);
        setCrop({ x: 0, y: 0 });
        setCroppingTarget(name);
      };
      reader.readAsDataURL(file);
      return;
    }

    if (name === "company_photos") {
      const arr = Array.from(e.target.files);
      setFormState((prev) => ({
        ...prev,
        company_photos: arr,
        company_photosPreview: arr.map((f) => URL.createObjectURL(f)),
      }));
      return;
    }

    setFormState((prev) => ({
      ...prev,
      [name]: file,
      [`${name}Preview`]: URL.createObjectURL(file),
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setIsDirty(true);

    setFormState((prev) => ({ ...prev, [name]: value }));
    if (name === "company_phone") {
      const newValue = value.replace(/[^0-9]/g, "");
      setFormState((prev) => ({ ...prev, [name]: newValue }));
    }

    if (name === "company_reg_number") {
      setFormState((prev) => ({
        ...prev,
        [name]: value,
        company_name: "",
      }));
      phoneAPI(value);
    }

    if (name === "company_location") {
      setDebouncedCompanyLocation(value);
    }

    if (name === "company_name") {
      setDebouncedCompanyName(value);
    }

    if (name === "business_profile_name") {
      setFormState((prev) => ({ ...prev, business_profile_name: value }));
      setBusinessName(value);
    }
  };

  useEffect(() => {
    dispatch(setIsDirtyRedux(isDirty));
  }, [isDirty, dispatch]);

  const handleRedirect = (path) => {
    if (isDirtyRedux) {
      const confirmLeave = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?"
      );
      if (!confirmLeave) return;
    }
    navigate(path);
  };

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirtyRedux) {
        e.preventDefault();
        e.returnValue = "";
        handleRedirect();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirtyRedux]);

  useEffect(() => {
    if (debouncedCompanyLocation.length !== 10) return;

    const timeout = setTimeout(() => {
      dispatch(
        checkAddressApi({ company_location: debouncedCompanyLocation })
      ).then((result) => {
        if (result?.success) {
          showToast("success", result.message);
        }
      });
    }, 1000);

    return () => clearTimeout(timeout);
  }, [debouncedCompanyLocation]);

  useEffect(() => {
    if (!debouncedCompanyName) return;

    const timeout = setTimeout(() => {
      dispatch(
        checkCompanyNameApi({
          company_name: debouncedCompanyName,
          company_reg_number: formState.company_reg_number,
        })
      ).then((result) => {
        if (result?.success) {
          showToast("success", result.message);
        }
      });
    }, 1000);

    return () => clearTimeout(timeout);
  }, [debouncedCompanyName]);

  const phoneAPI = (regNo) => {
    if (regNo && regNo.length === 8) {
      dispatch(fetchCompanyDetails(regNo, user_id));
    }
  };

  const validate = () => {
    const temp = {};
    if (!formState.name) {
      temp.name = "Please fill this Required";
    }

    if (formState.company_reg_number) {
      if (!formState.company_name) {
        temp.company_name = "Company Name is required";
      }

      if (!formState.business_profile_name) {
        temp.business_profile_name = "Business Name is required.";
      }

      // if (!formState.company_location) {
      //   temp.company_location = "Company location is required";
      // }
    }

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleCaptureWebcam = async (target) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const track = stream.getVideoTracks()[0];
      const imageCapture = new ImageCapture(track);
      const blob = await imageCapture.takePhoto();
      track.stop();
      const file = new File([blob], `${target}.jpg`, { type: blob.type });
      setFormState((prev) => ({
        ...prev,
        [target]: file,
        [`${target}Preview`]: URL.createObjectURL(blob),
      }));
      const photoBlob = await webcamRef.current.getScreenshot();
      if (!photoBlob) return;
      setImageSrc(photoBlob);
      setIsCropping(true);
    } catch (err) {
      console.error("Webcam capture failed:", err);
    }
    setIsCropping(true);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
  };

  const getCroppedImg = (imageSrc, croppedAreaPixels) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.src = imageSrc;

      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;

        ctx.drawImage(
          image,
          croppedAreaPixels.x,
          croppedAreaPixels.y,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
          0,
          0,
          croppedAreaPixels.width,
          croppedAreaPixels.height
        );

        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error("Canvas is empty"));
            return;
          }
          const dataUrl = canvas.toDataURL("image/jpeg");
          resolve({ blob, dataUrl });
        }, "image/jpeg");
      };

      image.onerror = (error) => reject(error);
    });
  };

  const handleApplyCropped = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      const { blob, dataUrl } = await getCroppedImg(
        imageSrc,
        croppedAreaPixels
      );

      const finalBlob =
        blob instanceof Blob ? blob : new Blob([blob], { type: "image/jpeg" });

      const croppedFile = new File([finalBlob], `${croppingTarget}.jpg`, {
        type: "image/jpeg",
      });

      setFormState((prev) => ({
        ...prev,
        [croppingTarget]: croppedFile,
        [`${croppingTarget}Preview`]: dataUrl,
      }));

      setCroppedPreview(dataUrl);
      setIsCropping(false);
      setCroppingTarget("");
    } catch (error) {
      console.error("Error while cropping image:", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageSrc(URL.createObjectURL(file));
      setIsCropping(true);
    }
  };

  const CompanyNameFirstLetter = details?.business_profile_name || "";
  const ProfileNameFirstLetter = details?.name?.[0] || "";

  const handleSubmit = () => {
    if (!validate()) {
      showToast("error", "Please fix validation errors");
      return;
    }
    if (errorCheckComanyName === false) {
      showToast("error", "Company name already exists");
      return;
    }
    if (
      isDirty &&
      formState.business_profile_name &&
      formState.business_profile_name.length > 0 &&
      formState?.name &&
      formState?.name.length > 0
    ) {
      if (formState.about_company && formState.about_company.length < 20) {
        showToast(
          "error",
          "Business Description should be at least 20 characters long"
        );
        return;
      } else if (formState && isDirty) {
        setShowLoader(true);
        dispatch(updateSellerProfile(formState)).then((result) => {
          if (result) {
            const sellerData = {
              seller_id: user_id,
            };
            dispatch(addViewProfileList(sellerData))?.then((res) => {
              if (res?.success) {
                setIsDirty(false);
              }
              setShowLoader(false);
            });
          }
        });
      }
    } else {
      showToast("error", "No Data Found to Save");
    }
  };

  useEffect(() => {
    if (updateSuccess) {
      toast.success("Profile updated successfully!");
      updateLocalStorageValue("barkUserToken", "name", formState?.name);
      updateLocalStorageValue("registerDataToken", "name", formState?.name);
      updateLocalStorageValue(
        "barkUserToken",
        "profile_image",
        details?.profile_image
      );
      updateLocalStorageValue(
        "registerDataToken",
        "profile_image",
        details?.profile_image
      );
      const storedData = localStorage.getItem("barkUserToken");
      const registerData = localStorage.getItem("registerDataToken");

      const parsedData = JSON.parse(storedData);
      const registerDatas = JSON.parse(registerData);
      if (parsedData) {
        parsedData.name = formState?.name;
        parsedData.profile_image = details?.profile_image;
        dispatch(setUserToken(parsedData));
      }
      if (registerDatas) {
        registerDatas.name = formState?.name;
        registerDatas.profile_image = details?.profile_image;
        dispatch(setRegisterData(registerDatas));
      }

      dispatch(clearUpdateStatus());
    } else if (updateError) {
      toast.error(`Error: ${updateError}`);
      dispatch(clearUpdateStatus());
    }
  }, [updateSuccess, updateError, dispatch]);
  console.log(formState?.name, "name");

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h3>Business Name & Logo</h3>
        <p className={styles.subheading2}>
          Help Customers recognise your business. This is what customers see
          first when browsing for professionals on Localists.com.
        </p>
        <div className={styles.imageSection}>
          {details?.company_logoPreview || formState.company_logoPreview ? (
            <img
              src={formState.company_logoPreview || defaultImage}
              alt="Default Logo"
            />
          ) : (
            <div className={styles.CompanyText}>
              {CompanyNameFirstLetter?.[0]
                ? CompanyNameFirstLetter[0].toUpperCase()
                : "C"}
            </div>
          )}
          <button
            className={styles.uploadBtn}
            onClick={() => fileInputRefs.company_logo.current.click()}
          >
            Upload
          </button>

          <input
            type="file"
            name="company_logo"
            ref={fileInputRefs.company_logo}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>
        <label className={styles.label}>Business Profile Name</label>
        <input
          className={styles.input}
          type="text"
          name="business_profile_name"
          value={businessName}
          onChange={handleInputChange}
          placeholder="Enter your company name"
        />
      </div>

      <div className={styles.card}>
        <h3>Your Name & Profile Picture</h3>
        <p className={styles.subheading2}>
          Customers on Localists.com will see this information when you message
          them. Adding a photo helps build trust and makes your profile more
          personal.
        </p>
        <div className={styles.imageSection}>
          {details?.profile_imagePreview || formState.profile_imagePreview ? (
            <img
              src={formState.profile_imagePreview || defaultImage}
              alt="Default Profile"
            />
          ) : (
            <div className={styles.CompanyText}>
              {ProfileNameFirstLetter.toUpperCase()}
            </div>
          )}

          <div className={styles.wrapper}>
            <div className={styles.buttonGroup}>
              <button
                className={styles.uploadBtn}
                onClick={() => fileInputRefs.profile_image.current.click()}
              >
                Upload
              </button>
              <button
                className={styles.webcamBtn}
                onClick={() => handleCaptureWebcam("profile_image")}
              >
                Take Photo
              </button>
              <input
                type="file"
                name="profile_image"
                ref={fileInputRefs.profile_image}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>
          </div>
          {isCropping && imageSrc && (
            <div className={styles.cropOverlay}>
              <div className={styles.cropCard}>
                <div className={styles.cropArea}>
                  <div className={styles.cropContainer}>
                    <Cropper
                      style={{
                        containerStyle: {
                          width: "30%",
                          height: "30%",
                          position: "relative",
                          background: "#000",
                        },
                      }}
                      image={imageSrc}
                      crop={crop}
                      zoom={zoom}
                      aspect={1}
                      cropShape="rect"
                      showGrid={false}
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                      onCropComplete={(_, croppedPixels) =>
                        setCroppedAreaPixels(croppedPixels)
                      }
                    />
                  </div>
                </div>

                <div className={styles.controls}>
                  <label>Zoom</label>
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.1}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                  />
                  <div className={styles.actions}>
                    <button
                      className={styles.cancelBtn}
                      onClick={() => setIsCropping(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className={styles.applyBtn}
                      onClick={handleApplyCropped}
                    >
                      Use Photo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <label className={styles.label}>Name</label>
        <input
          className={styles.input}
          type="text"
          name="name"
          value={formState?.name}
          onChange={handleInputChange}
          placeholder="Enter your full name"
        />
        {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
      </div>
      <div className={styles.card}>
        <h3>Your Contact Information</h3>
        <p>
          Customers on Localists.com will see these details when viewing your
          profile. You can update your private contact info anytime under{" "}
          <a href="/settings/profile/account-details" className={styles.link}>
            Account Details
          </a>
          .
        </p>

        <div className={styles.formGroup}>
          <div className={styles.halfInput}>
            <label className={styles.label}>Company Name</label>
            <input
              className={styles.input}
              type="text"
              name="company_name"
              value={formState.company_name}
              onChange={handleInputChange}
              placeholder="Enter Company Name"
            />
            {errors.company_name && (
              <p style={{ color: "red" }}>{errors.company_name}</p>
            )}
          </div>
          <div className={styles.halfInput}>
            <label className={styles.label}>Company Reg. No</label>
            <input
              className={styles.input}
              type="text"
              name="company_reg_number"
              value={formState.company_reg_number}
              onChange={handleInputChange}
              placeholder="Enter Company Reg. No"
              maxLength={8}
            />
          </div>
        </div>
        <div className={styles.formGroup}>
          <div className={styles.halfInput}>
            <label className={styles.label}>Company email address</label>
            <input
              className={styles.input}
              type="text"
              name="company_email"
              value={formState.company_email}
              onChange={handleInputChange}
              placeholder="company@example.com"
            />
            {errors.company_email && (
              <p style={{ color: "red" }}>{errors.company_email}</p>
            )}
          </div>
          <div className={styles.halfInput}>
            <label className={styles.label}>Company phone number</label>
            <input
              className={styles.input}
              type="tel"
              name="company_phone"
              value={formState.company_phone}
              onChange={handleInputChange}
              placeholder="Enter company's phone number"
              maxLength={10}
              onKeyDown={(e) => {
                if (
                  !/[0-9]/.test(e.key) &&
                  e.key !== "Backspace" &&
                  e.key !== "Tab"
                ) {
                  e.preventDefault();
                }
              }}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <div className={styles.halfInput}>
            <label className={styles.label}>Company Address</label>
            <input
              className={styles.input}
              type="text"
              name="company_address"
              value={formState?.company_address}
              onChange={handleInputChange}
              placeholder="Enter company address"
            />
          </div>
          <div className={styles.halfInput}>
            <label className={styles.label}>Website</label>
            <input
              className={styles.input}
              type="text"
              name="company_website"
              value={formState.company_website}
              onChange={handleInputChange}
              placeholder="Enter website url"
            />
          </div>
        </div>
      </div>

      <div className={styles.infoCard}>
        <h3 className={styles.companyLocation}>Business Location</h3>
        <div className={styles.infoSubtext}>
          This won’t affect the areas you’ve selected to receive leads from.
        </div>
        <p className={styles.secondaryText}>
          Please provide your business address to help customers find your local
          services on Localists.com.
        </p>
        {!hideAddress && (
          <>
            <label className={styles.label}>
              What’s your business address?
            </label>
            <input
              className={styles.input}
              type="text"
              name="company_location"
              value={[
                viewProfileData?.apartment,
                viewProfileData?.address,
                viewProfileData?.city,
                viewProfileData?.zipcode,
                viewProfileData?.country,
              ]
                .filter(Boolean)
                .join(", ")}
              onChange={handleInputChange}
              placeholder="Enter your business location"
            />
          </>
        )}

        <label style={{ marginTop: "16px" }} className={styles.label}>
          Can’t provide a specific location?
        </label>
        <select
          className={`${styles.input} ${styles.customSelect}`}
          name="company_locaion_reason"
          value={formState.company_locaion_reason}
          onChange={handleInputChange}
        >
          <option value="">Select a reason</option>
          <option value="No reason">No reason</option>
          <option value="Remote business">Remote business</option>
        </select>
      </div>
      <div className={styles.infoCard}>
        <h3 className={styles.aboutCompany}>About Your Business</h3>
        <p className={styles.secondaryTextCustomers}>
          Introduce your company to customers on Localists.com.
        </p>
        <div className={styles.flexRow}>
          <div className={styles.flexItem}>
            <label className={styles.label}>Team Size</label>
            <select
              className={`${styles.input} ${styles.customSelect}`}
              name="company_size"
              value={details?.company_size}
              onChange={handleInputChange}
            >
              <option value="">How many people work in your business</option>
              <option value="Self-employed, Sole trader">
                Self-employed, Sole trader
              </option>
              <option value="2-10">2–10 employees</option>
              <option value="11-50">11–50 employees</option>
              <option value="51-200">51–200 employees</option>
              <option value="200+">200+ employees</option>
            </select>
          </div>
          <div className={styles.flexItem}>
            <label className={styles.label}>Years in Business</label>
            <input
              className={styles.input}
              type="text"
              name="company_total_years"
              value={formState.company_total_years}
              onChange={handleInputChange}
              placeholder="How long have you been operating"
            />
          </div>
        </div>
        <label className={styles.label}>Describe Your Business</label>
        <textarea
          className={styles.textarea}
          rows={7}
          name="about_company"
          value={formState.about_company}
          onChange={handleInputChange}
          placeholder="What makes your business stand out? Tell customers why they should choose you."
        />
        <p className={styles.charLimit}>Minimum 20 characters</p>
      </div>

      <div className={styles.buttonRow}>
        {showLoader ? (
          <Flex style={{ marginLeft: "auto" }}>
            <Spin
              indicator={<LoadingOutlined spin />}
              className={styles.saveBtn}
            />
          </Flex>
        ) : (
          <button
            className={styles.saveBtn}
            style={{ marginLeft: "auto" }}
            onClick={handleSubmit}
          >
            Save
          </button>
        )}
      </div>
      {success && (
        <p style={{ color: "green" }}>Profile updated successfully!</p>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default AboutAccordion;
