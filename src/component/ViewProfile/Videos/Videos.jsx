import React, { useState } from "react";
import styles from "./Videos.module.css";
// import playIcon from "../../assets/Images/playIcon.svg"; // 🧩 make sure you have a play icon in assets

const Videos = ({ details }) => {
  let data =
    details?.photos?.company_youtube_link ||
    details?.details?.company_youtube_link;

  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch {
      data = [data];
    }
  }

  const [activeVideo, setActiveVideo] = useState(null);

  const getYoutubeId = (url) => {
    if (!url) return null;
    const strUrl = String(url).trim();
    const match = strUrl.match(
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/
    );
    return match ? match[1] : null;
  };

  return (
    <div className={styles.videos_container}>
      <h2>Videos</h2>
      <div className={styles.videos_list}>
        {Array.isArray(data) && data.length > 0 ? (
          data.map((url, index) => {
            const videoId = getYoutubeId(url);
            if (!videoId) return null;

            const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

            return (
              <div
                key={index}
                className={styles.video_thumbnail}
                onClick={() =>
                  setActiveVideo(`https://www.youtube.com/embed/${videoId}`)
                }
              >
                <img
                  src={thumbnailUrl}
                  alt={`YouTube video ${index}`}
                  className={styles.thumbnail_image}
                />
                <div className={styles.play_overlay}>
                  {/* <img src={playIcon} alt="Play" className={styles.play_icon} /> */}
                </div>
              </div>
            );
          })
        ) : (
          <p>No videos available</p>
        )}
      </div>

      {activeVideo && (
        <div className={styles.overlay} onClick={() => setActiveVideo(null)}>
          <div
            className={styles.video_modal}
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            <iframe
              src={`${activeVideo}?autoplay=1`}
              title="Full screen video"
              frameBorder="0"
              allow="autoplay; fullscreen; encrypted-media"
              allowFullScreen
            ></iframe>
            <div className={styles.close_btn_wrapper}>
              <button
                className={styles.close_btn}
                onClick={() => setActiveVideo(null)}
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Videos;
