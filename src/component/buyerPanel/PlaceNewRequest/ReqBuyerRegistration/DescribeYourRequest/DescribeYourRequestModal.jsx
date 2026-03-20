import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../Modal/Modal";
import VerifyIcon from "../../../../../ReactIcon/VerifyIcon";
import { useNavigate } from "react-router";
import {
    addDetailsRequestData,
    addImageSubmittedData,
    clearSetbuyerRequestData,
    setBuyerStep,
    setQualityData,
} from "../../../../../store/Buyer/BuyerSlice";
import { clearBuyerRegisterFormData } from "../../../../../store/FindJobs/findJobSlice";
import styles from "./DescribeYourRequestModal.module.css";

const DescribeYourRequestModal = ({ nextStep, progressPercent, sellers, setShowConfirmModal }) => {
    const [text, setText] = useState("");
    const [files, setFiles] = useState([]);
    const [professionalContact, setProfessionalContact] = useState(false);
    const [textError, setTextError] = useState(false);
    const [fileError, setFileError] = useState(false);

    const { requestId, buyerStep } = useSelector(
        (state) => state.buyer,
    );
    const dispatch = useDispatch();
    const router = useNavigate();

    const handleChange = (e) => {
        setText(e.target.value);
        setTextError(false);
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);

        if (selectedFiles.length === 0) {
            setFileError(true);
            return;
        }

        setFiles(selectedFiles);
        setFileError(false);

        const formData = new FormData();
        formData.append("request_id", requestId);
        selectedFiles.forEach((file) => {
            formData.append("image_file", file);
        });

        dispatch(addImageSubmittedData(formData));
    };

    const handleSubmit = async () => {
        let hasError = false;
        if (hasError) return;

        const detailsData = {
            request_id: requestId,
            details: text,
            professional_letin: professionalContact ? 1 : 0,
        };

        const hasSellers = sellers && sellers.length > 0;
        const selectedRouter = hasSellers ? { push: () => { } } : router;

        await dispatch(
            addDetailsRequestData(detailsData, selectedRouter, requestId)
        );

        if (hasSellers) {
            nextStep();
        } else {
            dispatch(clearSetbuyerRequestData());
            dispatch(clearBuyerRegisterFormData());
            dispatch(setQualityData());
            dispatch(setBuyerStep(10));
            setShowConfirmModal(false);
        }
    };

    return (
        <Modal
            isOpen={true}
            onNext={handleSubmit}
            buyerStep={buyerStep}
            fixedHeight={true}
            showProgressBar={true}
            showClosIcon={false}
            showButtons={true}
            nextButtonText="See my matches"
            viewMatchesIcon={true}
            viewMatches={false}
            progressPercent={progressPercent}
            overlayClassName={styles.overlay}
            containerClassName={styles.container}
            buttonGroupClassName={styles.buttonGroup}
            nextButtonClassName={styles.nextBtn}
        >
            <div className={styles.contentWrapper}>
                {buyerStep === 10 ? (
                    <div className={styles.spinnerWrapper}>
                        <span className={styles.spinner} />
                    </div>
                ) : (
                    <>
                        <div className={styles.titleSection}>
                            <h6 className={styles.submittedHeading}>
                                <VerifyIcon className={styles.verifyIcon} />
                                <span>Your request has been submitted</span>
                            </h6>

                            <h4 className={styles.mainTitle}>
                                Tell us more about what you need for{" "}
                                <span className={styles.desktopBreak}>
                                    <span className={styles.desktopIndent}>better responses</span>
                                </span>
                                <span className={styles.mobileBreak}>
                                    better responses
                                </span>
                            </h4>
                        </div>
                        <textarea
                            className={`${styles.textarea} ${textError ? styles.textareaError : styles.textareaNormal}`}
                            value={text}
                            onChange={handleChange}
                            placeholder="What should the professional know to better understand your request? (Provide any relevant details here.)"
                            rows={4}
                        />

                        {textError && (
                            <span className={styles.errorMsg}>
                                Please fill this input field.
                            </span>
                        )}

                        <label
                            className={`${styles.uploadLabel} ${fileError ? styles.uploadLabelError : ""}`}
                        >
                            <svg
                                className={styles.uploadIcon}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="white"
                                strokeWidth="2"
                            >
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            <span>Upload photos or files (optional)</span>
                            <input
                                type="file"
                                multiple
                                style={{ display: "none" }}
                                onChange={handleFileChange}
                                accept="image/png, image/jpg, image/jpeg"
                            />
                        </label>

                        <p className={styles.fileHint}>
                            Image (jpeg, jpg, png) file can be uploaded
                        </p>

                        {fileError && (
                            <span className={styles.errorMsg}>
                                Please upload a file.
                            </span>
                        )}

                        {files.length > 0 && (
                            <ul className={styles.fileList}>
                                {files.map((file, index) => (
                                    <li key={index} className={styles.fileItem}>
                                        {file.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </>
                )}
            </div>
        </Modal>
    );
};

export default DescribeYourRequestModal;