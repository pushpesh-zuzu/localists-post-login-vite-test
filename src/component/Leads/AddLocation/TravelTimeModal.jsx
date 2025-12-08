import { useEffect, useRef, useState } from "react";
import styles from "./TravelTimeModal.module.css";
import iIcon from "../../../assets/Images/iIcon.svg";
import { Select, Spin } from "antd";
import { googleAPI } from "../../../Api/axiosInstance";
import CheckIcon from "../../../assets/Icons/greenCheckBox.jpeg";
import { getCityName, setcitySerach } from "../../../store/Buyer/BuyerSlice";
import { useDispatch } from "react-redux";
import { LoadingOutlined } from "@ant-design/icons";

const TravelTimeModal = ({
  open,
  onClose,
  onNext,
  locationData,
  setLocationData,
  previousPostcodeprops,
}) => {
  console.log(locationData);
  const dispatch = useDispatch();
  const { Option } = Select;
  const inputRef = useRef(null);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);
  const circleRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [city, setCity] = useState("");
  const [mapCenter, setMapCenter] = useState({
    lat: 52.6358,
    lng: -1.1396,
  });
  const [checkingPostcode, setCheckingPostcode] = useState(false);
  const [postalCodeValidate, setPostalCodeValidate] = useState(false);
  const [errors, setErrors] = useState({ postcode: "" });
  const [previousPostCode, setPreviousPostcode] = useState(
    previousPostcodeprops
  );

  const calculateTravelRadius = (time, mode) => {
    const speedMap = {
      Driving: 800,
      "Public Transport": 400,
      Biking: 250,
      Walking: 80,
    };

    let minutes = 30;
    if (time === "1 hour") minutes = 60;
    if (time === "1.5 hours") minutes = 90;
    if (time === "2 hours") minutes = 120;

    return speedMap[mode] * minutes;
  };
  const validatePostcode = async (value) => {
    if (!value) {
      setPostalCodeValidate(false);
      setCity("");
      return;
    }

    setCheckingPostcode(true);

    try {
      const response = await dispatch(getCityName({ postcode: value }));
      const newResponse = response?.unwrap ? await response.unwrap() : response;

      if (newResponse?.data?.city) {
        setPostalCodeValidate(true);
        setCity(newResponse.data.city);
        dispatch(setcitySerach(newResponse.data.city));
        setErrors((prev) => ({ ...prev, postcode: "" }));
        setLocationData((prev) => ({
          ...prev,
          postcode: value,
          city: newResponse.data.city,
        }));
      } else if (newResponse?.data?.latitude && newResponse?.data?.longitude) {
        const newCenter = {
          lat: parseFloat(newResponse.data.latitude),
          lng: parseFloat(newResponse.data.longitude),
        };

        setPostalCodeValidate(true);
        setCity("");

        setLocationData((prev) => ({
          ...prev,
          postcode: value,
          coordinates: [newCenter],
        }));

        setMapCenter(newCenter);

        if (mapInstance.current) {
          mapInstance.current.setCenter(newCenter);
          mapInstance.current.setZoom(12);

          if (markerRef.current) markerRef.current.setMap(null);

          markerRef.current = new window.google.maps.Marker({
            position: newCenter,
            map: mapInstance.current,
          });

          drawCircle(newCenter);
        }
      }

      // Invalid postcode
      else {
        throw new Error("Invalid Postcode");
      }
    } catch (error) {
      setPostalCodeValidate(false);
      setCity("");

      setErrors((prev) => ({
        ...prev,
        postcode: "Please enter a valid postcode!",
      }));
    } finally {
      setCheckingPostcode(false);
    }
  };

  console.log(locationData, "location data");

  const drawCircle = (center) => {
    if (!window.google || !mapInstance.current) {
      setTimeout(() => drawCircle(center), 200);
      return;
    }

    const radiusInMeters = calculateTravelRadius(
      locationData?.travel_time,
      locationData?.travel_by,
      locationData?.postcode ? locationData?.postcode : previousPostCode
    );

    if (circleRef.current) {
      circleRef.current.setMap(null);
    }

    circleRef.current = new window.google.maps.Circle({
      center,
      radius: radiusInMeters,
      fillColor: "#4285F4",
      fillOpacity: 0.15,
      strokeColor: "#4285F4",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      map: mapInstance.current,
    });

    mapInstance.current.fitBounds(circleRef.current.getBounds());
  };

  useEffect(() => {
    setLocationData((prev) => ({
      miles1: prev?.miles1 || "20",
      postcode: prev?.postcode || "",
      travel_by: prev?.travel_by || "Driving",
      travel_time: prev?.travel_time || "30 minutes",
    }));
  }, []);

  console.log(locationData);

  useEffect(() => {
    if (mapLoaded && locationData.postcode && window.google) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode(
        {
          address: locationData.postcode,
          componentRestrictions: { country: "UK" },
        },
        (results, status) => {
          if (status === "OK" && results && results[0]) {
            const lat = results[0].geometry.location.lat();
            const lng = results[0].geometry.location.lng();
            const newCenter = { lat, lng };
            setMapCenter(newCenter);

            if (mapInstance.current) {
              mapInstance.current.setCenter(newCenter);
              mapInstance.current.setZoom(12);

              if (markerRef.current) markerRef.current.setMap(null);

              markerRef.current = new window.google.maps.Marker({
                position: newCenter,
                map: mapInstance.current,
              });

              drawCircle(newCenter);
            }
          } else {
            console.error("Geocode was not successful: ", status);
            showToast("Could not fetch location from the postcode.");
          }
        }
      );
    }
  }, [open, mapLoaded, locationData]);

  useEffect(() => {
    if (mapLoaded && mapCenter.lat !== 20.5937) {
      drawCircle(mapCenter);
    }
  }, [locationData.miles1, mapLoaded]);

  const onChange = (e) => {
    const { name, value } = e.target;

    setLocationData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPreviousPostcode("");
  };

  const handleNext = () => {
    onNext(locationData, "travelTime");
    onClose();
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Load Google Maps script only once
  useEffect(() => {
    if (window.google) {
      setMapLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleAPI}&libraries=places,geometry`;
    script.async = true;
    script.onload = () => setMapLoaded(true);

    document.body.appendChild(script);
  }, []);

  // Initialize map once after Google is loaded
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || mapInstance.current) return;

    mapInstance.current = new window.google.maps.Map(mapRef.current, {
      center: mapCenter,
      zoom: 7,
    });
  }, [mapLoaded]);

  // Fix map not displaying on first modal open
  useEffect(() => {
    if (!open || !mapInstance.current) return;

    setTimeout(() => {
      window.google.maps.event.trigger(mapInstance.current, "resize");
      mapInstance.current.setCenter(mapCenter);
    }, 300);
  }, [open]);

  useEffect(() => {
    if (locationData?.coordinates) {
      const parsedCoordinates = locationData.coordinates;
      if (Array.isArray(parsedCoordinates) && parsedCoordinates.length > 0) {
        setMapCenter(parsedCoordinates[0]);
      }
    }
  }, [locationData?.coordinates]);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>

        <h2 className={styles.title}>Travel Time</h2>

        <div className={styles.infoBox}>
          <img src={iIcon} alt="" />
          <span>
            Enter a postcode or town, how far you're willing to travel, and your
            mode of transport. We'll use this to match you with the right local
            leads.
          </span>
        </div>

        <div className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Postcode</label>
            <input
              ref={inputRef}
              type="text"
              name="postcode"
              value={locationData?.postcode ? locationData?.postcode : ""}
              onChange={(e) => {
                onChange(e);
                validatePostcode(e.target.value);
              }}
              placeholder="Enter postcode (No Spaces)"
              autoComplete="off"
              className={`${errors.postcode ? styles.errorBorder : ""}`}
            />

            {checkingPostcode ? (
              <Spin
                indicator={<LoadingOutlined spin />}
                size="small"
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "70%",
                  transform: "translateY(-50%)",
                }}
              />
            ) : postalCodeValidate ? (
              <img
                src={CheckIcon}
                alt="valid"
                style={{
                  width: "18px",
                  position: "absolute",
                  right: "10px",
                  top: "70%",
                  transform: "translateY(-50%)",
                }}
              />
            ) : null}

            {errors.postcode && (
              <p
                style={{ color: "red", fontSize: "14px" }}
                className={styles.errorText}
              >
                {errors.postcode}
              </p>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label>Travel time</label>
            <Select
              value={locationData?.travel_time}
              onChange={(value) =>
                setLocationData((prev) => ({
                  ...prev,
                  travel_time: value,
                }))
              }
              size="large"
              className={styles.customSelect}
              dropdownMatchSelectWidth={false}
            >
              <Option value="30 minutes">30 minutes</Option>
              <Option value="1 hour">1 hour</Option>
              <Option value="1.5 hours">1.5 hours</Option>
              <Option value="2 hours">2 hours</Option>
            </Select>
          </div>

          <div className={styles.inputGroup}>
            <label>Travelling by</label>
            <Select
              value={locationData?.travel_by}
              onChange={(value) =>
                setLocationData((prev) => ({
                  ...prev,
                  travel_by: value,
                }))
              }
              size="large"
              className={styles.customSelect}
              dropdownMatchSelectWidth={false}
            >
              <Option value="Driving">Driving</Option>
              <Option value="Walking">Walking</Option>
              <Option value="Biking">Biking</Option>
              <Option value="Public Transport">Public Transport</Option>
            </Select>
          </div>
        </div>

        <div ref={mapRef} className={styles.mapContainer} />

        <div className={styles.buttonContainer}>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button
            className={styles.nextButton}
            onClick={() => {
              if (
                locationData?.travel_by &&
                locationData?.travel_time &&
                locationData?.postcode
              ) {
                handleNext("travelTime");
              } else if (
                !locationData?.postcode ||
                locationData?.postcode === ""
              ) {
                setErrors((prev) => ({
                  ...prev,
                  postcode: "Please enter a valid postcode!",
                }));
              }
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TravelTimeModal;
