import { useEffect, useRef, useState } from "react";
import styles from "./ReviewsAccordion.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  clearFacebookReviewStatus,
  getCustomerLinkApi,
  updateFacebookReviewLink,
  createUserTokenApiCall,
  getUserTokenApicall,
} from "../../../store/MyProfile/myProfileSlice";
import axiosInstance from "../../../Api/axiosInstance";
import { toast } from "react-toastify";
import { showToast } from "../../../utils";
import ReviewSection from "../../ViewProfile/Reviews/Reviews";
import { useNavigate, useParams } from "react-router-dom";
import facebookIcon from "../../../assets/Icons/facebook.svg";
import whatsUpIcon from "../../../assets/Icons/whatsup.svg";
import linkedInIcon from "../../../assets/Icons/linkedin.svg";
import twitterIcon from "../../../assets/Icons/twitter.svg";
import shareIcon from "../../../assets/Icons/share.svg";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useKeenSlider } from "keen-slider/react";
import { addViewProfileList } from "../../../store/LeadSetting/leadSettingSlice";

const ReviewsAccordion = ({ details }) => {
  const [fbLink, setFbLink] = useState("");
  const [isFbSdkReady, setIsFbSdkReady] = useState(false);
  const [googleLink, setGoogleLink] = useState("");

  const [fbReviews, setFbReviews] = useState([]);
  const navigate = useNavigate();

  const [isShareOpen, setIsShareOpen] = useState(false);
  const onCopyUrl = () => {
    navigator.clipboard.writeText(customerLinkData);
    showToast("success", "Link copied to clipboard!");
  };
  const { viewProfileData } = useSelector((state) => state.leadSetting);
  const requestId = useParams();
  const shouldDisableActions = requestId?.requestId;

  const dispatch = useDispatch();
  const {
    customerLinkData,
    facebookReviewUpdateSuccess,
    facebookReviewUpdateError,
  } = useSelector((state) => state.myProfile);

  const { userToken } = useSelector((state) => state.auth);
  const { registerData } = useSelector((state) => state.findJobs);
  const user_id = userToken?.id ? userToken?.id : registerData?.id;

  const handleSubmit = () => {
    dispatch(updateFacebookReviewLink(fbLink));
  };
  useEffect(() => {
    dispatch(getCustomerLinkApi());
  }, []);

  useEffect(() => {
    if (facebookReviewUpdateSuccess) {
      const sellerData = {
        seller_id: user_id,
      };
      dispatch(addViewProfileList(sellerData));
      dispatch(clearFacebookReviewStatus());
      toast.success("Facebook review link saved successfully!");
    } else if (facebookReviewUpdateError) {
      toast.error(`Error: ${facebookReviewUpdateError}`);
      dispatch(clearFacebookReviewStatus());
    }
  }, [facebookReviewUpdateSuccess, facebookReviewUpdateError, dispatch]);

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(
      `Check my review link: ${customerLinkData}`
    )}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      customerLinkData
    )}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      customerLinkData
    )}&text=${encodeURIComponent("Check my review link!")}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      customerLinkData
    )}`,
  };

  useEffect(() => {
    const checkSdk = () => {
      if (window.isFacebookSdkReady) {
        setIsFbSdkReady(true);
      } else {
        const timer = setTimeout(checkSdk, 200);
        return () => clearTimeout(timer);
      }
    };

    checkSdk();
  }, []);

  const handleFacebookLogin = async () => {
    const review = await dispatch(getUserTokenApicall());

    if ((review.status = true)) {
      const reviewsResponse = await fetch(
        `https://graph.facebook.com/v20.0/${review.message.page_id}/ratings?access_token=${review.message.page_access_token}`
      );

      const reviewsData = await reviewsResponse.json();

      if (reviewsData && reviewsData.data && reviewsData.data.length > 0) {
        setFbReviews(reviewsData.data);
      }
    }
    if (
      review?.status === false ||
      (review?.status === true && review?.message?.expired === "yes")
    ) {
      if (window.FB) {
        const requiredScopes = [
          "public_profile",
          "pages_show_list",
          "pages_read_user_content",
        ].join(",");

        window.FB.login(
          function (response) {
            if (response.authResponse) {
              (async () => {
                try {
                  const userAccessToken = response.authResponse.accessToken;

                  const accessToken = await dispatch(
                    createUserTokenApiCall(userAccessToken)
                  );

                  if (accessToken) {
                    const updatedReview = await dispatch(getUserTokenApicall());
                  }

                  showToast(
                    "success",
                    "Successfully logged into Facebook. Fetching pages..."
                  );
                } catch (err) {
                  console.error("Error in API call:", err);
                  showToast(
                    "error",
                    "Error while fetching user token from backend."
                  );
                }
              })();
            } else {
              console.error("Facebook Login Failed or Cancelled.");
              showToast("error", "Facebook login was cancelled or denied.");
            }
          },
          { scope: requiredScopes }
        );
      }
    } else {
      showToast("error", "Facebook SDK is still loading. Please try again.");
    }
  };

  const login = useGoogleLogin({
    flow: "auth-code",
    scope:
      "openid email profile https://www.googleapis.com/auth/business.manage",
    onSuccess: async (response) => {
      try {
        const tokenRes = await axiosInstance.post("/google/get-auth-token", {
          code: response.code,
        });

        const accessToken = tokenRes.data.data.access_token;
        const refreshToken = tokenRes.data.data.refresh_token;

        const reviewsRes = await axios.post(
          "https://dev.localists.com/google/get-reviews",
          {
            access_token: accessToken,
            refresh_token: refreshToken,
          }
        );

        localStorage.setItem("google_access_token", accessToken);
        localStorage.setItem(
          "google_refresh_token",
          tokenRes.data.data.refreshToken
        );
      } catch (err) {
        console.error("Error:", err.response?.data || err.message);
      }
    },
    onError: (error) => console.log("Login failed:", error),
  });

  const sliderRef = useRef(null);
  const [sliderInstanceRef, slider] = useKeenSlider({
    loop: true,
    slides: { perView: 1, spacing: 15 },
  });

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? fbReviews.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === fbReviews.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className={styles.wrapper}>
      <p className={styles.sectionTitle}>Collect More Reviews</p>

      <div className={styles.fieldGroup}>
        <label className={styles.reviewsLabel}>Share your review link</label>
        <div className={styles.row}>
          <input
            type="text"
            className={styles.input}
            value={customerLinkData}
            readOnly
          />
          <button className={styles.secondaryBtn} onClick={onCopyUrl}>
            Copy Link
          </button>
          {customerLinkData && (
            <button
              className={styles.secondaryBtn}
              onClick={() => setIsShareOpen(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                justifyContent: "center",
              }}
            >
              <span>Share</span>
              <img
                src={shareIcon}
                alt="Share"
                style={{
                  height: "18px",
                  width: "18px",
                }}
              />
            </button>
          )}
        </div>
      </div>

      {isShareOpen && (
        <div className={styles.shareOverlay}>
          <div className={styles.shareBox}>
            <h3>Share via</h3>
            <div className={styles.iconRow}>
              <a href={shareLinks.whatsapp} target="_blank" rel="noreferrer">
                <img
                  src={whatsUpIcon}
                  alt="WhatsApp"
                  style={{ height: "36px", width: "36px" }}
                />
              </a>
              <a href={shareLinks.facebook} target="_blank" rel="noreferrer">
                <img
                  src={facebookIcon}
                  alt="Facebook"
                  style={{ height: "36px", width: "36px" }}
                />
              </a>
              <a href={shareLinks.twitter} target="_blank" rel="noreferrer">
                <img
                  src={twitterIcon}
                  alt="X"
                  style={{ height: "36px", width: "36px" }}
                />
              </a>
              <a href={shareLinks.linkedin} target="_blank" rel="noreferrer">
                <img
                  src={linkedInIcon}
                  alt="LinkedIn"
                  style={{ height: "36px", width: "36px" }}
                />
              </a>
            </div>
            <button
              onClick={() => setIsShareOpen(false)}
              className={styles.secondaryBtn}
              style={{ marginTop: "15px" }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* <div className={styles.fieldGroup}>
        <label className={styles.fbLabel}>
          <img src={FacebookLogo} alt="Facebook" className={styles.fbIcon} />
          Import Google Reviews
        </label>
        <p className={styles.subtext}>
          Import reviews from your business Google page.
        </p>
        <div className={styles.row}>
          <input
            type="text"
            placeholder="e.g. https://www.google.com/en/..."
            className={styles.input}
            value={googleLink}
            onChange={(e) => setGoogleLink(e.target.value)}
          />
         
          <button className={styles.importBtn} onClick={() => login()}>
            Login with Google
          </button>
         
        </div>
      </div> */}

      <label className={styles.reviewsLabel}>Localists.com Reviews</label>
      {/* <div className={styles.localistBox}>
        <strong>You don’t have any reviews yet on Localists.com</strong>
        <p>
          Your reviews can come from any of your customers — not just those found through Localists.com. Add them today add improve new business wins!
        </p>
        <ReviewSection details={viewProfileData} showSummary={false} />
      </div> */}
      <div
        className={`${styles.localistBox} ${
          (viewProfileData?.reviews_count ?? 0) > 5 ? styles.scrollBox : ""
        }`}
      >
        {viewProfileData?.reviews_count > 0 ? (
          <ReviewSection details={viewProfileData} showSummary={false} />
        ) : (
          <>
            <strong>You don’t have any reviews yet on Localists.com</strong>
            <p>
              Your reviews can come from any of your customers — not just those
              found through Localists.com. Add them today and improve new
              business wins!
            </p>
          </>
        )}
      </div>

      {/* <div className={styles.fieldGroup}>
        <label className={styles.fbLabel}>
          <img src={FacebookLogo} alt="Facebook" className={styles.fbIcon} />
          Import Facebook & Instagram Reviews
        </label>
        <p className={styles.subtext}>
          Import reviews from your business Facebook page.
        </p>
        <div className={styles.row}>
          <input
            type="text"
            placeholder="e.g. https://www.facebook.com/en/..."
            className={styles.input}
            value={fbLink}
            onChange={(e) => setFbLink(e.target.value)}
          />
          <button
            className={styles.importBtn}
            onClick={handleFacebookLogin}
            // disabled={!isFbSdkReady}
          >
            Import Reviews
          </button>
        </div>
      </div> */}
      {/* <div className={styles.reviewsContainer}>
        <div className={styles.arrowIconsWrapper}>
          <span className={styles.leftArrowWrapper}>
            <img
              src={leftArrow}
              alt="Left"
              className={styles.arrowIcon}
              // onClick={() => slider.current?.prev()}
              onClick={() => {
                slider.current?.prev();
              }}
            />
          </span>

          <span className={styles.rightArrowWrapper}>
            <img
              src={rightArrow}
              alt="Right"
              className={styles.arrowIcon}
              onClick={() => slider.current?.next()}
            />
          </span>
        </div>
        <div>
          {fbReviews.map((rev, idx) => (
            <div
              key={idx}
              className={`${styles.reviewCard} ${
                idx === 0 ? styles.activeCard : ""
              }`}
            >
              <div className={styles.reviewHeader}>
                <div className={styles.avatarSection}>
                  <div className={styles.avatar}>
                    {rev.reviewer?.name?.[0] || "?"}
                  </div>
                  <div className={styles.reviewerName}>
                    {rev.reviewer?.name || "Test User"}
                  </div>
                </div>

                <div className={styles.reviewDate}>
                  {new Date(rev.created_time).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              </div>

              <div className={styles.reviewStars}>
                {Array.from({ length: rev.rating }, (_, i) => (
                  <span key={i}>⭐</span>
                ))}
              </div>

              <p className={styles.reviewText}>
                {rev.review_text || "No text provided."}
              </p>
            </div>
          ))}
        </div>
      </div> */}

      {/* <div className={styles.buttonRow}>
        <button className={styles.saveBtn} onClick={handleSubmit}>
          Save
        </button>
      </div> */}
    </div>
  );
};

export default ReviewsAccordion;
