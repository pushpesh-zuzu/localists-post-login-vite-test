import { useEffect, useRef, useState } from "react";
import styles from "./ViewOnMapModal.module.css";
import { googleAPI } from "../../../Api/axiosInstance";

const ViewOnMapModal = ({ open, locationData, onClose }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);
  const circleRef = useRef(null);
  const polygonRefs = useRef([]);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapCenter, setMapCenter] = useState({
    lat: 52.6358,
    lng: -1.1396,
  });

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

  // ---------------------- DRAW POLYGON ----------------------
  const drawPolygons = (coordsArray) => {
    if (!window.google || !mapInstance.current) return;

    // Clear old polygons
    polygonRefs.current.forEach((poly) => poly.setMap(null));
    polygonRefs.current = [];

    const bounds = new window.google.maps.LatLngBounds();

    coordsArray.forEach((coords) => {
      const polygon = new window.google.maps.Polygon({
        paths: coords,
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.25,
        map: mapInstance.current,
      });

      polygonRefs.current.push(polygon);

      coords.forEach((pt) => bounds.extend(pt));
    });

    mapInstance.current.fitBounds(bounds);
  };

  // ---------------------- LOAD SCRIPT ----------------------
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
        zoom: 10,
      });
    };

    loadGoogleMapsScript();
  }, [open]);

  // ---------------- CALCULATE LOCATION (Nationwide / Coordinates / Center) ----------------
  useEffect(() => {
    const fetchLatLng = async () => {
      if (!mapLoaded || !window.google || !mapInstance.current) return;

      if (
        locationData.coordinates &&
        Array.isArray(locationData.coordinates) &&
        locationData.coordinates.length > 0
      ) {
        drawPolygons(locationData.coordinates);
        return;
      }

      let newCenter;

      // 2️⃣ Nationwide case
      if (locationData.type === "Nationwide" && locationData.nation_wide == 1) {
        newCenter = { lat: 22.9734, lng: 78.6569 };
      }

      // 3️⃣ Set map center + circle
      if (newCenter) {
        setMapCenter(newCenter);
        mapInstance.current.setCenter(newCenter);
        mapInstance.current.setZoom(
          locationData.type === "Nationwide" && locationData.nation_wide == 1
            ? 2
            : 12
        );

        if (markerRef.current) {
          markerRef.current.setMap(null);
        }

        markerRef.current = new window.google.maps.Marker({
          position: newCenter,
          map: mapInstance.current,
        });

        if (
          locationData.coordinates &&
          Array.isArray(locationData.coordinates) &&
          locationData.coordinates.length > 0
        ) {
          drawPolygons(locationData.coordinates);
        } else {
          drawCircle(newCenter);
        }
      }
    };

    fetchLatLng();
  }, [mapLoaded, locationData?.postcode, locationData?.type]);

  useEffect(() => {
    if (!mapLoaded || !window.google || !locationData.postcode) return;

    if (
      locationData.coordinates &&
      Array.isArray(locationData.coordinates) &&
      locationData.coordinates.length > 0
    ) {
      drawPolygons(locationData.coordinates);
      return;
    }

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

            if (
              locationData.coordinates &&
              Array.isArray(locationData.coordinates) &&
              locationData.coordinates.length > 0
            ) {
              drawPolygons(locationData.coordinates);
            } else {
              drawCircle(newCenter);
            }
          }
        }
      }
    );
  }, [open, mapLoaded, locationData.postcode]);

  useEffect(() => {
    if (
      locationData.coordinates &&
      Array.isArray(locationData.coordinates) &&
      locationData.coordinates.length > 0
    ) {
      drawPolygons(locationData.coordinates);
    } else if (mapLoaded && locationData.miles1 && mapCenter.lat !== 20.5937) {
      drawCircle(mapCenter);
    }
  }, [locationData.miles1, mapLoaded]);

  // ---------------------- UI ----------------------
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>

        <div className={styles.modalHeader}>
          <h2>
            {locationData.type === "Nationwide" && locationData.nation_wide == 1
              ? locationData.type
              : locationData.city}
          </h2>
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
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewOnMapModal;
