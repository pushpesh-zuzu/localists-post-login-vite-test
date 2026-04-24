import { useEffect, useRef, useState } from "react";
import styles from "./DropPinMapModal.module.css";
import iIcon from "../../assets/Images/iIcon.svg";
import { googleAPI } from "../../Api/axiosInstance";
import { useSelector } from "react-redux";
import { EnvironmentFilled, SearchOutlined } from "@ant-design/icons";
import DistanceIcon from "../../assets/Icons/DistanceIcon.svg";
// import MapPin from "../../ReactIcon/MapPin";

const getMapPin = (color = "#3A5898", size = 40) => {
    return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 18 18">
      <path d="M13.374 10.9141L9.00313 16.8L4.63227 10.9141C3.91755 9.95167 3.37675 8.85707 3.26033 7.66392C3.1599 6.63454 3.15574 5.37164 3.54927 4.47213C4.58384 2.10741 6.44335 0.800003 9.00313 0.800003C11.5629 0.800003 13.4224 2.10741 14.457 4.47213C14.8505 5.37164 14.8463 6.63454 14.7459 7.66392C14.6295 8.85707 14.0887 9.95167 13.374 10.9141Z" fill="${color}" />
      <path d="M6.79688 7.2L8.19688 8.6L11.3969 5.2" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;
};

