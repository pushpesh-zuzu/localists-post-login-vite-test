import { BASE_URL_IMAGE } from "../../../utils";
import styles from "./services.module.css";
import PropTypes from "prop-types";
import imgBanner from "../../../assets/Images/houseCleaner.svg";
import { useState } from "react";
import BuyerRegistration from "../../buyerPanel/PlaceNewRequest/BuyerRegistration/BuyerRegistration";

const SpecificService = ({ service }) => {
  return (
    <>
      <div className={styles.serviceCard}>
        <img
          src={
            service.banner_image
              ? `${BASE_URL_IMAGE}${service.banner_image}`
              : imgBanner
          }
          alt={service.title + service.seo_title}
          className={styles.serviceImage}
        />
        <p className={styles.serviceTitle}>{service.name}</p>
      </div>
    </>
  );
};

SpecificService.propTypes = {
  service: PropTypes.shape({
    image: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
};

export default SpecificService;
