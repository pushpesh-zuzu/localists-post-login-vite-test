import { useEffect, useRef, useState } from "react";

const LeadMap = ({ getPendingLeadList }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const circlesRef = useRef([]);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapCenter] = useState({
    lat: 52.6358,
    lng: -1.1396,
  });

  const apiKey = "AIzaSyB1I_cRCeZ13mKqYKhsO5e3aOMgxtD7Irw";

  // Load Google Maps script
  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (!window.google) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`;
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
      if (!mapRef.current || !window.google || !window.google.maps) return;

      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center: mapCenter,
        zoom: 5,
      });
    };

    loadGoogleMapsScript();
  }, []);

  // Convert pincode to lat/lng
  const getLatLngFromPincode = async (pincode) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${pincode}&components=country:UK&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "OK" && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        return { lat, lng };
      } else {
        console.error("Location not found for:", pincode);
        return null;
      }
    } catch (error) {
      console.error("Geocoding error:", error.message);
      return null;
    }
  };

  // Draw a circle
  const drawCircle = (center, radiusInMiles = 1) => {
    if (!window.google || !mapInstance.current) return;

    const radiusInMeters = radiusInMiles * 1609.34;

    const circle = new window.google.maps.Circle({
      center,
      radius: radiusInMeters,
      fillColor: "#007BFF",
      fillOpacity: 0.2,
      strokeColor: "#007BFF",
      strokeOpacity: 0.7,
      strokeWeight: 2,
      map: mapInstance.current,
    });

    circlesRef.current.push(circle);
  };

  // Plot single pincode
  useEffect(() => {
    const plotPostcode = async () => {
      if (!mapLoaded || !getPendingLeadList) return;

      // Clear old markers/circles
      markersRef.current.forEach((marker) => marker.setMap(null));
      circlesRef.current.forEach((circle) => circle.setMap(null));
      markersRef.current = [];
      circlesRef.current = [];

      const pincode = getPendingLeadList;
      const coords = await getLatLngFromPincode(pincode);
      if (!coords) return;

      const marker = new window.google.maps.Marker({
        position: coords,
        map: mapInstance.current,
      });
      markersRef.current.push(marker);

      drawCircle(coords);

      mapInstance.current.setCenter(coords);
      mapInstance.current.setZoom(10);
    };

    plotPostcode();
  }, [mapLoaded, getPendingLeadList]);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      ref={mapRef}
      style={{
        width: windowWidth <= 1024 ? "100%" : "40vw",
        height: windowWidth <= 480 ? "200px" : "300px",
        marginTop: "20px",
        borderRadius: "8px",
      }}
    />
  );
};

export default LeadMap;
