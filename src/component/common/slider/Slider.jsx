import styles from "./Slider.module.css";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import leftArrow from "../../../assets/Images/backwordArrow.svg";
import rightArrow from "../../../assets/Images/forwordArrow.svg";
import { Link, useParams } from "react-router-dom";
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
const Slider = ({ sliderdata, blueTitle, title, ImageLink = true }) => {
          const { lang, country } = useParams(); 
          const currentLang = lang || "en";
          const currentCountry = country || "gb";
  const [sliderRef, slider] = useKeenSlider(
    {
      loop: true,
      infinite: true,
      slides: { perView: 2.7, spacing: 20 },
      breakpoints: {
        "(max-width: 1024px)": {
          slides: { perView: 2, spacing: 10 },
        },
        "(max-width: 600px)": {
          slides: { perView: 2, spacing: 5 },
        },
        "(max-width: 520px)": {
          slides: { perView: 1.5, spacing: 5 },
        },
        "(max-width: 375px)": {
          slides: { perView: 1.2, spacing: 5 },
        },
      },
    },

    [AutoplayPlugin]
  );

  const restartAutoplay = () => {
    if (!slider.current) return;
    slider.current.stop();
    setTimeout(() => slider.current?.start(), 500);
  };

  return (
    <>
      <div className={styles.container}>
        {/* Title with Left & Right Arrow */}
        <div className={styles.titleWrapper}>
          <span
            className={styles.leftArrowWrapper}
            onClick={() => {
              slider.current?.prev();
              restartAutoplay();
            }}
          >
            <img
              src={leftArrow}
              alt="Left"
              className={styles.arrowIcon}
              width={17}
            />
          </span>

          <h2 className={styles.heading}>
            {blueTitle && <span className={styles.highlight}>{blueTitle}</span>}
            {title}
          </h2>
          <span
            className={styles.rightArrowWrapper}
            onClick={() => slider.current?.next()}
          >
            <img
              src={rightArrow}
              alt="Right"
              className={styles.arrowIcon}
              width={17}
            />
          </span>
        </div>

        {/* Slider */}
        <div className={styles.sliderWrapper}>
          <div ref={sliderRef} className={`keen-slider ${styles.slider}`}>
            {sliderdata?.map((service) => (
              <div
                key={service.id}
                className={`keen-slider__slide ${styles.slide}`}
              >
                {service.path ? (
                  <Link to={`/${currentLang}/${currentCountry}/${service.path}`}>
                    <img src={service.image} alt={service.title} />
                  </Link>
                ) : (
                  <img src={service.image} alt={service.title} />
                )}
                {service?.path ? (
                  <p>
                    <Link className={styles.link} to={`/${currentLang}/${currentCountry}/${service.path}`}>
                      {service.description}
                    </Link>
                  </p>
                ) : (
                  <p>{service.description}</p>
                )}
                {service.title && (
                  <span className={styles.slider_title}>{service?.title}</span>
                )}
                {service?.availableOnline && (
                  <span className={styles.availableOnline}>
                    Available Online
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Slider;
