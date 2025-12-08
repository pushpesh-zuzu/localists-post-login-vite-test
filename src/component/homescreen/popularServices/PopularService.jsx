import styles from "./popular.module.css";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import leftArrow from "../../../assets/Images/backwordArrow.svg";
import rightArrow from "../../../assets/Images/forwordArrow.svg";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPopularServiceList } from "../../../store/FindJobs/findJobSlice";
import imgBanner from "../../../assets/Images/houseCleaner.svg";
import BuyerRegistration from "../../buyerPanel/PlaceNewRequest/BuyerRegistration/BuyerRegistration";
import { BASE_URL_IMAGE } from "../../../utils";
import { Spin } from "antd";
import { serviceRouteMap } from "../../../utils/allServicesRoute";
import { useNavigate, useParams } from "react-router";
import { setRedirectFromHome } from "../../../store/Buyer/BuyerSlice";
// import Modal from "./Modal";
// const serviceData = [
//   { title: "Personal Trainers", image: personalTrainers },
//   { title: "House Cleaning", image: houseCleaning },
//   { title: "Web Design", image: webDesign },
//   { title: "Gardening", image: gardening },
// ];
function AutoplayPlugin(slider) {
  let timeout;
  let mouseOver = false;

  function start() {
    clearTimeout(timeout);
    if (mouseOver) return;
    timeout = setTimeout(() => {
      slider.next();
    }, 2000);
  }

  slider.on("created", () => {
    slider.container.addEventListener("mouseover", () => {
      mouseOver = true;
      clearTimeout(timeout);
    });
    slider.container.addEventListener("mouseout", () => {
      mouseOver = false;
      start();
    });
    start();
  });

  slider.on("dragStarted", () => {
    clearTimeout(timeout);
  });

  slider.on("animationEnded", start);
  slider.on("updated", start);
}

const PopularService = ({ closeModal, popularList = [], popularLoader }) => {
  const [selectedServiceId, setSelectedServiceId] = useState({
    id: null,
    name: "",
  });
  const { lang, country } = useParams();
  const currentLang = lang || "en";
  const currentCountry = country || "gb";
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const [initialLoader, setInitialLoader] = useState(true);
  const dispatch = useDispatch();
  const { userToken } = useSelector((state) => state.auth);
  const handleOpen = (id, name) => {
    // setSelectedServiceId({ id, name });
    // setShow(true);
    const matchedRoute = serviceRouteMap[id];
    if (matchedRoute) {
      navigate(`/${currentLang}/${currentCountry}${matchedRoute}`); // go to the route
      dispatch(setRedirectFromHome(true));
    }
  };

  const handleClose = () => {
    setShow(false);
    setSelectedServiceId({ id: null, name: "" });
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (slider.current) {
        slider.current.update();
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [popularList]);
  const [sliderRef, slider] = useKeenSlider(
    {
      loop: true,
      slides: { perView: 4, spacing: 20 },
      breakpoints: {
        "(max-width: 1400px)": {
          slides: { perView: 3, spacing: 10 },
        },
        "(max-width: 1024px)": {
          slides: { perView: 2.5, spacing: 8 },
        },
        "(max-width: 820px)": {
          slides: { perView: 2, spacing: 5 },
        },
        "(max-width: 540px)": {
          slides: { perView: 1.7, spacing: 15 },
        },
        "(max-width: 380px)": {
          slides: { perView: 1.6, spacing: 10 },
        },
      },
    },
    [AutoplayPlugin]
  );

  return (
    <>
      <div className={styles.container}>
        <h2 className={styles.heading}>
          Popular <span>Service</span> Requests{" "}
        </h2>
        {/* Left Arrow */}
        <button
          className={styles.arrowLeft}
          onClick={() => slider.current?.prev()}
        >
          <img src={leftArrow} alt="Left" />
        </button>
        {popularLoader ? (
          <Spin />
        ) : (
          <>
            {/* Slider */}
            <div className={styles.sliderWrapper}>
              {popularList.length > 0 && (
                <div ref={sliderRef} className={`keen-slider ${styles.slider}`}>
                  {popularList?.map((service, index) => (
                    <div
                      style={{ borderRadius: "20px" }}
                      key={index}
                      className={`keen-slider__slide ${styles.slide}`}
                      onClick={() => handleOpen(service?.id, service?.name)}
                    >
                      <div style={{ padding: "9px", borderRadius: "20px" }}>
                        <img
                          src={
                            service.banner_image
                              ? `${BASE_URL_IMAGE}${service.banner_image}`
                              : imgBanner
                          }
                          alt={service.name}
                          className={styles.image}
                        />

                        <p className={styles.serviceTitle}>{service.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
        {/* Right Arrow */}
        <button
          className={styles.arrowRight}
          onClick={() => slider.current?.next()}
        >
          <img src={rightArrow} alt="Right" />
        </button>
        {/* {show && (userToken?.active_status == 2 || !userToken) && (
          <>
            <BuyerRegistration
              closeModal={handleClose}
              service_Id={selectedServiceId?.id}
              service_Name={selectedServiceId.name}
            />
          </>
        )} */}
      </div>
    </>
  );
};

export default PopularService;
