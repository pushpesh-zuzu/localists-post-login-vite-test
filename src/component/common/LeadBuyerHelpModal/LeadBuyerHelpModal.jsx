import React from "react";
import "./LeadBuyerHelpModal.css";

const LeadBuyerHelpModal = ({ onClose }) => {

    const handleContactClick = () => {
        sessionStorage.setItem("leadBuyerPopup", "true");
        if (onClose) onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <button
                    className="modal-close-btn"
                    onClick={onClose}
                    aria-label="Close modal"
                >
                    ×
                </button>
                <h2 className="modal-title">
                    Call the team for any assistance
                </h2>

                <p className="modal-description">
                    Our team is here to help you understand the platform, choose the right
                    plan, and get the best results from your account.
                </p>

                <div className="modal-actions">
                    <a
                        href="tel:+441544303023"
                        className="primary-btn"
                        onClick={handleContactClick}
                    >
                        Call Our Team
                    </a>
                </div>

            </div>
        </div>
    );
};

export default LeadBuyerHelpModal;
