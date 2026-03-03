import { useEffect, useState } from "react";
import styles from "./BadgeModal.module.css";
import { POST_LOGIN_BASE_URL } from "../../utils";
import { Link } from "react-router-dom";

const BadgeModal = ({
  onClose,
  companyName = "",
  userId = "",
  companySlug,
}) => {
  const [size, setSize] = useState("medium");
  const [color, setColor] = useState("navy");
  const [copyText, setCopyText] = useState("Copy");
  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.initLocalistsWidget) {
        window.initLocalistsWidget();
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [size, color]);
  const publicProfileUrl = `${POST_LOGIN_BASE_URL}/view-profile/${companySlug.toLowerCase()}/${userId}`;
  const embedCode = `<a href="${publicProfileUrl}" target="_blank" style="text-decoration:none;display:inline-block;">
  <div class="localists-widget" data-type="reviews" data-size="${size}" data-color="${color}" data-id="${userId}" data-version="1.0">${companyName}</div>
</a>
<script type="text/javascript" src="${POST_LOGIN_BASE_URL}/widget.js" defer></script>`;
  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopyText("Copied");

    setTimeout(() => {
      setCopyText("Copy");
    }, 1500);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.closeIcon} onClick={onClose}>
          ✕
        </div>

        <h2 className={styles.heading}>Choose your professional badge</h2>

        {/* SIZE */}
        <label className={styles.label}>Select Size</label>
        <div className={styles.section}>
          <label>
            <input
              type="radio"
              checked={size === "large"}
              onChange={() => setSize("large")}
            />
            <span>Large</span>
          </label>

          <label>
            <input
              type="radio"
              checked={size === "medium"}
              onChange={() => setSize("medium")}
            />
            <span>Medium</span>
          </label>

          <label>
            <input
              type="radio"
              checked={size === "small"}
              onChange={() => setSize("small")}
            />
            <span>Small</span>
          </label>
        </div>

        {/* COLOR */}
        {/* <label className={styles.label}>Select Color</label>
        <div className={styles.section}>
          <label>
            <input
              type="radio"
              checked={color === "navy"}
              onChange={() => setColor("navy")}
            />
            <span>Navy</span>
          </label>

          <label>
            <input
              type="radio"
              checked={color === "gold"}
              onChange={() => setColor("gold")}
            />
            <span>Gold</span>
          </label>
        </div> */}

        {/* PREVIEW */}
        <div className={styles.preview}>
          <Link
            target="_blank"
            rel="noopener noreferrer"
            // onClick={(e) => e.preventDefault()}
            to={publicProfileUrl}
            style={{ textDecoration: "none" }}
          >
            <div
              className="localists-widget"
              data-size={size}
              data-color={color}
            ></div>
          </Link>
        </div>

        {/* CODE */}
        <label className={styles.labelcode}>Code</label>

        <span className={styles.labelcodeSpan}>
          Copy the code below and paste it on your website
        </span>
        <div className={styles.codeWrapper}>
          <input
            type="text"
            readOnly
            value={embedCode}
            className={styles.codeInput}
          />

          <button onClick={handleCopy} className={styles.copyBtn}>
            {copyText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BadgeModal;
