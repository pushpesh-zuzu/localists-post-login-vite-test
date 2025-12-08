import { useEffect, useState } from "react";
import styles from "./AccountDetails.module.css";
import iIcon from "../../assets/Images/iIcon.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  sellerEditProfileApi,
  sellerPhoneNumberVerifyApi,
  sellerUpdatePasswordApi,
  sellerUpdateProfileApi,
} from "../../store/MyProfile/myProfileSlice";
import { Link, useNavigate } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { showToast } from "../../utils";
import ChangePasswordModal from "./ChangePasswordModal";
import blackArrow from "../../assets/Images/Leads/blackArrowRight.svg";
import OtpModal from "./OtpModal";

const AccountDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { registerData } = useSelector((state) => state.findJobs);
  const { userToken } = useSelector((state) => state.auth);
  const { editProfileList, sellerLoader } = useSelector(
    (state) => state.myProfile
  );
  const [show, setShow] = useState(false);
  const [btndisable, setBtnDisble] = useState(false);
  const [contactData, setContactData] = useState({
    email: "",
    phone: "",
    sms_notification_no: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const [formData, setFormData] = useState({
    password: "",
    password_confirmation: "",
    error: "",
  });

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value, error: "" });
  };

  const handleSavePassword = () => {
    const { password, password_confirmation } = formData;

    if (!password || !password_confirmation) {
      setFormData({
        ...formData,
        error: "Please fill out both password fields.",
      });
      return;
    }

    if (password !== password_confirmation) {
      setFormData({
        ...formData,
        error: "Passwords do not match.",
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

    dispatch(sellerUpdatePasswordApi(formDataToSend)).then((result) => {
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
        setIsModalOpen(false);
      } else {
        setFormData((prev) => ({
          ...prev,
          error: result?.message || "Failed to update password.",
        }));
      }
    });
  };

  useEffect(() => {
    if (editProfileList) {
      setContactData({
        email: editProfileList.email || "",
        phone: editProfileList.phone || "",
        sms_notification_no: editProfileList.sms_notification_no || "",
      });
    }
  }, [editProfileList]);
  const userId = userToken?.remember_tokens ?? registerData?.remember_tokens;
  const userIdNew = userToken?.id ? userToken?.id : registerData?.id;
  useEffect(() => {
    const data = {
      user_id: userId,
    };
    dispatch(sellerEditProfileApi(data));
  }, []);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 10) return;
      setBtnDisble(false);
    }
    const updatedData = {
      ...contactData,
      [name]: value,
    };

    setContactData(updatedData);
  };
  const handleSubmit = () => {
    const data = {
      user_id: userId,
      email: contactData?.email,
      phone: contactData?.phone,
      name: editProfileList?.name,
      sms_notification_no: contactData?.sms_notification_no,
    };
    dispatch(sellerUpdateProfileApi(data)).then((result) => {
      if (result) {
        showToast("success", result?.message);
        const data = {
          user_id: userId,
        };
        dispatch(sellerEditProfileApi(data));
      }
    });
  };
  const handleBack = () => {
    navigate("/settings");
  };
  const handleVerifyNumber = () => {
    const data = {
      phone_number: contactData?.phone,
      user_id: userIdNew,
    };
    dispatch(sellerPhoneNumberVerifyApi(data)).then((result) => {
      if (result) {
        showToast("success", result.message);
        setShow(true);
        setBtnDisble(true);
      }
    });
  };
  return (
    <>
      <div className={styles.container}>
        <div className={styles.backText} onClick={handleBack}>
          <img src={blackArrow} alt="..." /> Settings
        </div>
        <h1 className={styles.heading}>Account Details</h1>
        <div className={styles.manageWrapper}>
          <span className={styles.infoIcon}>
            <img src={iIcon} alt="iIcon" />
          </span>
          <p className={styles.description}>
            Manage your account email, phone number, password, and login
            information. These details are used to contact you but are not
            shared with customers. To manage what customers see—like your public
            email or phone number—visit your{" "}
            <Link to="/settings/profile/my-profile" className={styles.link}>
              My Profile
            </Link>{" "}
            settings .
          </p>
        </div>

        <div className={styles.card}>
          <h3 className={styles.subHeading}>Contact details</h3>
          <p className={styles.note}>
            These details are used for lead notifications, and to contact you
            about important account issues. Please ensure they’re kept
            up-to-date.
          </p>

          <label className={styles.label}>Account email</label>
          <input
            type="email"
            className={styles.input}
            name="email"
            value={contactData.email}
            onChange={handleInputChange}
          />

          <label className={styles.label}>Preferred contact number</label>
          <input
            type="text"
            className={styles.input}
            name="phone"
            value={contactData.phone}
            onChange={handleInputChange}
          />
          <button
            className={styles.verifyNumberBtn}
            onClick={handleVerifyNumber}
          >
            Verify Number
          </button>

          <label className={styles.label}>SMS notification number</label>
          <input
            type="text"
            className={styles.input}
            name="sms_notification_no"
            value={contactData.sms_notification_no}
            onChange={handleInputChange}
            maxLength={10}
          />
          {
            <div className={styles.btnBox}>
              <button
                className={styles.saveBtn}
                onClick={handleSubmit}
                disabled={!btndisable}
              >
                {sellerLoader ? (
                  <Spin
                    indicator={
                      <LoadingOutlined spin style={{ color: "blue" }} />
                    }
                  />
                ) : (
                  "Save"
                )}
              </button>
            </div>
          }
        </div>

        <div className={styles.passwordSection}>
          <h4 className={styles.subHeading}>Change Password</h4>
          <p className={styles.note}>
            It’s important to keep your password up-to-date.
          </p>
          <button
            className={styles.button}
            onClick={() => setIsModalOpen(true)}
          >
            Change Password
          </button>
        </div>
      </div>
      {isModalOpen && (
        <ChangePasswordModal
          isOpen={isModalOpen}
          formData={formData}
          newPasswordVisible={newPasswordVisible}
          confirmPasswordVisible={confirmPasswordVisible}
          setNewPasswordVisible={setNewPasswordVisible}
          setConfirmPasswordVisible={setConfirmPasswordVisible}
          handleFormChange={handleFormChange}
          handleSavePassword={handleSavePassword}
          setIsModalOpen={setIsModalOpen}
          loading={true}
        />
      )}

      {show && (
        <OtpModal
          open={show}
          phoneData={contactData?.phone}
          onClose={() => setShow(false)}
        />
      )}
    </>
  );
};

export default AccountDetails;
