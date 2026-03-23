import React, { useState } from "react";
import Modal from "../Modal/Modal";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { clearSetbuyerRequestData, addMultipleManualBid, setBuyerStep, setQualityData } from "../../../../../store/Buyer/BuyerSlice";
import { clearBuyerRegisterFormData } from "../../../../../store/FindJobs/findJobSlice";
import { Spin } from "antd";
import LocationMapIcon from "../../../../../ReactIcon/LocationMapIcon";
import StarIconFeature from "../../../../../ReactIcon/StarIconFeature";
import HalfStarIconFeature from "../../../../../ReactIcon/HalfStarIconFeature";
import GalleryIcon from "../../../../../ReactIcon/GalleryIcon";
import styles from "./SeeMyMatcheModal.module.css";


function SeeMyMatchesModal({ previousStep, progressPercent }) {
    const dispatch = useDispatch();
    const router = useNavigate();

    const {
        autoBidData,
        autoBidListLoader,
        buyerStep,
        requestId,
        requestUserId,
    } = useSelector((state) => state.buyer);

    // const autoBidData = [
    //     {
    //         "service_name": "Roofing",
    //         "sellersCount": 1,
    //         "sellers": [
    //             {
    //                 "id": 1701,
    //                 "name": "Bade67",
    //                 "email": "Bade@gmail.com",
    //                 "phone": "+447894561230",
    //                 "profile_image": "6989ee63d18a5_1770647139.jpg",
    //                 "total_credit": "966",
    //                 "avg_rating": 1,
    //                 "about_company": null,
    //                 "form_status": 1,
    //                 "business_profile_name": "BadeBusineed",
    //                 "company_logo": "6989ee63d0e4f_1770647139.jpg",
    //                 "is_autobid": 1,
    //                 "autobid_pause": 0,
    //                 "user_id": 1705,
    //                 "service_id": 113,
    //                 "miles": "20",
    //                 "nation_wide": 0,
    //                 "postcode": "E11AA",
    //                 "response_time": "15",
    //                 "lat": "51.519018",
    //                 "lng": "-0.058133",
    //                 "distance": 0,
    //                 "user_created_time": "2026-02-09 14:24:17",
    //                 "credit_score": 35,
    //                 "service_name": "Roofing",
    //                 "quicktorespond": 1
    //             },
    //             {
    //                 "id": 1702,
    //                 "name": "Bade67",
    //                 "email": "Bade@gmail.com",
    //                 "phone": "+447894561230",
    //                 "profile_image": "6989ee63d18a5_1770647139.jpg",
    //                 "total_credit": "966",
    //                 "avg_rating": "1.1",
    //                 "about_company": null,
    //                 "form_status": 1,
    //                 "business_profile_name": "BadeBusineed",
    //                 "company_logo": "6989ee63d0e4f_1770647139.jpg",
    //                 "is_autobid": 1,
    //                 "autobid_pause": 0,
    //                 "user_id": 1705,
    //                 "service_id": 113,
    //                 "miles": "20",
    //                 "nation_wide": 0,
    //                 "postcode": "E11AA",
    //                 "response_time": "15",
    //                 "lat": "51.519018",
    //                 "lng": "-0.058133",
    //                 "distance": 0,
    //                 "user_created_time": "2026-02-09 14:24:17",
    //                 "credit_score": 35,
    //                 "service_name": "Roofing",
    //                 "quicktorespond": 1
    //             },
    //             {
    //                 "id": 1703,
    //                 "name": "Bade67",
    //                 "email": "Bade@gmail.com",
    //                 "phone": "+447894561230",
    //                 "profile_image": "6989ee63d18a5_1770647139.jpg",
    //                 "total_credit": "966",
    //                 "avg_rating": "1.4",
    //                 "about_company": null,
    //                 "form_status": 1,
    //                 "business_profile_name": "BadeBusineed",
    //                 "company_logo": "6989ee63d0e4f_1770647139.jpg",
    //                 "is_autobid": 1,
    //                 "autobid_pause": 0,
    //                 "user_id": 1705,
    //                 "service_id": 113,
    //                 "miles": "20",
    //                 "nation_wide": 0,
    //                 "postcode": "E1 1AA",
    //                 "response_time": "15",
    //                 "lat": "51.519018",
    //                 "lng": "-0.058133",
    //                 "distance": 0,
    //                 "user_created_time": "2026-02-09 14:24:17",
    //                 "credit_score": 35,
    //                 "service_name": "Roofing",
    //                 "quicktorespond": 1
    //             },
    //             {
    //                 "id": 1704,
    //                 "name": "Bade67",
    //                 "email": "Bade@gmail.com",
    //                 "phone": "+447894561230",
    //                 "profile_image": "6989ee63d18a5_1770647139.jpg",
    //                 "total_credit": "966",
    //                 "avg_rating": "2.5",
    //                 "about_company": null,
    //                 "form_status": 1,
    //                 "business_profile_name": "BadeBusineed",
    //                 "company_logo": "6989ee63d0e4f_1770647139.jpg",
    //                 "is_autobid": 1,
    //                 "autobid_pause": 0,
    //                 "user_id": 1705,
    //                 "service_id": 113,
    //                 "miles": "20",
    //                 "nation_wide": 0,
    //                 "postcode": "E1 1AA",
    //                 "response_time": "15",
    //                 "lat": "51.519018",
    //                 "lng": "-0.058133",
    //                 "distance": 0,
    //                 "user_created_time": "2026-02-09 14:24:17",
    //                 "credit_score": 35,
    //                 "service_name": "Roofing",
    //                 "quicktorespond": 1
    //             },
    //             {
    //                 "id": 1705,
    //                 "name": "Bade67",
    //                 "email": "Bade@gmail.com",
    //                 "phone": "+447894561230",
    //                 "profile_image": "6989ee63d18a5_1770647139.jpg",
    //                 "total_credit": "966",
    //                 "avg_rating": 2.6,
    //                 "about_company": null,
    //                 "form_status": 1,
    //                 "business_profile_name": "BadeBusineed",
    //                 "company_logo": "6989ee63d0e4f_1770647139.jpg",
    //                 "is_autobid": 1,
    //                 "autobid_pause": 0,
    //                 "user_id": 1705,
    //                 "service_id": 113,
    //                 "miles": "20",
    //                 "nation_wide": 0,
    //                 "postcode": "E1 1AA",
    //                 "response_time": "15",
    //                 "lat": "51.519018",
    //                 "lng": "-0.058133",
    //                 "distance": 0,
    //                 "user_created_time": "2026-02-09 14:24:17",
    //                 "credit_score": 35,
    //                 "service_name": "Roofing",
    //                 "quicktorespond": 1
    //             },
    //             {
    //                 "id": 1706,
    //                 "name": "Bade67",
    //                 "email": "Bade@gmail.com",
    //                 "phone": "+447894561230",
    //                 "profile_image": "6989ee63d18a5_1770647139.jpg",
    //                 "total_credit": "966",
    //                 "avg_rating": 2.9,
    //                 "about_company": null,
    //                 "form_status": 1,
    //                 "business_profile_name": "BadeBusineed",
    //                 "company_logo": "6989ee63d0e4f_1770647139.jpg",
    //                 "is_autobid": 1,
    //                 "autobid_pause": 0,
    //                 "user_id": 1705,
    //                 "service_id": 113,
    //                 "miles": "20",
    //                 "nation_wide": 0,
    //                 "postcode": "E1 1AA",
    //                 "response_time": "15",
    //                 "lat": "51.519018",
    //                 "lng": "-0.058133",
    //                 "distance": 0,
    //                 "user_created_time": "2026-02-09 14:24:17",
    //                 "credit_score": 35,
    //                 "service_name": "Roofing",
    //                 "quicktorespond": 1
    //             },
    //             {
    //                 "id": 1707,
    //                 "name": "Bade67",
    //                 "email": "Bade@gmail.com",
    //                 "phone": "+447894561230",
    //                 "profile_image": "6989ee63d18a5_1770647139.jpg",
    //                 "total_credit": "966",
    //                 "avg_rating": 3.6,
    //                 "about_company": null,
    //                 "form_status": 1,
    //                 "business_profile_name": "BadeBusineed",
    //                 "company_logo": "6989ee63d0e4f_1770647139.jpg",
    //                 "is_autobid": 1,
    //                 "autobid_pause": 0,
    //                 "user_id": 1705,
    //                 "service_id": 113,
    //                 "miles": "20",
    //                 "nation_wide": 0,
    //                 "postcode": "E1 1AA",
    //                 "response_time": "15",
    //                 "lat": "51.519018",
    //                 "lng": "-0.058133",
    //                 "distance": 0,
    //                 "user_created_time": "2026-02-09 14:24:17",
    //                 "credit_score": 35,
    //                 "service_name": "Roofing",
    //                 "quicktorespond": 1
    //             },
    //         ],
    //         "displayCount": "5",
    //         "baseurl": "https://dev.localists.com/admin/storage/app/public/images/users",
    //         "w80": 4,
    //         "repliesListCount": 0
    //     }
    // ]

    const [selectedCompanies, setSelectedCompanies] = useState([]);
    const [showAll, setShowAll] = useState(false);

    const serviceData = autoBidData?.[0];
    const sellers = serviceData?.sellers || [];
    const displayCount = Number(serviceData?.displayCount || 0);

    const visibleSellers = showAll
        ? sellers
        : sellers.slice(0, displayCount);

    const handleCheckboxChange = (company) => {
        const exists = selectedCompanies.find((item) => item.id === company.id);
        if (exists) {
            setSelectedCompanies((prev) => prev.filter((item) => item.id !== company.id));
        } else {
            if (selectedCompanies.length < 5) {
                setSelectedCompanies((prev) => [...prev, company]);
            }
        }
    };

    const handleSubmit = async () => {
        if (!selectedCompanies.length) return;

        const manualBidPayload = {
            service_id: selectedCompanies.map((c) => c.service_id),
            seller_id: selectedCompanies.map((c) => c.user_id),
            bid: selectedCompanies.map((c) => c.credit_score),
            distance: selectedCompanies.map((c) => c.distance),
            lead_id: requestId,
            user_id: requestUserId,
        };

        try {
            await dispatch(addMultipleManualBid(manualBidPayload));
            dispatch(clearSetbuyerRequestData());
            dispatch(clearBuyerRegisterFormData());
            dispatch(setQualityData());
            dispatch(setBuyerStep(10));
            router(`/bids-list/reply/${requestId}`);
        } catch (error) {
            console.error("Manual bid failed:", error);
        }
    };

    const handleBack = () => previousStep();

    return (
        <Modal
            isOpen={true}
            showClosIcon={false}
            title="Select up to 5 companies to get a quote"
            onNext={handleSubmit}
            onBack={handleBack}
            buyerStep={buyerStep}
            fixedHeight={true}
            showProgressBar={true}
            showButtons={true}
            disabled={selectedCompanies.length === 0}
            progressPercent={progressPercent}
            nextButtonText={
                selectedCompanies.length > 0
                    ? `(${selectedCompanies.length}) Send`
                    : "Send"
            }
            overlayClassName={styles.overlay}
            containerClassName={styles.container}
            buttonGroupClassName={styles.buttonGroup}
            titleClassName={styles.titleCenter}
        >
            <div className={styles.contentWrapper}>

                {autoBidListLoader && (
                    <div className={styles.loaderWrapper}>
                        <Spin size="large" />
                    </div>
                )}

                {!autoBidListLoader && serviceData && (
                    <div className={styles.scrollArea}>
                        <div className={styles.sellersGrid}>

                            {visibleSellers.map((company, index) => {
                                const isSelected = selectedCompanies.some(
                                    (item) => item.id === company.id
                                );
                                const disableCheckbox =
                                    !isSelected && selectedCompanies.length >= 5;

                                const rating = Number(company.avg_rating || 0);
                                const fullStars = Math.floor(rating);
                                const decimal = rating - fullStars;
                                const showHalf = decimal >= 0.5;
                                const emptyStars = 5 - fullStars - (showHalf ? 1 : 0);

                                const isLastOdd =
                                    sellers.length % 2 !== 0 &&
                                    index === visibleSellers.length - 1;

                                return (
                                    <div
                                        key={company.id}
                                        onClick={() => {
                                            if (!disableCheckbox) handleCheckboxChange(company);
                                        }}
                                        className={[
                                            styles.card,
                                            isSelected ? styles.cardSelected : styles.cardDefault,
                                            isLastOdd ? styles.cardLastOdd : "",
                                        ].join(" ")}
                                    >
                                        <div
                                            className={[
                                                styles.checkbox,
                                                isSelected
                                                    ? styles.checkboxSelected
                                                    : styles.checkboxDefault,
                                                disableCheckbox ? styles.checkboxDisabled : "",
                                            ].join(" ")}
                                        >
                                            <svg
                                                className={[
                                                    styles.checkIcon,
                                                    isSelected
                                                        ? styles.checkIconVisible
                                                        : styles.checkIconHidden,
                                                ].join(" ")}
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="3"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        </div>

                                        <div className={styles.companyRow}>

                                            <div className={styles.logoWrapper}>
                                                {company.company_logo ? (
                                                    <img
                                                        src={`${serviceData.baseurl}/${company.company_logo}`}
                                                        alt={company.business_profile_name}
                                                        className={styles.logoImg}
                                                    />
                                                ) : (
                                                    <div className={styles.logoFallback}>
                                                        <GalleryIcon className={styles.galleryIcon} />
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <p className={styles.companyName}>
                                                    {company.business_profile_name}
                                                </p>

                                                <div className={styles.starsRow}>
                                                    <div className={styles.starsGroup}>
                                                        {[...Array(fullStars)].map((_, i) => (
                                                            <StarIconFeature
                                                                key={`full-${i}`}
                                                                className={styles.starIcon}
                                                            />
                                                        ))}
                                                        {showHalf && (
                                                            <HalfStarIconFeature
                                                                className={styles.starIcon}
                                                            />
                                                        )}
                                                        {[...Array(emptyStars)].map((_, i) => (
                                                            <StarIconFeature
                                                                key={`empty-${i}`}
                                                                background1="#dfdfe8"
                                                                background2="#dfdfe8"
                                                                className={styles.starIcon}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className={styles.locationRow}>
                                                    <LocationMapIcon
                                                        className={styles.locationIcon}
                                                        background="#00afe3"
                                                    />
                                                    <span>
                                                        Operates in{" "}
                                                        {company.postcode
                                                            ? company.postcode.slice(
                                                                0,
                                                                company.postcode.includes(" ") ? 5 : 4
                                                            )
                                                            : ""}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {!showAll && sellers.length > displayCount && (
                            <div className={styles.showMoreWrapper}>
                                <button
                                    onClick={() => setShowAll(true)}
                                    className={styles.showMoreBtn}
                                >
                                    Show More
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Modal>
    );
}

export default SeeMyMatchesModal;