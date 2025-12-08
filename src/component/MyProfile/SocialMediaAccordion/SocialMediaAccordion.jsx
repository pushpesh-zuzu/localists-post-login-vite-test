import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  updateSellerSocialLinks,
  clearSocialUpdateStatus,
  setIsDirtyRedux,
} from "../../../store/MyProfile/myProfileSlice";
import { useEffect, useState } from "react";
import styles from "./SocialMediaAccordion.module.css";
import iIcon from "../../../assets/Images/iIcon.svg";
import { addViewProfileList } from "../../../store/LeadSetting/leadSettingSlice";
import { LoadingOutlined } from "@ant-design/icons";
import { Flex, Spin } from "antd";

const platforms = [
  {
    key: "fb_link",
    label: "Facebook",
    placeholder: "https://www.facebook.com/yourpage",
    optional: "has_fb_link",
  },
  {
    key: "twitter_link",
    label: "X",
    placeholder: "https://x.com/yourhandle",
    optional: "has_twitter_link",
  },
  {
    key: "tiktok_link",
    label: "Tik Tok",
    placeholder: "https://www.tiktok.com/@yourname",
    optional: "has_tiktok_link",
  },
  {
    key: "insta_link",
    label: "Instagram",
    placeholder: "https://www.instagram.com/yourhandle",
    optional: "has_insta_link",
  },
  // { key: "linkedin_link", label: "Linkedin", placeholder: "https://www.linkedin.com/in/yourname" },
  {
    key: "linkedin_link",
    label: "Linkedin",
    placeholder: "https://uk.linkedin.com/yourname",
    optional: "has_linkedin_link",
  },
];

const urlPatterns = {
  fb_link: /^(https?:\/\/)?(www\.)?facebook\.com\/[A-Za-z0-9_.-]+\/?(\?.*)?$/,
  twitter_link: /^(https?:\/\/)?(www\.)?x\.com\/[A-Za-z0-9_]+\/?(\?.*)?$/,
  insta_link:
    /^(https?:\/\/)?(www\.)?instagram\.com\/[A-Za-z0-9_.-]+\/?(\?.*)?$/,
  linkedin_link:
    /^(https?:\/\/)?((www|[a-z]{2})\.)?linkedin\.com\/(in|company)\/[A-Za-z0-9_-]+\/?$/,
  tiktok_link:
    /^(https?:\/\/)?(www\.)?tiktok\.com\/(@[A-Za-z0-9_.-]+)\/?(\?.*)?$/,
};

