import { useEffect, useState } from "react";
import styles from "./CookieConsent.module.css";

const CookieConsent = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const userConsent = localStorage.getItem("user-consent");

    if (!userConsent) {
      setShow(true);
    }
    window.uetq = window.uetq || [];
    window.uetq.push("consent", "default", { ad_storage: "denied" });
  }, []);

  const handleConsent = (value) => {
    if (typeof window === "undefined") return;

    localStorage.setItem("user-consent", value);

    window.uetq = window.uetq || [];
    window.uetq.push("consent", "update", { ad_storage: value });

    setShow(false);
  };

  if (!show) return null;

  return (
    <>
      <div className={styles.overlay} />

      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.content}>
            <div className={styles.leftSection}>
              <h3 className={styles.title}>
                Tailor my experience with cookies
              </h3>
              <p className={styles.text}>
                Localists uses cookies and similar technologies to personalise
                my experience, serve me relevant content, and improve Localists
                products and services. By clicking ‘Accept’ I agree to this, as
                further described in the Localists Cookie Policy. I can reject
                non-essential cookies by clicking ‘Decline’.
                {/* <a 
                  href="http://localists.com/en/gb/cookie-policy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Localists Cookie Policy
                </a>
                . */}
              </p>
            </div>

            <div className={styles.rightSection}>
              <button
                onClick={() => handleConsent("denied")}
                className={styles.rejectButton}
              >
                Declined
              </button>

              <button
                onClick={() => handleConsent("granted")}
                className={styles.acceptButton}
              >
                Accept All Cookies
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CookieConsent;
