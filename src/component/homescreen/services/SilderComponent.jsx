import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import styles from "./services.module.css";
import leftArrow from "../../../assets/Images/backwordArrow.svg";
import rightArrow from "../../../assets/Images/forwordArrow.svg";
import SpecificService from "./SpecificService";
import BuyerRegistration from "../../buyerPanel/PlaceNewRequest/BuyerRegistration/BuyerRegistration";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { setRedirectFromHome } from "../../../store/Buyer/BuyerSlice";
import { serviceRouteMap } from "../../../utils/allServicesRoute";

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

const SliderComponent = ({ subcategory, categoryName, initialLoader }) => {
  const { lang, country } = useParams();
  const currentLang = lang || "en";
  const currentCountry = country || "gb";
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedServiceId, setSelectedServiceId] = useState({
    id: null,
    name: "",
  });
  const [show, setShow] = useState(false);
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
  };
  const [sliderRef, slider] = useKeenSlider(
    {
      loop: true,
      slides: { perView: 3, spacing: 20 },
      breakpoints: {
        "(max-width: 1024px)": { slides: { perView: 2.5, spacing: 10 } },
        "(max-width: 820px)": { slides: { perView: 2, spacing: 5 } },
        "(max-width: 768px)": { slides: { perView: 2, spacing: 5 } },
        "(max-width: 540px)": {
          slides: { perView: 1.7, spacing: 15 },
        },
        "(max-width: 380px)": {
          slides: { perView: 1.4, spacing: 0 },
        },
      },
    },
    [AutoplayPlugin]
  );

  return (
    <>
      {subcategory?.length > 0 && (
        <>
          {" "}
          <div>
            {" "}
            <button
              className={styles.arrowLeft}
              onClick={() => slider.current?.prev()}
            >
              <img src={leftArrow} alt="Left" />
            </button>
            <div className={styles.sliderWrapper}>
              <div ref={sliderRef} className={`keen-slider ${styles.slider}`}>
                {subcategory?.map((service, index) => (
                  <div
                    key={index}
                    style={{ borderRadius: "20px" }}
                    className={`keen-slider__slide ${styles.slide}`}
                    onClick={() => handleOpen(service?.id, service?.name)}
                  >
                    <div style={{ padding: "9px", borderRadius: "20px" }}>
                      <SpecificService service={service} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button
              className={styles.arrowRight}
              onClick={() => slider.current?.next()}
            >
              <img src={rightArrow} alt="Right" />
            </button>
          </div>
          <div className={styles.viewAllBtnBox}>
            {/* <Link style={{textDecoration:'none'}} to={categoryName ==="House & Home" && `/${currentLang}/${currentCountry}/home`} className={styles.viewAllBtn}>View All </Link> */}
            {/* later we uncomment this view all button  */}
          </div>
        </>
      )}

      {show && (userToken?.active_status == 2 || !userToken) && (
        <>
          <BuyerRegistration
            closeModal={handleClose}
            serviceId={selectedServiceId?.id}
            serviceName={selectedServiceId.name}
          />
        </>
      )}
    </>
  );
};

export default SliderComponent;