const DropPinMapModal = ({ open, onClose, onNext, setDropPinLocationData }) => {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const circleRef = useRef({});  // was useRef([])
    const markerRef = useRef({});  // was useRef([])
    const milesRef = useRef(null);
    const searchInputRef = useRef(null);
    const autocompleteRef = useRef(null);
    const isMilesUpdateRef = useRef(false);

    const { getLocationDistanceTypeData, getLocationDistanceTypeLoader } = useSelector(
        (state) => state.leadSetting
    );

    const [locations, setLocations] = useState([]);
    const [activeIndex, setActiveIndex] = useState(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [hoverIndex, setHoverIndex] = useState(null);
    const [isDropPin, setIsDropPin] = useState(false);
    const [error, setError] = useState("");

    // console.log("locationData", locations)

    useEffect(() => {
        setDropPinLocationData(locations);
    }, [locations]);

    // INIT DATA (MILES)
    useEffect(() => {
        if (getLocationDistanceTypeData?.length) {
            const updated = getLocationDistanceTypeData.map((item) => ({
                id: item.id,
                postcode: item.postcode,
                miles: item.miles || "0",
                // service_ids: item.service_ids || [],
            }));
            setLocations(updated);
        }
    }, [getLocationDistanceTypeData]);

    useEffect(() => {
        if (
            !mapLoaded ||
            !window.google?.maps?.places ||
            !searchInputRef.current ||
            !mapInstance.current // IMPORTANT
        ) return;

        const autocomplete = new window.google.maps.places.Autocomplete(
            searchInputRef.current,
            {
                types: ["geocode"],
                componentRestrictions: { country: "uk" }, // UK ONLY
            }
        );

        autocomplete.bindTo("bounds", mapInstance.current);

        autocompleteRef.current = autocomplete;

        const listener = autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();

            if (!place.geometry) return;

            const location = place.geometry.location;

            mapInstance.current.panTo(location);
            mapInstance.current.setZoom(10);

            // 🔥 Extract postcode
            const postal = place.address_components?.find((c) =>
                c.types.includes("postal_code")
            );

            // ❌ If NO postcode → BLOCK
            if (!postal) {
                setError("Please select a valid UK postcode only.");

                // Clear input even on error (optional)
                if (searchInputRef.current) {
                    searchInputRef.current.value = "";
                }

                return;
            }

            const postcode = postal.long_name.replace(/\s/g, "");

            // Save ONLY postcode
            // setLocations((prev) => [
            //     ...prev,
            //     {
            //         postcode: postcode.trim(),
            //         miles: "16",
            //     },
            // ]);

            setLocations((prev) => {
                const exists = prev.some(
                    (item) => item.postcode === postcode.trim()
                );

                if (exists) {
                    setError("This postcode is already added.");
                    return prev; // don't add duplicate
                }

                return [
                    ...prev,
                    {
                        postcode: postcode.trim(),
                        miles: "16",
                    },
                ];
            });

            // setError(""); // clear error

            if (searchInputRef.current) {
                searchInputRef.current.value = "";
            }
        });

        return () => {
            window.google.maps.event.clearInstanceListeners(autocomplete);
        };
    }, [mapLoaded, mapInstance.current]);

    useEffect(() => {
        if (window.google?.maps?.places) {
            setMapLoaded(true);
            return;
        }

        const existingScript = document.querySelector(
            `script[src*="maps.googleapis.com/maps/api/js"]`
        );

        if (!existingScript) {
            const script = document.createElement("script");
            script.src = `https://maps.googleapis.com/maps/api/js?key=${googleAPI}&libraries=places`;
            script.async = true;
            script.onload = () => setMapLoaded(true);
            document.body.appendChild(script);
        } else {
            setMapLoaded(true);
        }
    }, []);

    useEffect(() => {
        if (!mapLoaded || !mapRef.current || getLocationDistanceTypeLoader) return;

        mapInstance.current = new window.google.maps.Map(mapRef.current, {
            center: { lat: 20.5937, lng: 78.9629 },
            zoom: 5,
            draggableCursor: "default",
        });
    }, [mapLoaded, getLocationDistanceTypeLoader]);

    useEffect(() => {
        if (!window.google || !mapInstance.current || !mapLoaded) return;

        if (isMilesUpdateRef.current) {
            isMilesUpdateRef.current = false;
            return;
        }

        // Clear only markers/circles that no longer exist in locations
        const currentKeys = locations.map((l) => l.postcode);

        Object.keys(markerRef.current).forEach((key) => {
            if (!currentKeys.includes(key)) {
                markerRef.current[key].setMap(null);
                delete markerRef.current[key];
            }
        });

        Object.keys(circleRef.current).forEach((key) => {
            if (!currentKeys.includes(key)) {
                circleRef.current[key].setMap(null);
                delete circleRef.current[key];
            }
        });

        const geocoder = new window.google.maps.Geocoder();
        const bounds = new window.google.maps.LatLngBounds();
        let completed = 0;

        locations.forEach((item) => {
            // Skip if marker already exists for this postcode
            if (markerRef.current[item.postcode]) {
                const circle = circleRef.current[item.postcode];
                if (circle) {
                    const circleBounds = circle.getBounds();
                    if (circleBounds) bounds.union(circleBounds);
                }
                completed++;
                if (completed === locations.length) {
                    mapInstance.current.fitBounds(bounds);
                }
                return;
            }

            geocoder.geocode({ address: item.postcode }, (res, status) => {
                if (status === "OK") {
                    const pos = res[0].geometry.location;

                    const marker = new window.google.maps.Marker({
                        position: pos,
                        map: mapInstance.current,
                        icon: {
                            url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(getMapPin("#3A5C97", 30)),
                            scaledSize: new window.google.maps.Size(30, 30),
                            anchor: new window.google.maps.Point(15, 30),
                        },
                    });

                    const circle = new window.google.maps.Circle({
                        map: mapInstance.current,
                        center: pos,
                        radius: item.miles * 1609.34,
                        fillColor: "#D6ECFF",
                        fillOpacity: 0.4,
                        strokeColor: "#1877F2",
                        strokeOpacity: 0.5,
                        strokeWeight: 1.5,
                    });

                    // Store by postcode key
                    markerRef.current[item.postcode] = marker;
                    circleRef.current[item.postcode] = circle;

                    const circleBounds = circle.getBounds();
                    if (circleBounds) bounds.union(circleBounds);
                }

                completed++;
                if (completed === locations.length) {
                    mapInstance.current.fitBounds(bounds);
                }
            });
        });
    }, [locations, mapLoaded]);

    useEffect(() => {
        if (!Object.keys(markerRef.current).length) return;

        locations.forEach((item, index) => {
            const color = hoverIndex === index ? "#1877F2" : "#3A5C97";
            const marker = markerRef.current[item.postcode];
            if (marker) {
                marker.setIcon({
                    url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(getMapPin(color, 30)),
                    scaledSize: new window.google.maps.Size(30, 30),
                    anchor: new window.google.maps.Point(15, 30),
                });
            }
        });
    }, [hoverIndex]);

    const updateMiles = (index, value) => {
        const clamped = Math.min(80, Math.max(1, Number(value)));
        const postcode = locations[index].postcode;

        // Update by postcode key, not index
        if (circleRef.current[postcode]) {
            circleRef.current[postcode].setRadius(clamped * 1609.34);
        }

        isMilesUpdateRef.current = true;
        const updated = [...locations];
        updated[index].miles = String(clamped);
        setLocations(updated);
    };

    useEffect(() => {
        const handleClick = (e) => {
            if (
                milesRef.current?.contains(e.target) ||
                e.target.closest(`.${styles.locationItem}`)
            ) {
                return;
            }

            setActiveIndex(null);
        };

        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    useEffect(() => {
        if (!mapInstance.current || !isDropPin) return;

        const listener = mapInstance.current.addListener("click", (e) => {
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();

            const geocoder = new window.google.maps.Geocoder();

            geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                if (status !== "OK" || !results[0]) {
                    alert("Unable to fetch postcode for this location");
                    return;
                }

                const components = results[0].address_components;

                // Extract ONLY postcode
                const postalComponent = components.find((c) =>
                    c.types.includes("postal_code")
                );

                const postcode = postalComponent?.long_name || "";

                // If no postcode → show message
                if (!postcode) {
                    setError("Please select a valid location or use the search bar to select a postcode."); return;
                }

                // Add clean data
                // setLocations((prev) => [
                //     ...prev,
                //     {
                //         postcode: postcode.trim(),
                //         miles: "16", // default string
                //     },
                // ]);

                setLocations((prev) => {
                    const exists = prev.some(
                        (item) => item.postcode === postcode.trim()
                    );

                    if (exists) {
                        setError("This postcode is already added.");
                        return prev;
                    }

                    return [
                        ...prev,
                        {
                            postcode: postcode.trim(),
                            miles: "16",
                        },
                    ];
                });
                // setError("");
            });

            // Auto disable drop pin mode
            setIsDropPin(false);
        });

        return () => listener?.remove();
    }, [isDropPin]);

    useEffect(() => {
        if (!mapInstance.current) return;

        if (isDropPin) {
            const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 18 18">
      <path d="M13.374 10.9141L9.00313 16.8L4.63227 10.9141C3.91755 9.95167 3.37675 8.85707 3.26033 7.66392C3.1599 6.63454 3.15574 5.37164 3.54927 4.47213C4.58384 2.10741 6.44335 0.800003 9.00313 0.800003C11.5629 0.800003 13.4224 2.10741 14.457 4.47213C14.8505 5.37164 14.8463 6.63454 14.7459 7.66392C14.6295 8.85707 14.0887 9.95167 13.374 10.9141Z" fill="#3A5C97" />
      <path d="M6.79688 7.2L8.19688 8.6L11.3969 5.2" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    `;

            const encoded = encodeURIComponent(svg);

            mapInstance.current.setOptions({
                draggableCursor: `url("data:image/svg+xml;charset=UTF-8,${encoded}") 15 30, auto`,
            });

        } else {
            mapInstance.current.setOptions({
                draggableCursor: "grab",
            });
        }
    }, [isDropPin]);

    useEffect(() => {
        if (!error) return;

        const timer = setTimeout(() => {
            setError("");
        }, 5000); // 2 seconds

        return () => clearTimeout(timer);
    }, [error]);

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>

                <button className={styles.closeButton} onClick={onClose}>
                    &times;
                </button>

                {/* HEADER */}
                <div className={styles.modalHeader}>
                    <h2>Distance</h2>
                </div>

                {/* SCROLL AREA */}
                {
                    getLocationDistanceTypeLoader ? (
                        <div className={styles.loaderWrapper}>
                            <div className={styles.loader}></div>
                        </div>
                    ) : (
                        <>
                            <div className={styles.scrollContent}>

                                <div className={styles.infoBox}>
                                    <img src={iIcon} alt="" />
                                    <span>Select your service location and radius</span>
                                </div>

                                {/* LOCATION LIST */}
                                <div className={styles.inputField}>
                                    <label>Locations</label>
                                    <div
                                        className={`${styles.locationWrapper} ${activeIndex !== null ? styles.noScroll : ""
                                            }`}
                                    >
                                        {locations.map((item, index) => (
                                            <div
                                                key={index}
                                                className={`${styles.locationItem} ${activeIndex === index ? styles.activeRow : ""
                                                    }`}
                                                onMouseEnter={() => setHoverIndex(index)}   // hover
                                                onMouseLeave={() => setHoverIndex(null)}    // leave
                                            >
                                                <div
                                                    className={styles.iconBox}
                                                    dangerouslySetInnerHTML={{
                                                        __html: getMapPin("#006B4E", 20),
                                                    }}
                                                />

                                                <div
                                                    className={styles.textActive}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveIndex((prev) => (prev === index ? null : index));
                                                    }}
                                                >
                                                    {item.postcode}

                                                    <span className={styles.km}>
                                                        + {item.miles} mi

                                                        <span
                                                            className={`${styles.arrow} ${activeIndex === index ? styles.arrowOpen : ""
                                                                }`}
                                                        ></span>
                                                    </span>
                                                </div>

                                                {/* POPUP */}
                                                {activeIndex === index && (
                                                    <div className={styles.popup} ref={milesRef}
                                                        onClick={(e) => e.stopPropagation()}>
                                                        <div className={styles.slideHeader}>
                                                            Distance Radius
                                                        </div>
                                                        <div className={styles.sliderRow}>
                                                            <span>1</span>
                                                            <div className={styles.sliderWrapper}>
                                                                <div className={styles.sliderTrack}>
                                                                    <div
                                                                        className={styles.sliderFill}
                                                                        style={{
                                                                            width: `${(Number(item.miles) / 80) * 100}%`,
                                                                        }}
                                                                    />
                                                                </div>

                                                                <input
                                                                    type="range"
                                                                    min="1"
                                                                    max="80"
                                                                    value={Number(item.miles)}
                                                                    onChange={(e) => updateMiles(index, e.target.value)}
                                                                    className={styles.sliderInput}
                                                                />
                                                            </div>
                                                            <span>80</span>
                                                        </div>

                                                        <div className={styles.inputRowKm}>
                                                            <input
                                                                type="number"
                                                                min="1"
                                                                max="80"
                                                                value={item.miles}
                                                                onChange={(e) =>
                                                                    updateMiles(index, e.target.value)
                                                                }
                                                            />
                                                            <span>mi</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {/* MAP */}
                                <div
                                    className={`${styles.mapWrapper} ${isDropPin ? styles.dropActive : ""
                                        }`}
                                >            <div className={styles.searchContainer}>
                                        <div className={styles.searchInputWrapper}>
                                            <SearchOutlined className={styles.searchIcon} />
                                            <input
                                                ref={searchInputRef}
                                                type="text"
                                                placeholder="Search postcode"
                                                className={styles.mapSearch}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        className={`${styles.dropPinBtn} ${isDropPin ? styles.activePin : ""}`}
                                        onClick={() => {
                                            setIsDropPin((prev) => !prev);
                                            setError("");
                                        }}
                                    >

                                        {/* 🔥 ICON */}
                                        <span
                                            className={styles.pinIcon}
                                            dangerouslySetInnerHTML={{
                                                __html: getMapPin("#1C2B33", 16),
                                            }}
                                        />

                                        Drop Pin
                                    </button>

                                    {/* MAP */}
                                    <div className={styles.mapBox}>
                                        <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
                                    </div>
                                </div>
                            </div>

                            {/* FOOTER */}
                            <div className={styles.modalFooter}>
                                <button className={styles.cancelBtn} onClick={onClose}>
                                    Cancel
                                </button>

                                <button
                                    className={styles.nextBtn}
                                    onClick={() => {
                                        if (locations.length > 0)
                                            onNext("distance");
                                    }}
                                >
                                    Next
                                </button>

                            </div>
                            {error && (
                                <div className={styles.errorText}>
                                    {error}
                                </div>
                            )}
                        </>
                    )
                }

            </div>
        </div>
    );
};

export default DropPinMapModal;