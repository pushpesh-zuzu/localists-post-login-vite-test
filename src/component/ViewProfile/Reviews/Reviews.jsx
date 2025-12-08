import React, { useEffect, useState } from "react";
import styles from "./Reviews.module.css";
import { useDispatch, useSelector } from "react-redux";
import { getReviewListApi } from "../../../store/MyProfile/myProfileSlice";
import moment from "moment";
import SubmitReviewModal from "../SubmitReviewModal";
import { useLocation, useParams } from "react-router-dom";
import starImg from "../../../assets/Icons/MyResponse/StarImg.svg";
import greyStar from "../../../assets/Icons/MyResponse/grayStar.svg";
import webIconImg from "../../../assets/Images/Setting/weblogo.svg";
import halfStar from "../../../assets/Icons/MyResponse/halfStar.svg";
import GoogleIcon from "../../../assets/Icons/Reviews/GoogleIcon.svg";
import FacebookIcon from "../../../assets/Icons/Reviews/FacebookIcon.svg";
import LinkedInIcon from "../../../assets/Icons/Reviews/LinkedInIcon.svg";
import StarIcon from "../../../assets/Icons/Reviews/StarIcon.svg";

const ReviewSection = ({
  details,
  disableReviewButton = false,
  showSummary = true,
}) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [isopen, setIsOpen] = useState(false);
  const [canOpenModal, setCanOpenModal] = useState(false);
  const closeModal = () => setIsOpen(false);
  const profileId = useParams();
  const { userToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { reviewListData } = useSelector((state) => state.myProfile);
  const { registerData } = useSelector((state) => state.findJobs);
  const userId = userToken?.id ? userToken?.id : registerData?.id;
  const UUIDs = profileId?.profileId ? profileId?.profileId : details?.uuid;
  const updatedReviews =
    reviewListData?.length > 0 ? reviewListData : details?.reviews;
  const { viewProfileData, reviewProfileData } = useSelector(
    (state) => state.leadSetting
  );

  let token = localStorage.getItem("barkUserToken");
  token = JSON.parse(token);

  const reviewLength =
    reviewListData?.length > 0
      ? reviewListData.length
      : token && token.remember_tokens
      ? viewProfileData?.reviews_count ??
        reviewProfileData?.reviews_count ??
        details?.reviews_count ??
        0
      : reviewProfileData?.reviews_count ?? details?.reviews_count ?? 0;

  const avgRating = reviewListData?.length
    ? (
        reviewListData.reduce((sum, r) => sum + Number(r.ratings || 0), 0) /
        reviewListData.length
      ).toFixed(1)
    : details?.avg_rating ?? 0;

  const detailsData = (details?.reviews || []).map((item) => item?.ratings);

  useEffect(() => {
    let email = viewProfileData?.email || reviewProfileData?.email;

    let registerDataToken = null;
    const storedRegisterData = localStorage.getItem("registerDataToken");
    const storedBarkData = localStorage.getItem("barkUserToken");

    if (storedRegisterData) {
      registerDataToken = JSON.parse(storedRegisterData);
    } else if (storedBarkData) {
      registerDataToken = JSON.parse(storedBarkData);
    }

    if (
      !registerDataToken ||
      (registerDataToken?.email && registerDataToken.email !== email)
    ) {
      setCanOpenModal(true);
    } else {
      setCanOpenModal(false);
    }
  }, [viewProfileData?.email, reviewProfileData?.email]);

  const handleOpen = () => {
    if (canOpenModal) {
      setIsOpen(true);
    }
  };

  const fetchReviews = () => {
    dispatch(getReviewListApi(UUIDs));
  };

  useEffect(() => {
    fetchReviews();
  }, [UUIDs]);

  return (
    <>
      <div className={styles.reviewList}>
        {showSummary && (
          <div className={styles.reviewHeader}>
            <h2>Reviews{reviewLength > 0 && ` (${reviewLength})`}</h2>

            <div>
              <button
                className={
                  canOpenModal ? styles.leaveBtn : styles.disableLeaveBtn
                }
                onClick={handleOpen}
              >
                Leave a review
              </button>
            </div>
          </div>
        )}
        {showSummary && (
          <div className={styles.container}>
            <div className={styles.left}>
              <div className={styles.score}>
                {avgRating}
                /5
              </div>

              <div className={styles.stars}>
                {Array.from({ length: 5 }).map((_, index) => {
                  const rating =
                    token && token.remember_tokens
                      ? viewProfileData?.avg_rating ??
                        reviewProfileData?.avg_rating ??
                        details?.avg_rating ??
                        0
                      : reviewProfileData?.avg_rating ??
                        details?.avg_rating ??
                        0;
                  if (index < Math.floor(rating)) {
                    return (
                      <img
                        key={index}
                        src={starImg}
                        alt="star"
                        width={19}
                        height={19}
                      />
                    );
                  } else if (index < rating) {
                    return (
                      <img
                        key={index}
                        src={halfStar}
                        alt="half-star"
                        width={21}
                        height={21}
                      />
                    );
                  } else {
                    return (
                      <img
                        key={index}
                        src={greyStar}
                        alt="empty-star"
                        width={19}
                        height={19}
                      />
                    );
                  }
                })}
              </div>
              <div className={styles.totalReviews}>
                {reviewLength} customer reviews
              </div>
            </div>
            <div className={styles.middleBox}></div>

            <div className={styles.right}>
              <p className={styles.asReviewed}>As Reviewed On:</p>
              <div className={styles.reviews_icons}>
                <img src={GoogleIcon} alt="" />
                <img src={FacebookIcon} alt="" />
                <img src={LinkedInIcon} alt="" />
                <img src={StarIcon} alt="" />
              </div>
            </div>
          </div>
        )}
        {updatedReviews?.map((item, index) => (
          <div key={index} className={styles.card}>
            <div className={styles.header}>
              <div className={styles.contentWrapper}>
                <div className={styles.avatarSection}>
                  {item?.profile_img ? (
                    <img
                      src={item?.profile_img}
                      alt={item?.name}
                      className={styles.avatarImage}
                    />
                  ) : (
                    <div className={styles.avatarPlaceholder}>
                      {item?.name?.charAt(0)?.toUpperCase()}
                    </div>
                  )}
                </div>

                <div className={styles.rightContent}>
                  <div className={styles.nameDateRow}>
                    <h3 className={styles.username}>{item?.name}</h3>
                    <span className={styles.dateMobile}>
                      {moment(item.created_at).format("DD-MM-YYYY")}
                    </span>
                  </div>

                  <div className={styles.rating}>
                    {Array(5)
                      .fill(0)
                      .map((_, idx) => (
                        <img
                          key={idx}
                          src={idx < item.ratings ? starImg : greyStar}
                          alt="star"
                          height={20}
                        />
                      ))}
                    <span className={styles.count}>{item?.ratings}</span>
                    <span className={styles.verified}>Verified</span>
                  </div>

                  {item.review && (
                    <h4 className={styles.title}>{item.review}</h4>
                  )}

                  <p className={styles.content}>{item.content}</p>
                </div>
              </div>

              <div className={styles.dateSection}>
                <span className={styles.date}>
                  {moment(item.created_at).format("DD-MM-YYYY")}
                </span>
                {showSummary && (
                  <div className={styles.source}>
                    Source:
                    <img
                      src={webIconImg}
                      alt="source"
                      className={styles.sourceIcon}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {details?.reviews_count > 10 && (
        <div className={styles.pagination}>
          <button className={styles["page-btn"]}>&lt;</button>
          <button className={styles["page-btn"]}>1</button>
          <button className={`${styles["page-btn"]} ${styles.active}`}>
            2
          </button>
          <button className={styles["page-btn"]}>&gt;</button>
        </div>
      )}

      {isopen && (
        <SubmitReviewModal
          isOpen={isopen}
          closeModal={closeModal}
          ProfileIDs={profileId?.profileId}
          reviewsData={details}
          onReviewSubmit={fetchReviews}
          reviewProfileData={details}
        />
      )}
    </>
  );
};

export default ReviewSection;
