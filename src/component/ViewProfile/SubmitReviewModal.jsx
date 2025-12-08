import { useEffect, useState } from "react";
import styles from "./ViewProfile.module.css";
import { showToast } from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import {
  addSubmitReviewApi,
  getReviewListApi,
} from "../../store/MyProfile/myProfileSlice";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const SubmitReviewModal = ({
  isOpen,
  closeModal,
  ProfileIDs,
  reviewsData,
  onReviewSubmit,
  reviewProfileData,
  setCallInitialApi,
}) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const dispatch = useDispatch();
  const { reviewLoader } = useSelector((state) => state.myProfile);
  const { userToken } = useSelector((state) => state.auth);
  const { registerData } = useSelector((state) => state.findJobs);
  const userId = userToken?.id ? userToken?.id : registerData?.id;
  const UUIDs = ProfileIDs ? ProfileIDs : reviewsData?.uuid;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    review: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    rating: "",
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const { name, email, review } = formData;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const newErrors = {
      name: !name.trim() ? "Name is required." : "",
      email: !email.trim()
        ? "Email is required."
        : !emailRegex.test(email)
        ? "Enter a valid email."
        : "",
      rating: !rating ? "Rating is required." : "",
    };

    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some((err) => err !== "");
    if (hasErrors) return;

    const data = { ...formData, ratings: rating, uuid: UUIDs };

    dispatch(addSubmitReviewApi(data)).then((result) => {
      if (result) {
        showToast("success", result?.message);
        closeModal();
        dispatch(getReviewListApi(UUIDs));
        onReviewSubmit?.();
      }
    });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.closeButton} onClick={closeModal}>
          X
        </div>
        <h2>
          Rate your experience with {reviewProfileData?.business_profile_name}
        </h2>
        <div className={styles.ratingSection}>
          <span>Click to rate :</span>
          {[...Array(5)].map((_, index) => {
            const currentRating = index + 1;
            return (
              <span
                key={index}
                className={`${styles.star} ${
                  currentRating <= (hover ?? rating) ? styles.active : ""
                }`}
                onClick={() => {
                  setRating(currentRating);
                  setErrors((prev) => ({ ...prev, rating: "" }));
                }}
                onMouseEnter={() => setHover(currentRating)}
                onMouseLeave={() => setHover(null)}
              >
                ★
              </span>
            );
          })}
        </div>
        {errors.rating && <p className={styles.error}>{errors.rating}</p>}

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Name</label>
            <input
              type="text"
              name="name"
              placeholder="Name"
              className={styles.input}
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <p className={styles.error}>{errors.name}</p>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className={styles.input}
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className={styles.error}>{errors.email}</p>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Your Review</label>
            <textarea
              name="review"
              className={styles.textarea}
              placeholder="What stood out? What worked well? Why did you choose this rating?"
              rows="5"
              value={formData.review}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className={styles.buttonRow}>
          <button onClick={closeModal} className={styles.cancelBtn}>
            Cancel
          </button>
          <button onClick={handleSubmit} className={styles.submitBtn}>
            {reviewLoader ? (
              <Spin
                indicator={<LoadingOutlined spin style={{ color: "white" }} />}
              />
            ) : (
              "Post Review"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmitReviewModal;
