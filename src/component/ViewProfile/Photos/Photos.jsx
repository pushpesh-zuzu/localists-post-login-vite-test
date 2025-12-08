import React, { useEffect, useRef, useState } from "react";
import styles from "./Photos.module.css";
import DummyImage from "../../../assets/Images/DummyImage.svg";
import paginationImg from "../../../assets/Icons/MyResponse/paginationImg.svg";
import leftpaginationImg from "../../../assets/Icons/MyResponse/rightPagenationImg.svg";
import { BASE_IMAGE, BASE_IMAGE_URL } from "../../../utils";
import { baseURL } from "../../../Api/axiosInstance";

// // ✅ Correct base URL
// const BASE_IMAGE = `${baseURL}/storage/app/public/images/users`;

const Photos = ({ details }) => {
  // ✅ Access company_photos string
  const photoString = details?.user_details?.company_photos;
  const photoArray = photoString ? photoString.split(",").filter(Boolean) : [];

  const containerRef = useRef(null);
  const [showPagination, setShowPagination] = useState(false);

  const [previewImg, setPreviewImg] = useState(null);

  useEffect(() => {
    if (containerRef.current) {
      const { scrollWidth, clientWidth } = containerRef.current;
      setShowPagination(scrollWidth > clientWidth);
    }
  }, [photoArray]);

  return (
    <div className={styles.photoContainer}>
      <h2>Photos</h2>

      <div className={styles.photosContainer}>
        {photoArray.length > 0
          ? photoArray.map((img, index) => (
              <img
                key={index}
                src={`${BASE_IMAGE}/users/${img.trim()}`}
                alt={`Company Photo ${index + 1}`}
                className={styles.profileImg}
                onClick={() =>
                  setPreviewImg(`${BASE_IMAGE}/users/${img.trim()}`)
                }
              />
            ))
          : // <img src={DummyImage} alt="Profile" className={styles.profileImg} />
            ""}
      </div>

      {/* {photoArray.length > 1 && ( */}
      {showPagination && (
        <div className={styles.paginationBox}>
          <img src={leftpaginationImg} alt="left" />
          <img src={paginationImg} alt="right" />
        </div>
      )}

      {/* {previewImg && (
        <div
          className={styles.modalOverlay}
          onClick={() => setPreviewImg(null)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <img src={previewImg} alt="Preview" className={styles.previewImg} />
            <button
              className={styles.closeBtn}
              onClick={() => setPreviewImg(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )} */}
      {previewImg && (
        <div
          className={styles.modalOverlay}
          onClick={() => setPreviewImg(null)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <img src={previewImg} alt="Preview" className={styles.previewImg} />
            <button
              className={styles.closeBtn}
              onClick={() => setPreviewImg(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Photos;
