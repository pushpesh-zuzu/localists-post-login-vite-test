import { useEffect, useRef, useState } from "react";
import styles from "./DrawOnMapModal.module.css";
import iIcon from "../../../assets/Images/iIcon.svg";
import RemoveLocation from "../../../assets/Images/Leads/RemoveLocationImg.svg";
import AddLocation from "../../../assets/Images/Leads/AddLocationImg.svg";
import EditLocation from "../../../assets/Images/Leads/EditlocationImg.svg";
import { googleAPI } from "../../../Api/axiosInstance";

const DrawOnMapModal = ({ onClose, onNext, setLocationData, data, isEdit }) => {
  console.log(data);
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [drawingManager, setDrawingManager] = useState(null);
  const [polygons, setPolygons] = useState([]);
  const [isDrawingActive, setIsDrawingActive] = useState(false);
  const [selectedPolygonIndex, setSelectedPolygonIndex] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [geocoder, setGeocoder] = useState(null);
  const [polygonAddresses, setPolygonAddresses] = useState([]);
  const [isAreaRemoved, setIsAreaRemoved] = useState(false);

  useEffect(() => {
    let scriptTag;

    const loadGoogleMapsScript = () => {
      if (
        !window.google ||
        !window.google.maps ||
        !window.google.maps.drawing
      ) {
        scriptTag = document.createElement("script");
        scriptTag.src = `https://maps.googleapis.com/maps/api/js?key=${googleAPI}&libraries=places,drawing,geometry&callback=initMap`;
        scriptTag.async = true;
        scriptTag.defer = true;

        window.initMap = () => {
          if (isEdit) {
            editInitializeMap();
          } else {
            addInitializeMap();
          }
        };

        document.body.appendChild(scriptTag);
      } else {
        // Already loaded
        isEdit ? editInitializeMap() : addInitializeMap();
      }
    };

    const editInitializeMap = () => {
      const center = { lat: 55.3781, lng: -3.436 };

      const mapOptions = {
        center,
        zoom: 5,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
      };

      const newMap = new window.google.maps.Map(mapRef.current, mapOptions);
      setMap(newMap);

      const newGeocoder = new window.google.maps.Geocoder();
      setGeocoder(newGeocoder);

      let parsedLocations = [];
      try {
        parsedLocations = data;
      } catch (err) {
        console.error("Invalid location JSON", err);
      }

      const bounds = new window.google.maps.LatLngBounds();

      parsedLocations?.forEach((polyArr) => {
        const polygon = new window.google.maps.Polygon({
          paths: polyArr,
          fillColor: "red",
          fillOpacity: 0.3,
          strokeWeight: 2,
          strokeColor: "red",
          clickable: true,
          editable: false,
          map: newMap,
        });

        setPolygons((prev) => [...prev, polygon]);

        polyArr.forEach((coord) => {
          bounds.extend(new window.google.maps.LatLng(coord.lat, coord.lng));
        });
      });

      // ⭐ Add this to auto-zoom to polygon(s)
      if (!bounds.isEmpty()) {
        newMap.fitBounds(bounds);
      }
    };

    const addInitializeMap = () => {
      const center = { lat: 55.3781, lng: -3.436 };

      const newMap = new window.google.maps.Map(mapRef.current, {
        center,
        zoom: 5,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
      });

      setMap(newMap);

      const newGeocoder = new window.google.maps.Geocoder();
      setGeocoder(newGeocoder);

      const manager = new window.google.maps.drawing.DrawingManager({
        drawingMode: null,
        drawingControl: false,
        polygonOptions: {
          fillColor: "#4285F4",
          fillOpacity: 0.3,
          strokeWeight: 2,
          strokeColor: "#4285F4",
          clickable: true,
          editable: false,
        },
      });

      setDrawingManager(manager);

      window.google.maps.event.addListener(
        manager,
        "overlaycomplete",
        (event) => {
          if (event.type === window.google.maps.drawing.OverlayType.POLYGON) {
            const polygon = event.overlay;
            setPolygons((prev) => [...prev, polygon]);

            const path = polygon.getPath();
            const coords = [...Array(path.getLength())].map((_, i) => {
              const p = path.getAt(i);
              return { lat: p.lat(), lng: p.lng() };
            });

            const bounds = new window.google.maps.LatLngBounds();
            coords.forEach((c) => bounds.extend(c));

            manager.setDrawingMode(null);
            setIsDrawingActive(false);
          }
        }
      );
    };

    loadGoogleMapsScript();

    return () => {
      if (drawingManager) drawingManager.setMap(null);
      polygons.forEach((p) => p.setMap(null));
      if (scriptTag) scriptTag.remove();
    };
  }, []); // <- IMPORTANT: empty dependency array

  console.log(polygons, "polygons");

  const fetchAddressDetails = (latLng, updateFunction) => {
    if (!geocoder) return;

    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === "OK") {
        if (results[0]) {
          const addressComponents = results[0].address_components;
          let pincode = "";
          let city = "";

          addressComponents.forEach((component) => {
            if (component.types.includes("postal_code")) {
              pincode = component.long_name;
            }

            if (component.types.includes("locality")) {
              city = component.long_name;
            } else if (component.types.includes("sublocality") && !city) {
              city = component.long_name;
            } else if (
              component.types.includes("administrative_area_level_2") &&
              !city
            ) {
              city = component.long_name;
            }
          });

          const addressDetails = {
            pincode,
            city,
          };

          if (typeof updateFunction === "function") {
            setPolygonAddresses(updateFunction(addressDetails));
          } else {
            setPolygonAddresses((prev) => [...prev, addressDetails]);
          }
        }
      } else {
        console.error("Geocoder failed due to: " + status);

        if (typeof updateFunction === "function") {
          setPolygonAddresses(updateFunction({ pincode: "", city: "" }));
        } else {
          setPolygonAddresses((prev) => [...prev, { pincode: "", city: "" }]);
        }
      }
    });
  };

  useEffect(() => {
    if (!map) return;

    const clickListener = window.google.maps.event.addListener(
      map,
      "click",
      (event) => {
        if (!isEditMode) return;

        let polygonClicked = false;

        for (let i = 0; i < polygons.length; i++) {
          try {
            if (
              window.google.maps.geometry &&
              window.google.maps.geometry.poly
            ) {
              if (
                window.google.maps.geometry.poly.containsLocation(
                  event.latLng,
                  polygons[i]
                )
              ) {
                selectPolygon(i);
                polygonClicked = true;
                break;
              }
            } else {
              const bounds = new window.google.maps.LatLngBounds();
              const path = polygons[i].getPath();
              path.forEach((point) => bounds.extend(point));

              if (bounds.contains(event.latLng)) {
                selectPolygon(i);
                polygonClicked = true;
                break;
              }
            }
          } catch (error) {
            console.error("Error checking polygon:", error);
            continue;
          }
        }

        if (!polygonClicked && selectedPolygonIndex !== null) {
          deselectPolygon();
        }
      }
    );

    return () => {
      window.google.maps.event.removeListener(clickListener);
    };
  }, [map, isEditMode, polygons, selectedPolygonIndex]);

  useEffect(() => {
    polygons?.forEach((polygon, index) => {
      window.google.maps.event.clearListeners(polygon, "click");

      window.google.maps.event.addListener(polygon, "click", () => {
        if (isEditMode) {
          selectPolygon(index);
        }
      });
    });
  }, [polygons, isEditMode]);

  useEffect(() => {
    if (!geocoder || polygons.length === 0) return;
    console.log(polygons);

    polygons?.forEach((polygon, index) => {
      const path = polygon?.getPath?.(); // safe optional chaining
      if (!path) return;

      console.log(polygon);
      window.google.maps.event.clearListeners(polygon.getPath(), "set_at");
      window.google.maps.event.clearListeners(polygon.getPath(), "insert_at");
      window.google.maps.event.clearListeners(polygon.getPath(), "remove_at");

      const handlePathChanged = () => {
        const path = polygon.getPath();

        const bounds = new window.google.maps.LatLngBounds();
        for (let i = 0; i < path.getLength(); i++) {
          bounds.extend(path.getAt(i));
        }

        const center = bounds.getCenter();

        fetchAddressDetails(center, (prevAddresses) => {
          const newAddresses = [...prevAddresses];
          newAddresses[index] = { city: "", pincode: "" };
          return newAddresses;
        });

        geocoder.geocode({ location: center }, (results, status) => {
          if (status === "OK" && results[0]) {
            const addressComponents = results[0].address_components;
            let pincode = "";
            let city = "";

            addressComponents.forEach((component) => {
              if (component.types.includes("postal_code")) {
                pincode = component.long_name;
              }
              if (component.types.includes("locality")) {
                city = component.long_name;
              } else if (component.types.includes("sublocality") && !city) {
                city = component.long_name;
              } else if (
                component.types.includes("administrative_area_level_2") &&
                !city
              ) {
                city = component.long_name;
              }
            });

            const addressDetails = { pincode, city };

            setPolygonAddresses((prev) => {
              const updated = [...prev];
              updated[index] = addressDetails;
              return updated;
            });
          } else {
            console.error(
              `Geocode failed for polygon ${index} with status:`,
              status
            );
          }
        });
      };

      polygon.getPath().addListener("set_at", handlePathChanged);
      polygon.getPath().addListener("insert_at", handlePathChanged);
      polygon.getPath().addListener("remove_at", handlePathChanged);
    });
  }, [geocoder, polygons]);

  const selectPolygon = (index) => {
    deselectPolygon();

    setSelectedPolygonIndex(index);

    polygons[index].setOptions({
      editable: true,
      fillColor: "#FF5722",
      strokeColor: "#FF5722",
    });
  };

  const deselectPolygon = () => {
    if (selectedPolygonIndex !== null && polygons[selectedPolygonIndex]) {
      polygons[selectedPolygonIndex].setOptions({
        editable: false,
        fillColor: "#4285F4",
        strokeColor: "#4285F4",
      });
      setSelectedPolygonIndex(null);
    }
  };

  const handleAddArea = () => {
    if (!map || !drawingManager) {
      console.error("Map or drawing manager not initialized");
      return;
    }

    if (isEditMode) {
      setIsEditMode(false);
      deselectPolygon();
    }

    drawingManager.setMap(map);
    drawingManager.setDrawingMode(
      window.google.maps.drawing.OverlayType.POLYGON
    );
    setIsDrawingActive(true);
  };

  const handleEditAreaMode = () => {
    setIsEditMode(!isEditMode);

    if (isEditMode) {
      deselectPolygon();
    } else {
      if (drawingManager) {
        drawingManager.setDrawingMode(null);
        drawingManager.setMap(null);
      }
      setIsDrawingActive(false);
      setSelectedPolygonIndex(null);
    }
  };

  const handleRemoveArea = () => {
    if (polygons.length === 0) return;

    let updatedPolygons = [...polygons];

    if (selectedPolygonIndex !== null) {
      polygons[selectedPolygonIndex].setMap(null);
      updatedPolygons = updatedPolygons.filter(
        (_, index) => index !== selectedPolygonIndex
      );

      setPolygonAddresses((prev) =>
        prev.filter((_, index) => index !== selectedPolygonIndex)
      );
      setSelectedPolygonIndex(null);
    } else {
      const lastPolygon = polygons[polygons.length - 1];
      lastPolygon.setMap(null);
      updatedPolygons.pop();

      setPolygonAddresses((prev) => prev.slice(0, -1));
    }

    setPolygons(updatedPolygons);
    setIsAreaRemoved(true);
    setIsEditMode(false);

    if (updatedPolygons.length > 0) {
      const lastPolygonPath =
        updatedPolygons[updatedPolygons.length - 1].getPath();
      const bounds = new window.google.maps.LatLngBounds();
      for (let i = 0; i < lastPolygonPath.getLength(); i++) {
        bounds.extend(lastPolygonPath.getAt(i));
      }
      const center = bounds.getCenter();

      getGeocodeDetails(center).then(({ city, pincode }) => {
        const coordinates = Array.from(
          { length: lastPolygonPath.getLength() },
          (_, i) => {
            const point = lastPolygonPath.getAt(i);
            return { lat: point.lat(), lng: point.lng() };
          }
        );

        const data = {
          city,
          postcode: pincode,
          miles: 0,
          coordinates: JSON.stringify(coordinates),
        };

        setLocationData(data);
      });
    } else {
      setLocationData(null);
    }
  };

  const getGeocodeDetails = (latLng) => {
    return new Promise((resolve) => {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: latLng }, (results, status) => {
        if (status === "OK" && results[0]) {
          let city = "";
          let pincode = "";

          results[0].address_components.forEach((component) => {
            if (component.types.includes("postal_code")) {
              pincode = component.long_name;
            }
            if (
              component.types.includes("locality") ||
              component.types.includes("administrative_area_level_2")
            ) {
              city = component.long_name;
            }
          });

          resolve({ city, pincode });
        } else {
          resolve({ city: "", pincode: "" });
        }
      });
    });
  };

  const handleSubmit = async () => {
    const polygonPromises = polygons.map(async (polygon) => {
      const path = polygon.getPath();

      const bounds = new window.google.maps.LatLngBounds();
      for (let i = 0; i < path.getLength(); i++) {
        bounds.extend(path.getAt(i));
      }
      const center = bounds.getCenter();
      const { city, pincode } = await getGeocodeDetails(center);

      const coordinates = Array.from({ length: path.getLength() }, (_, i) => {
        const point = path.getAt(i);
        return { lat: point.lat(), lng: point.lng() };
      });

      return {
        coordinates,
        city,
        pincode,
        location: `${city},${pincode}`,
      };
    });
    const allPolygonData = await Promise.all(polygonPromises);
    // let coordinatesData = [];
    let coordinatesData = allPolygonData.map((polygon) => polygon.coordinates);
    console.log(coordinatesData);

    const data = {
      city: allPolygonData?.[0]?.city,
      postcode: allPolygonData?.[0]?.pincode,
      miles: 0,
      coordinates: JSON.stringify(coordinatesData),
    };

    setLocationData(data);
    onNext(data);
    onClose();
  };

  useEffect(() => {
    // document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>

        <h2 className={styles.title}>
          Define Your Service Areas - Draw on a map
        </h2>

        <div className={styles.infoBox}>
          <img src={iIcon} alt="" />
          <span>
            {" "}
            You can draw and add multiple service areas on the map to precisely
            show where you offer your services.{" "}
          </span>
        </div>

        <div className={styles.areaButtonGroup}>
          <button
            className={`${styles.areaButton} ${
              isDrawingActive ? styles.activeButton : ""
            }`}
            onClick={handleAddArea}
            disabled={isEditMode}
          >
            <img src={AddLocation} alt="..." /> Add new area
          </button>
          <button
            className={`${styles.areaButton} ${
              isEditMode ? styles.activeButton : ""
            }`}
            onClick={handleEditAreaMode}
            disabled={polygons.length === 0}
          >
            <img src={EditLocation} alt="..." width={15} height={15} /> Edit an
            area
          </button>
          <button
            className={styles.areaButton}
            onClick={handleRemoveArea}
            disabled={polygons.length === 0}
          >
            <img src={RemoveLocation} alt="..." /> Remove an area{" "}
            {selectedPolygonIndex !== null ? "(Selected)" : ""}
          </button>
        </div>

        <div
          ref={mapRef}
          style={{ width: "100%", height: "400px", margin: "20px 0" }}
        ></div>

        <div className={styles.buttonContainer}>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.nextButton} onClick={handleSubmit}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default DrawOnMapModal;
