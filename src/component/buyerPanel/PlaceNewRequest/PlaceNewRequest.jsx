import { useEffect, useState } from "react";
import styles from "./PlaceNewRequest.module.css";
import BuyerRegistration from "./BuyerRegistration/BuyerRegistration";
import { useDispatch, useSelector } from "react-redux";
import {
  getbuyerrequestList,
  setBuyerStep,
} from "../../../store/Buyer/BuyerSlice";
import moment from "moment-timezone";
import { Spin } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import HiredProfessional from "./BuyerRegistration/HiredProfessional/HiredProfessional";

const PlaceNewRequest = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHiredModalOpen, setIsHiredModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const navigate = useNavigate();
  const openModal = () => {
    setIsModalOpen(true);

    dispatch(setBuyerStep(1));
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };
  const [fromImageModal, setFromImageModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    if (!selectedServiceId) {
      setIsModalOpen(false);
    }
  }, [selectedServiceId]);

  const dispatch = useDispatch();
  const { buyerRequestList, buyerrequestListLoader } = useSelector(
    (state) => state.buyer
  );
  useEffect(() => {
    dispatch(getbuyerrequestList());
  }, []);

  const onViewRequest = (id) => {
    navigate(`/bids-list/${id}`);
  };
  const openHiredModal = (serviceId) => {
    setSelectedServiceId(serviceId);
    setIsHiredModalOpen(true);
  };
  const handleClose = (id) => {
    navigate(`/buyer-close/${id}`);
  };

  const location = useLocation();
  useEffect(() => {
    if (location.state?.selectedService) {
      if (location.state?.from === "ImageModal") {
        setFromImageModal(true);
        setSelectedService(location.state.selectedService);
      } else {
        setSelectedService(null);
      }

      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate]);

  useEffect(() => {
    if (selectedService) {
      if (fromImageModal) {
      } else {
      }
      openModal();
    }
  }, [selectedService, fromImageModal]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          Your <span className={styles.highlight}>requests</span>
        </h2>
        <button className={styles.topButton} onClick={openModal}>
          Place new request
        </button>
      </div>

      {buyerrequestListLoader ? (
        <Spin />
      ) : buyerRequestList?.length > 0 ? (
        <div className={styles.cardsContainer}>
          {[...buyerRequestList]
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .map((req, index) => (
              <div key={index} className={styles.requestcard}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>{req.category?.name}</h3>
                  <span className={styles.timeAgo}>
                    {moment.tz(req.created_at, "Europe/London").fromNow()}
                  </span>
                </div>
                <div
                  className={`${styles.messageBox} ${
                    req.status === "rejected"
                      ? styles.lightRedBox
                      : req.status === "pending"
                      ? styles.lightBlueBox
                      : ""
                  }`}
                >
                  <p>
                    {req.details} If you need to hire faster, email{" "}
                    <a href={`mailto:${req.email}`}>{"team@localists.com"}</a>{" "}
                    for assistance.
                  </p>
                </div>
                <div>
                  <a
                    href={`/bids-list/${req.id}`}
                    style={{ textDecoration: "none" }}
                    className={styles.viewButton}
                    onClick={(e) => {
                      e.preventDefault();
                      onViewRequest(req.id);
                    }}
                  >
                    View Request
                  </a>
                </div>
                <div style={{ marginTop: 16 }}>
                  {req?.status === "hired" ? (
                    ""
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <div
                        style={{ cursor: "pointer" }}
                        onClick={() => handleClose(req.id)}
                      >
                        Close Request
                      </div>

                      <div>|</div>

                      <div
                        className={styles.tags}
                        style={{ marginTop: "0px" }}
                        onClick={() => openHiredModal(req.id)}
                      >
                        Hired Professional
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className={styles.card}>
          <h3 className={styles.heading}>
            Find Local Services Professionals with Localists
          </h3>
          <p className={styles.text}>
            Need a better deal on local professional services?
          </p>
          <p className={styles.text}>
            Localists connect you with trusted local professionals who are
            specialists in their field —
            <br /> ready to help you and ready to quote.
          </p>
          <p className={styles.text}>
            From landscapers and gardeners to cleaners and builders, we find the
            right expert <br /> for your needs in just a few clicks.
          </p>
          <p className={styles.lastText}>
            Get up to 5 quotes from trusted professionals and get the peace of
            mind you’ve found the best price and professional for your needs -
            and we’re fast! On average our customers receive 3 quotes from
            reputable local professionals within 5 days.
          </p>
          <button className={styles.bottomButton} onClick={openModal}>
            Place new request
          </button>
        </div>
      )}

      {isModalOpen && (
        <BuyerRegistration
          closeModal={closeModal}
          setSelectedService={setSelectedService}
          setFromImageModal={setFromImageModal}
        />
      )}

      {isHiredModalOpen && (
        <HiredProfessional
          closeModal={() => setIsHiredModalOpen(false)}
          serviceId={selectedServiceId}
        />
      )}
    </div>
  );
};

export default PlaceNewRequest;