const SocialMediaAccordion = ({ details }) => {
  const dispatch = useDispatch();
  const { socialUpdateSuccess, socialUpdateError, isDirtyRedux } = useSelector(
    (state) => state.myProfile
  );

  const { userToken } = useSelector((state) => state.auth);
  const { registerData } = useSelector((state) => state.findJobs);
  const user_id = userToken?.id ? userToken?.id : registerData?.id;
  const [formState, setFormState] = useState({
    type: "social_media",
    fb_link: "",
    twitter_link: "",
    tiktok_link: "",
    insta_link: "",
    linkedin_link: "",
    extra_links: "",
  });

  const [errors, setErrors] = useState({});
  const [showLoader, setShowLoader] = useState(false);
  const [hiddenFields, setHiddenFields] = useState({
    has_fb_link: details.has_fb_link || 0,
    has_twitter_link: details.has_twitter_link || 0,
    has_tiktok_link: details.has_tiktok_link || 0,
    has_insta_link: details.has_insta_link || 0,
    has_linkedin_link: details.has_linkedin_link || 0,
    has_extra_links: details.has_extra_links || 0,
  });

  // const toggleFieldVisibility = (key) => {
  //   setHiddenFields((prev) => ({
  //     ...prev,
  //     [key]: !prev[key],
  //   }));
  // };

  const toggleFieldVisibility = (key) => {
    setHiddenFields((prev) => {
      const updatedFields = { ...prev, [key]: prev[key] ? 0 : 1 };
      dispatch(setIsDirtyRedux(true));
      return updatedFields;
    });
  };

  const validateField = (name, value) => {
    if (!value || hiddenFields[name]) return ""; // Optional or hidden
    const pattern = urlPatterns[name];
    if (pattern && !pattern.test(value)) {
      return "Invalid URL format";
    }
    return "";
  };

  const validateAll = () => {
    const newErrors = {};
    Object.keys(formState).forEach((key) => {
      const err = validateField(key, formState[key]);
      if (err) newErrors[key] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    const errMsg = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: errMsg }));
    dispatch(setIsDirtyRedux(true));
  };

  const handleSubmit = async () => {
    if (!validateAll()) {
      toast.error("Please fix validation errors before submitting.");
      return;
    }

    const cleanedLinksString = formState.extra_links
      ?.replace(/[\r\n]+/g, " ") // replace newlines with spaces
      .replace(/\s+/g, " ") // collapse multiple spaces/tabs
      .replace(/\s*,\s*/g, ",") // normalize commas (no spaces around yet)
      .replace(/\s+/g, ",") // convert leftover spaces to commas
      .replace(/,+/g, ",") // collapse multiple commas
      .replace(/^,|,$/g, "") // remove leading/trailing commas
      .trim();

    // Step 2: Split into array and validate
    const linksArray = cleanedLinksString ? cleanedLinksString.split(",") : [];

    // Only keep valid links (must contain http(s):// or www.)
    const validLinks = linksArray.filter((link) =>
      /^(https?:\/\/|www\.)/i.test(link.trim())
    );

    // Step 3: If any invalid links were removed, show an error toast
    if (linksArray.length !== validLinks.length) {
      toast.error(
        "Please enter valid links (must start with http://, https://, or www.)"
      );
      return;
    }

    // Step 4: Build cleaned data (add a single space after each comma)
    const cleanedData = {
      ...formState,
      extra_links: validLinks.map((link) => link.trim()).join(", "),
      ...hiddenFields,
    };
    if (isDirtyRedux) {
      setShowLoader(true);
      const data = await dispatch(updateSellerSocialLinks(cleanedData));
      dispatch(setIsDirtyRedux(false));
      setShowLoader(false);
    } else {
      toast.error("No data found to save");
    }
  };

  useEffect(() => {
    if (socialUpdateSuccess) {
      dispatch(clearSocialUpdateStatus());
      const sellerData = {
        seller_id: user_id,
      };
      dispatch(addViewProfileList(sellerData));
      dispatch(setIsDirtyRedux(false));
      toast.success("Social media links updated successfully!");
    } else if (socialUpdateError) {
      toast.error(`Error: ${socialUpdateError}`);
      dispatch(clearSocialUpdateStatus());
    }
  }, [socialUpdateSuccess, socialUpdateError, dispatch]);

  useEffect(() => {
    if (details) {
      setFormState((prev) => ({
        ...prev,
        fb_link: details.fb_link || "",
        twitter_link: details.twitter_link || "",
        tiktok_link: details.tiktok_link || "",
        insta_link: details.insta_link || "",
        linkedin_link: details.linkedin_link || "",
        extra_links: details.extra_links || "",
      }));
    }
  }, [details]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h3 className={styles.heading}>Social Media</h3>
        <p className={styles.subtext}>
          Add your business’s social media profiles to help build trust.
          Customers often check these when deciding who to hire.
        </p>

        {platforms.map((platform, idx) => (
          <div className={styles.inputRow} key={idx}>
            <div className={styles.labelWrapper}>
              <label className={styles.label}>{platform.label}</label>
              {/* {platform.label !== "Linkedin" && ( */}
              <div className={styles.optionalToggle}>
                <img src={iIcon} alt="info" className={styles.icon} />
                <span className={styles.optionalText}>Optional</span>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={
                      hiddenFields[platform.optional] == 1 ? true : false
                    }
                    onChange={() => toggleFieldVisibility(platform?.optional)}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>
              {/* )} */}
            </div>
            {!hiddenFields[platform.optional] && (
              <>
                <div className={styles.inputWithToggle}>
                  <input
                    className={styles.input}
                    type="text"
                    name={platform.key}
                    value={formState[platform.key]}
                    placeholder={platform.placeholder}
                    onChange={handleChange}
                  />
                </div>
                {errors[platform.key] && (
                  <p className={styles.error}>{errors[platform.key]}</p>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      <div className={styles.card}>
        <div className={styles.header}>
          <h3 className={styles.heading}>Promote Your Business</h3>
          <div className={styles.optionalToggle}>
            <img src={iIcon} alt="info" className={styles.icon} />
            <span className={styles.optionalText}>Optional</span>
            {/* <label className={styles.switch}>
              <input
                type="checkbox"
                checked={hiddenFields["has_extra_links"] == 1 ? true : false}
                onChange={() =>
                  toggleFieldVisibility(!hiddenFields["has_extra_links"])
                }
              />
              <span className={styles.slider}></span>
            </label> */}
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={hiddenFields["has_extra_links"] == 1 ? true : false}
                onChange={() => toggleFieldVisibility("has_extra_links")}
              />
              <span className={styles.slider}></span>
            </label>
          </div>
        </div>
        <div className={styles.labelWrapper}>
          <p className={styles.subtext}>
            Share links to your website, articles, or other online content to
            help customers learn more about your services & business.
          </p>
        </div>
        {hiddenFields["has_extra_links"] == 0 && (
          <div className={styles.inputWithToggle}>
            <textarea
              className={styles.textarea}
              rows={3}
              placeholder="Enter one link per line"
              name="extra_links"
              value={formState.extra_links}
              onChange={handleChange}
            />
          </div>
        )}
      </div>
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
  );
};

export default SocialMediaAccordion;
