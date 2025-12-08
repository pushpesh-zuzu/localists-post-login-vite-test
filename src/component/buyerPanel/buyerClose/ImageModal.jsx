import { useEffect } from "react";
import styles from "./ImageModal.module.css";
import { useNavigate } from "react-router-dom";
import DummyImage from "../../../assets/Images/DummyImage.svg";
import RightClick from "../../../assets/Images/Setting/RightModalClick.svg";
import { getPopularServiceList } from "../../../store/FindJobs/findJobSlice";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL_IMAGE } from "../../../utils";
import imgBanner from "../../../assets/Images/houseCleaner.svg";


const services = [
  { title: "Personal Trainers", image: DummyImage },
  { title: "Counselling", image: DummyImage },
  { title: "Massage Therapy", image: DummyImage },
  { title: "Wedding Photography", image: DummyImage },
  { title: "DJ", image: DummyImage },
  { title: "Magician", image: DummyImage },
];

const ImageModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  if (!isOpen) return null;
  const dispatch = useDispatch();
  const { popularList, popularLoader } = useSelector((state) => state.findJobs);
  useEffect(() => {
    dispatch(getPopularServiceList());
  }, []);

  const handleSkip = () => {
    onClose();
    navigate("/buyers/create");
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.icon}>
            <img src={RightClick} alt="..." />
          </div>
          <h2>Your request has been closed</h2>
        </div>
        <p className={styles.subtext}>Do you need any of these services?</p>

        <div className={styles.grid}>
          {popularList?.slice(0, 6)?.map((service, index) => (
            <div
              key={index}
              className={styles.card}
              onClick={() => {
                navigate("/buyers/create", {
                  state: { selectedService: service, from: "ImageModal" },
                });
              }}
            >
              <img
                src={
                  service.banner_image
                    ? `${BASE_URL_IMAGE}${service.banner_image}`
                    : imgBanner
                }
                alt={service.name}
              />
              <span>{service.name}</span>
            </div>
          ))}
        </div>

        <div className={styles.actions}>
          <button className={styles.skipButton} onClick={handleSkip}>
            Skip
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
