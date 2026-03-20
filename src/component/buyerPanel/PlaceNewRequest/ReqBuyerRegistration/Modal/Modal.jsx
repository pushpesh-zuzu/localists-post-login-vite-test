import { createPortal } from "react-dom";
import ProgressBarQuoteRequest from "../ProgressBarQuoteRequest/ProgressBarQuoteRequest";
import LogoIcon from "../../../../../ReactIcon/LogoIcon";
import MenCircle from "../../../../../ReactIcon/MenCircle";
import { Link } from "react-router-dom";
import styles from "./Modal.module.css";
import ArrowLeftIcon from "../../../../../ReactIcon/ArrowLeftIcon";
import CloseIcon from "../../../../../ReactIcon/CloseIcon";
// import { LoadingOutlined } from "@ant-design/icons";
// import { Spin } from "antd";


const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  nextButtonText = "Next",
  BackButtonText = "Back",
  onNext,
  onBack,
  showButtons = true,
  showClosIcon = true,
  nextButtonClassName = "",
  disabled = false,
  usePortal = false,
  buyerStep,
  fixedHeight,
  showProgressBar = false,
  viewMatches = false,
  progressPercent,
  viewMatchesIcon,

  overlayClassName = "",
  containerClassName = "",
  buttonGroupClassName = "",
  titleClassName = "",
}) => {
  if (!isOpen) return null;

  const modalContent = (
    <div className={`${styles.overlay} ${overlayClassName}`}>
      <div
        className={`${styles.container} ${containerClassName}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Logo ── */}
        <div className={styles.logoWrapper}>
          <LogoIcon className={styles.logo} />
        </div>

        {/* ── Close Button ── */}
        {showClosIcon && (
          <button
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Close modal"
          >
            <CloseIcon />
          </button>
        )}

        <div className={styles.body}>
          {/* ── Progress Bar ── */}
          {showProgressBar && (
            <div className={fixedHeight ? styles.progressFixed : undefined}>
              <ProgressBarQuoteRequest
                value={progressPercent}
                buyerStep={buyerStep}
              />
            </div>
          )}

          {/* ── Title ── */}
          {title && (
            <div className={styles.titleWrapper}>
              <h4 className={`${styles.title} ${titleClassName}`}>
                {title}
              </h4>
            </div>
          )}

          {/* ── Scrollable Content ── */}
          <div className={styles.content}>{children}</div>

          {/* ── Buttons ── */}
          {showButtons && (onBack || onNext) && (
            <div className={`${styles.buttonGroup} ${buttonGroupClassName}`}>
              {/* Back */}
              {onBack && (
                <button onClick={onBack} className={styles.backButton}>
                  <ArrowLeftIcon />
                  <span className={styles.backButtonText}>
                    {BackButtonText}
                  </span>
                </button>
              )}

              {/* Next */}
              {onNext && (
                <button
                  onClick={onNext}
                  disabled={disabled}
                  className={`${styles.nextButton} ${nextButtonClassName}`}
                >
                  {viewMatchesIcon && <MenCircle className="w-5 h-5" />}
                  {!disabled && nextButtonText}

                  {/* {disabled ? (
                    <Spin
                      size="small"
                      indicator={
                        <LoadingOutlined
                          spin
                          style={{ color: "white", fontSize: 18 }}
                        />
                      }
                    />
                  ) : (
                    nextButtonText
                  )} */}
                </button>
              )}
            </div>
          )}

          {/* ── Privacy Note ── */}
          {viewMatches && (
            <div className={styles.privacySection}>
              <p className={styles.privacyText}>
                Your information is protected by our{" "}
                <Link
                  href="/en/gb/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.privacyLink}
                >
                  privacy policy
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return usePortal ? createPortal(modalContent, document.body) : modalContent;
};

export default Modal;