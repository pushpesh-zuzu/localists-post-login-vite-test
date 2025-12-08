import { useEffect, useState } from "react";
import styles from "./PhotosAccordion.module.css";
import iIcon from "../../../assets/Images/iIcon.svg";

import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  updateSellerPhotos,
  clearPhotoUpdateStatus,
  setIsDirtyRedux,
} from "../../../store/MyProfile/myProfileSlice";
import { LoadingOutlined } from "@ant-design/icons";
import { Flex, Spin } from "antd";
import AddYoutubeModal from "./AddYoutubeModal";
import { baseURL } from "../../../Api/axiosInstance";
import { BASE_IMAGE } from "../../../utils";
import { addViewProfileList } from "../../../store/LeadSetting/leadSettingSlice";

const PhotosAccordion = ({ details }) => {
  const dispatch = useDispatch();
  const { photoUpdateSuccess, photoUpdateError, sellerLoader, isDirtyRedux } =
    useSelector((state) => state.myProfile);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [formState, setFormState] = useState({
    type: "photos",
    company_photos: [],
    company_youtube_link: [],
    company_youtube_links: [],
    has_youtube_link: 0,
  });

  const [existingPhotos, setExistingPhotos] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [linkData, setLinkData] = useState("");
  const [hasytLink, setHasytLink] = useState(details?.has_youtube_link || 0);
  const [showLoader, setShowLoader] = useState(false);

  const handleRemovePhoto = (indexToRemove) => {
    setPhotoPreviews((prevPhotos) =>
      prevPhotos.filter((_, idx) => idx !== indexToRemove)
    );

    // Remove from existing photos
    setExistingPhotos((prev) => prev.filter((_, idx) => idx !== indexToRemove));

    // ✅ Also remove from formState.company_photos
    setFormState((prev) => ({
      ...prev,
      company_photos: prev.company_photos.filter(
        (_, idx) => idx !== indexToRemove
      ),
    }));

    // Mark form as dirty
    dispatch(setIsDirtyRedux(true));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    setFormState((prev) => ({
      ...prev,
      company_photos: [...prev.company_photos, ...files],
    }));

    const previews = files.map((file) => URL.createObjectURL(file));
    setPhotoPreviews((prev) => [...prev, ...previews]);
    dispatch(setIsDirtyRedux(true));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLinkData(value);
    dispatch(setIsDirtyRedux(true));
  };

  const { userToken } = useSelector((state) => state.auth);
  const { registerData } = useSelector((state) => state.findJobs);
  const user_id = userToken?.id ? userToken?.id : registerData?.id;

  const validate = () => {
    return true;
  };

  useEffect(() => {
    if (photoUpdateSuccess) {
      dispatch(clearPhotoUpdateStatus());
      const sellerData = {
        seller_id: user_id,
      };
      dispatch(addViewProfileList(sellerData));
      dispatch(setIsDirtyRedux(false));
      toast.success("Photos updated successfully!");
    } else if (photoUpdateError) {
      toast.error(`Failed: ${photoUpdateError}`);
      dispatch(clearPhotoUpdateStatus());
    }
    setFormState((prev) => ({
      ...prev,
      company_photos: [], // remove uploaded files
    }));

    // ✅ Clear previews for new files (keep existing photos)
    setPhotoPreviews((prev) => prev.filter((src) => !src.startsWith("blob:")));
  }, [photoUpdateSuccess, photoUpdateError, dispatch]);

  const handleSubmit = async () => {
    if (!validate()) {
      toast.warn("Please fix validation errors");
      return;
    }

    const body = new FormData();

    body.append("type", formState.type);

    const uniqueExisting = [...new Set(existingPhotos)];
    uniqueExisting.forEach((filename, index) => {
      body.append(`existing_photos[${index}]`, filename);
    });

    // ✅ Only new files
    const newFiles = formState.company_photos.filter(
      (file) => file instanceof File
    );
    newFiles.forEach((file, index) => {
      body.append(`company_photos[${index}]`, file);
    });

    // ✅ YouTube links
    if (formState.company_youtube_link?.length > 0) {
      formState.company_youtube_link.forEach((link, index) => {
        if (link && link.trim()) {
          body.append(`company_youtube_link[${index}]`, link.trim());
        }
      });
    }

    // ✅ Add has_youtube_link to body
    if (
      formState.has_youtube_link !== undefined &&
      formState.has_youtube_link !== null
    ) {
      body.append("has_youtube_link", formState.has_youtube_link);
    }

    if (isDirtyRedux) {
      setShowLoader(true);

      const res = await dispatch(updateSellerPhotos(body)); // <-- this works
      console.log("RES:", res);

      dispatch(setIsDirtyRedux(false));
      setShowLoader(false);
    } else {
      toast.error("No data found to save");
    }
  };

  const handleSave = () => {
    if (!linkData) {
      toast.warn("Please enter a YouTube link.");
      return;
    }

    if (!getYoutubeEmbedUrl(linkData)) {
      toast.warn("Invalid YouTube link.");
      return;
    }

    setFormState((prev) => ({
      ...prev,
      company_youtube_link: [...prev.company_youtube_link, linkData],
    }));

    setAddModalOpen(false);
    setLinkData("");
  };

  const handleOpen = () => {
    setAddModalOpen(true);
  };

  const getYoutubeEmbedUrl = (url) => {
    if (!url) return null;

    // Make sure it's always treated as a string
    const strUrl = String(url).trim();

    const match = strUrl.match(
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/
    );

    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  const handleCancel = () => {
    setFormState({
      type: "user_details",
      company_photos: [],
      company_youtube_link: "",
    });
    setPhotoPreviews([]);
  };

  useEffect(() => {
    if (details) {
      const photoFilenames = details.company_photos
        ? details.company_photos.split(",").map((item) => item.trim())
        : [];

      const previews = photoFilenames.map(
        (filename) => `${BASE_IMAGE}/users/${filename}`
      );
      setExistingPhotos(photoFilenames);
      setPhotoPreviews(previews);
    }
  }, [details]);

  useEffect(() => {
    if (details) {
      let youtubeLinks = [];
      if (details.company_youtube_link) {
        try {
          youtubeLinks = JSON.parse(details.company_youtube_link);
        } catch (e) {
          youtubeLinks = [details.company_youtube_link];
        }
      }

      // Ensure it's a flat array of strings
      if (!Array.isArray(youtubeLinks)) youtubeLinks = [youtubeLinks];
      youtubeLinks = youtubeLinks.flat().filter(Boolean).map(String);

      setFormState((prev) => ({
        ...prev,
        company_youtube_links: "",
        company_youtube_link: youtubeLinks, // already an array of strings
      }));

      // ... other photo logic
    }
  }, [details]);

  return (
    <>
      <div className={styles.container}>
        {/* Photos Section */}
        <div className={styles.section}>
          <h3 className={styles.title}>Photos</h3>
          <p className={styles.description}>
            Add photographs and show customers what your business can do. Photos
            are often the first thing people check — whether it’s examples of
            past work, locations, venues, or before-and-after shots.
          </p>
          <label htmlFor="photo-upload" className={styles.uploadBtn}>
            Upload Photos
          </label>
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className={styles.fileInput}
          />
          <div className={styles.imageContainer}>
            {photoPreviews.length > 0 ? (
              <div className={styles.imageContainer}>
                {photoPreviews.map((src, idx) => (
                  <div
                    key={idx}
                    className={styles.photoWrapper}
                    style={{
                      position: "relative",
                      display: "inline-block",
                      margin: "10px",
                    }}
                  >
                    <button
                      type="button"
                      style={{
                        position: "absolute",
                        top: "5px",
                        right: "5px",
                        background: "#fff",
                        border: "none",
                        color: "#333",
                        fontSize: "16px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        borderRadius: "50%",
                        width: "22px",
                        height: "22px",
                        lineHeight: "20px",
                        textAlign: "center",
                        boxShadow: "0 0 4px rgba(0,0,0,0.2)",
                      }}
                      onClick={() => handleRemovePhoto(idx)}
                    >
                      ×
                    </button>
                    <img
                      src={src}
                      alt={`preview-${idx}`}
                      width="150"
                      height="150"
                      className={styles.previewImage}
                    />
                    {/* ❌ Delete button */}
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.paraText}>
                Photos you upload will be displayed on your Localists.com
                profile.
              </div>
            )}
          </div>
        </div>

        {/* Videos Section */}
        <div className={styles.section}>
          <div className={styles.videoHeader}>
            <h3 className={styles.title}>Add Videos to Your Profile</h3>
            <div className={styles.optional}>
              <img src={iIcon} alt="info" className={styles.icon} />
              <span className={styles.optionalText}>Optional</span>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={hasytLink == 1 ? true : false}
                  onChange={() => {
                    setHasytLink(!hasytLink);
                    setFormState((prev) => ({
                      ...prev,
                      has_youtube_link: hasytLink ? 0 : 1,
                    }));
                    dispatch(setIsDirtyRedux(true));
                  }}
                />
                <span className={styles.slider}></span>
              </label>
            </div>
          </div>
          <p className={styles.description}>
            Bring your services to life with YouTube, Instagram or TikTok
            videos. Share past projects, events, or examples of your work to
            help customers see your expertise in action.
          </p>
          {hasytLink == 0 && (
            <>
              <button className={styles.uploadBtn} onClick={handleOpen}>
                Add YouTube Video Links
              </button>
              <div className={styles.imageContainer}>
                {Array.isArray(formState.company_youtube_link) &&
                formState.company_youtube_link.length > 0 ? (
                  <div className={styles.videoContainer}>
                    {/* {formState.company_youtube_link?.map((link, idx) => (
                  <iframe
                    key={idx}
                    width="215"
                    height="200"
                    src={getYoutubeEmbedUrl(link)}
                    title={`YouTubes video ${idx + 1}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className={styles.videoPreview}
                  />
                ))} */}
                    {formState.company_youtube_link?.map((link, idx) => (
                      <div
                        key={idx}
                        className={styles.videoWrapper}
                        style={{
                          position: "relative",
                          display: "inline-block",
                          margin: "10px",
                        }}
                      >
                        {/* ❌ Delete Button */}
                        <button
                          type="button"
                          style={{
                            position: "absolute",
                            top: "5px",
                            right: "5px",
                            background: "#fff",
                            border: "none",
                            color: "#333",
                            fontSize: "16px",
                            fontWeight: "bold",
                            cursor: "pointer",
                            borderRadius: "50%",
                            width: "22px",
                            height: "22px",
                            lineHeight: "20px",
                            textAlign: "center",
                            boxShadow: "0 0 4px rgba(0,0,0,0.2)",
                          }}
                          onClick={() =>
                            setFormState((prev) => ({
                              ...prev,
                              company_youtube_link:
                                prev.company_youtube_link.filter(
                                  (_, i) => i !== idx
                                ),
                            }))
                          }
                        >
                          ×
                        </button>

                        {/* 🎥 YouTube Preview */}
                        <iframe
                          width="215"
                          height="200"
                          src={getYoutubeEmbedUrl(link)}
                          title={`YouTube video ${idx + 1}`}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className={styles.videoPreview}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.paraText}>
                    Your videos will appear directly on your Localists.com
                    profile.
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer Buttons */}
        <div className={styles.footer}>
          {showLoader ? (
            <Flex style={{ marginLeft: "auto" }}>
              <Spin
                indicator={<LoadingOutlined spin />}
                className={styles.saveButton}
              />
            </Flex>
          ) : (
            <button
              className={styles.saveButton}
              style={{ marginLeft: "auto" }}
              onClick={handleSubmit}
            >
              Save
            </button>
          )}
        </div>
      </div>
      {addModalOpen && (
        <>
          <AddYoutubeModal
            isOpen={addModalOpen}
            onClose={() => setAddModalOpen(false)}
            onSave={handleSave}
            formState={formState}
            value={linkData}
            handleInputChange={handleInputChange}
          />
        </>
      )}
    </>
  );
};

export default PhotosAccordion;
