import { useState, useEffect, useRef } from "react";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import styles from "./BuyerAccountSettings.module.css";
import iIcon from "../../assets/Images/iIcon.svg";
import defaultImage from "../../assets/Images/DefaultProfileImage.svg";
import Webcam from "react-webcam";
import {
  updatePasswordData,
  updateProfileData,
  updateProfileImageData,
  updateUserIfoData,
} from "../../store/Buyer/BuyerSlice";
import { useDispatch, useSelector } from "react-redux";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { showToast, updateLocalStorageValue } from "../../utils";
import { setUserToken } from "../../store/Auth/authSlice";
import { setRegisterData } from "../../store/FindJobs/findJobSlice";
import { baseURL } from "../../Api/axiosInstance";

const BuyerAccountSettings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { getuploadImg, infoLoader, changePasswordLoader, profileImageLoader } =
    useSelector((state) => state.buyer);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const webcamRef = useRef(null);
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
    profile_image: "",
  });
  const userNameFirstLetter = userDetails?.name?.[0] || "";

  useEffect(() => {
    dispatch(updateProfileData());
  }, [dispatch]);

  useEffect(() => {
    if (Array.isArray(getuploadImg) && getuploadImg.length > 0) {
      const userData = getuploadImg[0];
      setUserDetails({
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        profile_image: userData.profile_image || "",
      });
    }
  }, [getuploadImg]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image_file", file);

      dispatch(updateProfileImageData(formData)).then((result) => {
        if (result) {
          showToast("success", result?.message);
        }
      });
    }
  };

  const capturePhoto = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        const byteString = atob(imageSrc.split(",")[1]);
        const mimeString = imageSrc.split(",")[0].split(":")[1].split(";")[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: mimeString });
        const file = new File([blob], "camera-photo.jpg", {
          type: mimeString,
        });

        const formData = new FormData();
        formData.append("image_file", file);
        dispatch(updateProfileImageData(formData));
        setIsCameraOpen(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (!/^\+?\d{10,13}$/.test(userDetails?.phone)) {
      showToast("error", "Please enter a valid 10-digit phone number.");
      return;
    }
    const infoData = {
      name: userDetails.name,
      email: userDetails.email,
      phone: userDetails.phone,
    };
    dispatch(updateUserIfoData(infoData)).then((result) => {
      if (result?.success) {
        updateLocalStorageValue("barkUserToken", "name", userDetails?.name);
        updateLocalStorageValue("registerDataToken", "name", userDetails?.name);
        const storedData = localStorage.getItem("barkUserToken");
        const registerData = localStorage.getItem("registerDataToken");

        const parsedData = JSON.parse(storedData);
        const registerDatas = JSON.parse(registerData);
        if (parsedData) {
          parsedData.name = userDetails?.name;
          dispatch(setUserToken(parsedData));
        }
        if (registerDatas) {
          registerDatas.name = userDetails?.name;
          dispatch(setRegisterData(registerDatas));
        }
        showToast(
          "info",
          result?.message || "User Update Details successfully!"
        );
      }
    });
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const [formData, setFormData] = useState({
    password: "",
    password_confirmation: "",
    error: "",
  });
  const BASE_IMAGE_URLs = `${baseURL}storage/app/public/images/users`;

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value, error: "" });
  };

  const handleSavePassword = () => {
    const { password, password_confirmation } = formData;

    if (!password || !password_confirmation) {
      setFormData({
        ...formData,
        error: "Please enter password.",
      });
      return;
    }

    if (password !== password_confirmation) {
      setFormData({
        ...formData,
        error: "New password and confirm password must match.",
      });
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>/?]).{8,}$/;

    if (!passwordRegex.test(password)) {
      setFormData({
        ...formData,
        error:
          "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.",
      });
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("password", password);
    formDataToSend.append("password_confirmation", password_confirmation);

    dispatch(updatePasswordData(formDataToSend)).then((result) => {
      if (result?.success) {
        showToast(
          "success",
          result?.message || "Password updated successfully!"
        );
        setFormData({
          password: "",
          password_confirmation: "",
          error: "",
        });
      }
      setIsModalOpen(false);
    });
  };

  const hanldeRequest = () => {
    navigate("/buyers/create");
  };

  useEffect(() => {
    if (isModalOpen || isCameraOpen) {
      document.body.style.overflow = "hidden";
      window.scroll(0, 0);
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen, isCameraOpen]);

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "environment",
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Account settings</h2>

      <div className={styles.infoBox}>
        <p>
          <span>
            <img src={iIcon} alt="Profile" />
          </span>
          <div>
            <div style={{ fontWeight: "800", marginBottom: "10px" }}>
              {" "}
              Make sure your contact details are up to date so professionals can
              reach you.
            </div>

            <div>
              If you no longer need the service, please remember to close your
              request.
            </div>
          </div>
        </p>
        <Link className={styles.requestButton} to="/buyers/create">
          Go to My Requests
        </Link>
      </div>

      <div className={styles.detailsBox}>
        <h3 className={styles.subHeading}>My details</h3>
        <div className={styles.profileSection}>
          <div className={styles.profileImage}>
            <span>
              <>
                {profileImageLoader ? (
                  <Spin
                    indicator={
                      <LoadingOutlined spin style={{ color: "blue" }} />
                    }
                  />
                ) : userDetails?.profile_image ? (
                  <img
                    src={`${BASE_IMAGE_URLs}/${userDetails.profile_image}`}
                    alt="Profile"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = defaultImage;
                    }}
                    style={{
                      width: "62px",
                      height: "62px",
                      borderRadius: "50%",
                    }}
                  />
                ) : (
                  <div className={styles.CompanyText}>
                    {userNameFirstLetter?.toUpperCase()}
                  </div>
                )}
              </>
            </span>
          </div>
          <div className={styles.uploadButtons}>
            <label className={styles.uploadButton}>
              Upload
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: "none" }}
              />
            </label>
          </div>
        </div>

        {isCameraOpen && (
          <div className={styles.modalOverlay}>
            <div className={styles.cameraModal}>
              <div className={styles.cameraContainer}>
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                  style={{ width: "100%" }}
                />
              </div>
              <div className={styles.saveButtonWrapperModal}>
                <button
                  className={styles.modalCancelButton}
                  onClick={() => setIsCameraOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className={styles.modalSaveButton}
                  onClick={capturePhoto}
                >
                  Capture Photo
                </button>
              </div>
            </div>
          </div>
        )}

        <div className={styles.formGroup}>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={userDetails.name}
            onChange={handleChange}
            className={styles.inputField}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Phone number</label>
          <input
            type="text"
            name="phone"
            value={userDetails.phone}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value) && value.length <= 10) {
                handleChange(e);
              }
            }}
            className={styles.inputField}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={userDetails.email}
            onChange={handleChange}
            className={styles.inputField}
            disabled
          />
        </div>

        <div className={styles.formGroupPassword}>
          <label>Password</label>
          <button
            className={styles.changePasswordButton}
            onClick={() => setIsModalOpen(true)}
          >
            Change Password
          </button>
        </div>
      </div>

      <div className={styles.saveButtonWrapper}>
        <button className={styles.saveButton} onClick={handleSubmit}>
          {infoLoader ? (
            <Spin
              indicator={<LoadingOutlined spin style={{ color: "white" }} />}
            />
          ) : (
            "Save Changes"
          )}
        </button>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Change Password</h3>
            </div>

            {/* New Password Field */}
            <div className={styles.formGroup}>
              <label>New Password</label>
              <div className={styles.passwordField}>
                <input
                  type={newPasswordVisible ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleFormChange}
                  className={`${styles.inputField} ${
                    formData.error ? styles.inputError : ""
                  }`}
                />
                <span
                  onClick={() => setNewPasswordVisible(!newPasswordVisible)}
                  className={styles.eyeIcon}
                >
                  {!newPasswordVisible ? (
                    <EyeInvisibleOutlined />
                  ) : (
                    <EyeOutlined />
                  )}
                </span>
              </div>
              {formData.error && (
                <p className={styles.error}>{formData.error}</p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Confirm New Password</label>
              <div className={styles.passwordField}>
                <input
                  type={confirmPasswordVisible ? "text" : "password"}
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleFormChange}
                  className={`${styles.inputField} ${
                    formData.error ? styles.inputError : ""
                  }`}
                />
                <span
                  onClick={() =>
                    setConfirmPasswordVisible(!confirmPasswordVisible)
                  }
                  className={styles.eyeIcon}
                >
                  {!confirmPasswordVisible ? (
                    <EyeInvisibleOutlined />
                  ) : (
                    <EyeOutlined />
                  )}
                </span>
              </div>
              {formData.error && (
                <p className={styles.error}>{formData.error}</p>
              )}
            </div>

            <div className={styles.saveButtonWrapperModal}>
              <button
                className={styles.modalCancelButton}
                onClick={() => setIsModalOpen(false)}
                disabled={changePasswordLoader}
              >
                Cancel
              </button>
              <button
                className={styles.modalSaveButton}
                onClick={handleSavePassword}
              >
                {changePasswordLoader ? (
                  <Spin
                    indicator={
                      <LoadingOutlined spin style={{ color: "white" }} />
                    }
                  />
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerAccountSettings;
