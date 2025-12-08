import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./FindLocalJobs.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getPopularServiceList,
  searchService,
  setRegisterStep,
  setSelectedServiceId,
  setService,
} from "../../../store/FindJobs/findJobSlice";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
import { generateSlug } from "../../../utils";
import { Spin } from "antd";
import hiring from "../../../assets/Images/ServicePanel/hiring.svg";
import rightArrow from "../../../assets/Images/ServicePanel/rightArrow.svg";
import { extractAllParams } from "../../../utils/decodeURLParams";

const FindLocalJobs = () => {
  const [Input, setInput] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false); // ✅ State में move किया
  const [isFocused, setIsFocused] = useState(false);
  const dispatch = useDispatch();
  const { lang, country } = useParams();
  const currentLang = lang || "en";
  const currentCountry = country || "gb";
  const divRef = useRef(null);
  const { popularList, service, popularLoader, searchServiceLoader } =
    useSelector((state) => state.findJobs);
  const navigate = useNavigate();
  const { search } = useLocation();
  const allParams =
    typeof window !== "undefined" &&
    extractAllParams(search || window.location.search);
  console.log(allParams, "allParams");
  // const handleServiceClick = (service) => {
  //   const slug = generateSlug(service.name);
  //   dispatch(setSelectedServiceId(service.id));
  //   navigate(`/sellers/create-account/${slug}`);
  // };

  useEffect(() => {
    dispatch(getPopularServiceList());
    return () => {
      dispatch(setService([]));
    };
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (isDropdownOpen && Input.trim() !== "") {
        dispatch(searchService({ search: Input }));
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [Input, dispatch, isDropdownOpen]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth <= 480);

      const handleResize = () => {
        setIsMobile(window.innerWidth <= 480);
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const handleSelectService = useCallback(
    (item) => {
      setInput(item.name);
      setSelectedService(item);
      setIsDropdownOpen(false);
      setTimeout(() => dispatch(setService([])), 100);
    },
    [dispatch]
  );

  useEffect(() => {
    function handleClickOutside(event) {
      if (divRef.current && !divRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    // ✅ Browser check add की
    if (typeof document !== "undefined") {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, []);

  const DEBOUNCE_MS = 250;
  const debounceRef = useRef(null);
  // const buildQueryString = (params) => {
  //   const query = new URLSearchParams(params).toString();
  //   return query ? `?${query}` : "";
  // };
  const buildQueryString = (params = {}) => {
    const utm_source = params.utm_source || "";
    const utm_medium = params.utm_medium || "";
    const utm_campaign = params.utm_campaign || "";

    // Build only these 3 params
    const query = new URLSearchParams({
      ...(utm_source && { utm_source }),
      ...(utm_medium && { utm_medium }),
      ...(utm_campaign && { utm_campaign }),
    }).toString();

    return query ? `?${query}` : "";
  };
  const handleGetStarted = () => {
    if (selectedService) {
      const slug = generateSlug(selectedService.name);
      dispatch(setSelectedServiceId(selectedService.id));
      const queryString = buildQueryString(allParams);
      navigate(
        `/${currentLang}/${currentCountry}/sellers/create-account/${slug}${queryString}`
      );
    }
  };

  const triggerSearch = (value) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const trimmed = value.trim();
      dispatch(
        searchService({ search: trimmed === "" ? "" : trimmed.slice(0, 4) })
      );
    }, DEBOUNCE_MS);
  };

  return (
    <div className={styles.container}>
      {/* Left Section */}
      <div className={styles.leftSection}>
        <h1>Connect with Clients Who Need You Now </h1>
        <p>Get matched with 1000s of local customers who need your services</p>
        <div className={styles.searchInputContainer}>
          <input
            className={styles.searchInput}
            placeholder="What service do you provide?"
            onFocus={() => {
              setIsFocused(true);
              setIsDropdownOpen(true); // open dropdown on focus
              // if field is empty on focus, load ALL services so dropdown isn't blank
              if (Input.trim() === "") {
                dispatch(searchService({ search: "" /*, serviceid*/ }));
              }
            }}
            onBlur={() => {
              setIsFocused(false);
            }}
            onChange={(e) => {
              const value = e.target.value;
              setInput(value);
              setIsDropdownOpen(true);
              setSelectedService(null);
              triggerSearch(value);
            }}
            value={Input}
          />

          {isDropdownOpen && service?.length > 0 && (
            <>
              <div className={styles.searchResults} ref={divRef}>
                {searchServiceLoader ? (
                  <Spin indicator={<LoadingOutlined spin />} />
                ) : (
                  <>
                    {service?.map((item) => (
                      <p
                        key={item.id}
                        className={styles.searchItem}
                        onClick={() => handleSelectService(item)}
                      >
                        {item.name}
                      </p>
                    ))}
                  </>
                )}
              </div>
            </>
          )}

          <div className={styles.responsiveBtnWrapper}>
            <button onClick={handleGetStarted} className={styles.getStartedBtn}>
              Get started
            </button>

            <img
              src={rightArrow}
              alt="arrow"
              onClick={handleGetStarted}
              className={styles.getStartedArrow}
            />
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className={styles.rightSection}>
        <h2>Popular Services</h2>
        {popularLoader ? (
          <Spin
            indicator={<LoadingOutlined spin style={{ color: "primary" }} />}
            className={styles?.loaderDesign}
          />
        ) : (
          <div className={styles.servicesList}>
            {popularList?.map((service) => {
              const slug = generateSlug(service.name);
              const queryString = buildQueryString(allParams);
              const path = `/${currentLang}/${currentCountry}/sellers/create-account/${slug}${queryString}`;

              return (
                <Link
                  key={service.id}
                  to={path}
                  style={{ textDecoration: "none" }}
                  className={styles.serviceItem}
                  onClick={() => dispatch(setSelectedServiceId(service.id))}
                >
                  <img
                    src={
                      service?.category_icon
                        ? `${service?.baseurl}/${service?.category_icon}`
                        : hiring
                    }
                    alt={service.title}
                  />
                  <span className={styles.serviceName}>{service.name}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FindLocalJobs;
