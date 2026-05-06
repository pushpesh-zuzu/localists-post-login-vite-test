"use client";

import React from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";
import styles from "./RequestBuyerModal.module.css";
import BackButtonOTP from "../../../../../ReactIcon/BackButtonOTP";
import Paragraph from "../UI/Paragraph";
import NewBuyerRequestProgressBarQuotesRequest from "../ProgressBarQuoteRequest/NewBuyerRequestProgressBarQuotesRequest ";

const RequestBuyerModal = ({
  isOpen,
  onClose,
  children,
  title,
  nextButtonText = "Next",
  BackButtonText = "Back",
  onNext,
  onBack,
  onBackDisable = false,
  titleClassName = "text-left",
  showButtons = true,
  zIndex = 50,
  showClosIcon = true,
  borderRadius = "36px",
  nextButtonClassName = "",
  disabled = false,
  usePortal = false,
  overlayBgColor = "",
  buyerStep,
  fixedHeight,
  showProgressBar = false,
  viewMatches = false,
  progressPercent,
  viewMatchesIcon,
  marginTop = "10vh",
  minHeight = "300px",
  minHeightMd = "400px",
  maxHeight = "",
  subHeading = "",
  description = "",
  errorMessage = "",
  contentMaxHeight = "250px",
  contentMaxHeightMd = "450px",
  showBackIcon = true,
}) => {
  if (!isOpen) return null;

  const modalContent = (
    <div
      className={styles.overlay}
      style={{
        zIndex,
        ...(overlayBgColor ? { backgroundColor: overlayBgColor } : {}),
      }}
    >
      <div
        className={styles.modal}
        style={{
          borderRadius,
          marginTop,
          minHeight,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.inner}>

          {/* ── Header: Title + Close ── */}
          <div className={styles.header}>
            {title && (
              <div className={styles.titleWrap}>
                <h4
                  className={styles.title}
                  style={{textAlign:'left'}}
                >
                  {title}
                </h4>
              </div>
            )}

            <button
              onClick={onClose}
              className={showClosIcon ? styles.closeBtn : styles.closeBtnHidden}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          {/* ── Progress Bar ── */}
          {showProgressBar && (
            <div className={`${styles.progressWrap} ${fixedHeight ? styles.progressWrapFixed : ""}`}>
              <NewBuyerRequestProgressBarQuotesRequest
                value={progressPercent}
                buyerStep={buyerStep}
              />
            </div>
          )}

          {/* ── Sub-heading ── */}
          {subHeading && (
            <Paragraph className={styles.subHeading}>{subHeading}</Paragraph>
          )}

          {/* ── Description ── */}
          {description && (
            <Paragraph className={styles.description}>
              {description}
            </Paragraph>
          )}

          {/* ── Scrollable Content ── */}
          <div
            className={styles.content}
            // style={{ maxHeight: contentMaxHeight }}
          >
            {children}
          </div>

          {/* ── Error Message ── */}
          {errorMessage && (
            <p className={styles.errorMessage}>{errorMessage}</p>
          )}

          {/* ── Buttons ── */}
          {showButtons && (onBack || onNext) && (
            <div className={styles.buttonGroup}>

              {/* Back Button */}
              <button
                onClick={onBack}
                disabled={onBackDisable}
                className={styles.backBtn}
              >
                {showBackIcon && (
                  <BackButtonOTP color="white" />
                )}
                <span className={styles.backBtnLabel}>{BackButtonText}</span>
              </button>

              {/* Next Button */}
              {onNext && (
                <button
                  onClick={onNext}
                  disabled={disabled}
                  className={`${styles.nextBtn} ${nextButtonClassName}`}
                >
                  {nextButtonText}
                </button>
              )}
            </div>
          )}

          {/* ── Privacy Policy ── */}
          {viewMatches && (
            <div className={styles.privacyRow}>
              <p className={styles.privacyText}>
                Your information is protected by our{" "}
                <a
                  href="/en/gb/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.privacyLink}
                >
                  privacy policy
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return usePortal ? createPortal(modalContent, document.body) : modalContent;
};

export default RequestBuyerModal;