import { useEffect, useRef, useState } from "react";
import styles from "./LocationModal.module.css";
import { showToast } from "../../utils";
import iIcon from "../../assets/Images/iIcon.svg";
import { Select } from "antd";
import { googleAPI } from "../../Api/axiosInstance";
import { useDispatch } from "react-redux";
import { getCityName, setcitySerach } from "../../store/Buyer/BuyerSlice";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import CheckIcon from "../../assets/Icons/greenCheckBox.jpeg";

const LocationModal = ({ open, locationData, onChange, onNext, onClose }) => {
  const { Option } = Select;
  const inputRef = useRef(null);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);
  const circleRef = useRef(null);
  const [checkingPostcode, setCheckingPostcode] = useState(false);
  const [postalCodeValidate, setPostalCodeValidate] = useState(false);
  const [city, setCity] = useState("");
  const [errors, setErrors] = useState({ postcode: "" });
  const dispatch = useDispatch();

  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapCenter, setMapCenter] = useState({
    lat: 52.6358,
    lng: -1.1396,
  });

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
      } else if (newResponse?.data?.latitude && newResponse?.data?.longitude) {
        const newCenter = {
          lat: parseFloat(newResponse.data.latitude),
          lng: parseFloat(newResponse.data.longitude),
        };
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

  useEffect(() => {
    if (locationData?.coordinates) {
      setMapCenter(locationData?.coordinates);
    }
  }, [locationData?.coordinates]);

  const drawCircle = (center) => {
    if (!window.google || !mapInstance.current) return;

    if (circleRef.current) {
      circleRef.current.setMap(null);
    }

    const radiusInMeters = (parseFloat(locationData.miles1) || 1) * 1609.34;

    circleRef.current = new window.google.maps.Circle({
      center,
      radius: radiusInMeters,
      fillColor: "#007BFF",
      fillOpacity: 0.2,
      strokeColor: "#007BFF",
      strokeOpacity: 0.7,
      strokeWeight: 2,
      map: mapInstance.current,
    });

    const bounds = circleRef.current.getBounds();
    if (bounds) {
      mapInstance.current.fitBounds(bounds);
    }
  };

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (!window.google) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${googleAPI}&libraries=places,geometry`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          setMapLoaded(true);
          initMap();
        };
        document.body.appendChild(script);
      } else {
        setMapLoaded(true);
        initMap();
      }
    };

    const initMap = () => {
      if (!mapRef.current || !window.google) return;

      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center: mapCenter,
        zoom: 7,
      });

      if (locationData.postcode && mapCenter.lat !== 52.6358) {
        markerRef.current = new window.google.maps.Marker({
          position: mapCenter,
          map: mapInstance.current,
        });
        drawCircle(mapCenter);
      }
    };

    loadGoogleMapsScript();
  }, [open]);

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
  }, [open, mapLoaded, locationData.postcode, locationData]);

  useEffect(() => {
    if (mapLoaded && mapCenter.lat !== 20.5937) {
      drawCircle(mapCenter);
    }
  }, [locationData.miles1, mapLoaded]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <div className={styles.modalHeader}>
          <h2>Distance</h2>
        </div>

        <div className={styles.infoBox}>
          <img src={iIcon} alt="" />
          <span>
            Enter a postcode or town, and specify how far around that area
            you’re willing to offer your services
          </span>
        </div>

        <div className={styles.inputRow}>
          <div className={styles.inputField}>
            <label>Postcode</label>
            <input
              ref={inputRef}
              type="text"
              name="postcode"
              value={locationData.postcode}
              onChange={(e) => {
                onChange(e);
                validatePostcode(e.target.value);
              }}
              placeholder="Enter Postcode (No Spaces)"
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
          <div className={styles.inputField}>
            <label>Distance</label>
            <Select
              value={locationData.miles1}
              onChange={(value) =>
                onChange({ target: { name: "miles1", value } })
              }
              className={styles.customSelect}
            >
              <Option value="1">1 mile</Option>
              <Option value="5">5 miles</Option>
              <Option value="10">10 miles</Option>
              <Option value="20">20 miles</Option>
              <Option value="30">30 miles</Option>
              <Option value="50">50 miles</Option>
              <Option value="100">100 miles</Option>
            </Select>
          </div>
        </div>

        <div
          ref={mapRef}
          className={styles.mapContainer}
          style={{
            width: "100%",
            height: "250px",
            marginTop: "20px",
            borderRadius: "8px",
          }}
        />

        <div className={styles.modalFooter}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button
            className={styles.nextBtn}
            onClick={() => {
              if (locationData.miles1 && locationData.postcode)
                onNext("distance");
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;
