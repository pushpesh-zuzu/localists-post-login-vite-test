import { useEffect, useState } from "react";
import styles from "./AddLocationModal.module.css";
import DistanceIcon from "../../../assets/Icons/DistanceIcon.svg";
import TravelTimeIcon from "../../../assets/Icons/DistanceIcon.svg";
import DrawOnMapIcon from "../../../assets/Icons/DistanceIcon.svg";
import NationwideIcon from "../../../assets/Icons/NationwideIcon.svg";
import TravelTimeModal from "./TravelTimeModal";
import DrawOnMapModal from "./DrawOnMapModal";
import LocationModal from "../LocationModal";
import {
  addLocationLead,
  editLocationLead,
  getleadPreferencesList,
  getLocationLead,
} from "../../../store/LeadSetting/leadSettingSlice";
import { useDispatch, useSelector } from "react-redux";
import ServiceSelectionModal from "../LeadSettings/ServiceModal";

const AddLocationModal = ({
  open,
  onCancel,
  selectedServices,
  setSelectedServices,
  setIsLocationModalOpen,
}) => {
  const [isNextModalOpen, setIsNextModalOpen] = useState(false);

  const [selectedOption, setSelectedOption] = useState("");
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [editLocationId, setEditLocationId] = useState(null);
  const [locationType, setLocationType] = useState("");
  const { registerData } = useSelector((state) => state.findJobs);
  const { getlocationData } = useSelector((state) => state.leadSetting);
  const isNationWide = () => {
    if (getlocationData[0]?.nation_wide == 1) {
      return true;
    }
    let nationWideCount = 0;
    getlocationData?.forEach((item) => {
      if (item?.type === "Nationwide") {
        nationWideCount++;
      }
    });
    if (nationWideCount > 1) {
      return true;
    } else {
      return false;
    }
  };
  const [locationData, setLocationData] = useState({
    miles1: "20",
    postcode: "",
    travel_time: "",
    travel_by: "",
    coordinates: "",
  });
  const [isFromTravelTime, setIsFromTravelTime] = useState(false);
  useEffect(() => {
    setIsFromTravelTime(false);
  }, []);
  const { userToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const handleOptionClick = (option) => {
    setSelectedOption(option);
    if (option === "nationwide") {
      setLocationType("Nationwide");
      setIsNextModalOpen(true);
      return;
    }
    let type = "";
    if (option === "distance") type = "Distance";
    else if (option === "travelTime") type = "Travel Time";
    else if (option === "drawOnMap") type = "Draw on Map";

    setLocationType(type);
  };
  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setLocationData((prev) => ({ ...prev, [name]: value }));
  };
  const handleConfirm = (data) => {
    const serviceIds = data.join(",");

    const locationdata = {
      user_id: userToken?.remember_tokens,
      miles: locationType === "Nationwide" ? 0 : locationData.miles1 ?? 0,
      postcode:
        locationData.postcode && locationData.postcode != ""
          ? locationData.postcode
          : "000000",

      city: locationData?.city ?? "",
      travel_time: locationData?.travel_time,
      travel_by: locationData?.travel_by,
      type: locationType,
      nation_wide: locationType === "Nationwide" ? 1 : 0,
      service_id: serviceIds,
      postcode_old: locationData.postcode ? locationData.postcode : "000000",
      coordinates: locationData?.coordinates ?? "",
    };
    console.log("jhdbfufg", locationData);
    if (isEditingLocation && editLocationId) {
      dispatch(
        editLocationLead({ ...locationdata, location_id: editLocationId })
      ).then((result) => {
        if (result?.success) {
          const data = { user_id: userToken?.remember_tokens };
          dispatch(getLocationLead(data));
          dispatch(getleadPreferencesList(data));
          setIsEditingLocation(false);
          setSelectedOption(false);
          setIsLocationModalOpen(false);
          setEditLocationId(null);
          setLocationData({
            miles1: "20",
            postcode: "",
          });
          setSelectedServices([]);
        }
      });
    } else {
      dispatch(addLocationLead(locationdata)).then((result) => {
        if (result?.success) {
          const data = { user_id: userToken?.remember_tokens };
          dispatch(getLocationLead(data));
          dispatch(getleadPreferencesList(data));
          setSelectedOption(false);
          setLocationType("");
          setIsLocationModalOpen(false);
          setLocationData({
            miles1: "20",
            postcode: "",
          });
          setIsNextModalOpen(false);
        }
      });
    }
  };

  const handleNext = (data) => {
    if (data) {
      setIsFromTravelTime(true);
    }
    setSelectedOption("");
    setIsNextModalOpen(true);
  };

  if (!open) return null;
  const handleChildModalClose = () => {
    setSelectedOption("");
  };

  return (
    <>
      {!selectedOption && !isNextModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContainer}>
            <button className={styles.closeButton} onClick={onCancel}>
              &times;
            </button>

            <h2 className={styles.title}>Add a Location</h2>
            <p className={styles.subtitle}>
              Choose how you’d like to set your service area
            </p>

            <div className={styles.optionsContainer}>
              <div
                className={styles.option}
                onClick={() => handleOptionClick("distance")}
              >
                <img
                  src={DistanceIcon}
                  alt="Distance"
                  className={styles.icon}
                />
                <div className={styles.textContainer}>
                  <h3 className={styles.optionTitle}>Distance</h3>
                  <p className={styles.optionDescription}>
                    Enter a postcode or town, then set how far you’re willing to
                    travel from that point (straight-line radius).
                  </p>
                </div>
              </div>

              <div
                className={styles.option}
                onClick={() => handleOptionClick("travelTime")}
              >
                <img
                  src={TravelTimeIcon}
                  alt="Travel Time"
                  className={styles.icon}
                />
                <div className={styles.textContainer}>
                  <h3 className={styles.optionTitle}>Travel Time</h3>
                  <p className={styles.optionDescription}>
                    Let us know your starting point and the maximum time you're
                    happy to travel—perfect for service zones based on real
                    driving time.
                  </p>
                </div>
              </div>

              <div
                className={styles.option}
                onClick={() => handleOptionClick("drawOnMap")}
              >
                <img
                  src={DrawOnMapIcon}
                  alt="Draw on a Map"
                  className={styles.icon}
                />
                <div className={styles.textContainer}>
                  <h3 className={styles.optionTitle}>Draw on a Map</h3>
                  <p className={styles.optionDescription}>
                    Custom-draw one or more specific areas directly on the map
                    to define your exact service boundaries.
                  </p>
                </div>
              </div>

              {!isNationWide() && (
                <div
                  className={styles.option}
                  onClick={() => handleOptionClick("nationwide")}
                >
                  <img
                    src={NationwideIcon}
                    alt="Nationwide"
                    className={styles.icon}
                  />
                  <div className={styles.textContainer}>
                    <h3 className={styles.optionTitle}>Nationwide</h3>
                    <p className={styles.optionDescription}>
                      Offer services across the entire country? Choose this to
                      appear in searches from any location.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedOption === "distance" && (
        <LocationModal
          onClose={handleChildModalClose}
          onChange={handleLocationChange}
          locationData={locationData}
          onNext={handleNext}
        />
      )}

      {selectedOption === "travelTime" && (
        <TravelTimeModal
          onClose={handleChildModalClose}
          onNext={handleNext}
          locationData={locationData}
          setLocationData={setLocationData}
        />
      )}

      {selectedOption === "drawOnMap" && (
        <DrawOnMapModal
          onClose={handleChildModalClose}
          onNext={handleNext}
          locationData={locationData}
          setLocationData={setLocationData}
        />
      )}

      {selectedOption === "nationwide" && <></>}

      {isNextModalOpen && (
        <ServiceSelectionModal
          isOpen={isNextModalOpen}
          onClose={() => {
            setIsLocationModalOpen(false);
            setIsNextModalOpen(false);
            setSelectedOption("");
          }}
          onConfirm={handleConfirm}
          selectedServices={selectedServices}
          setSelectedServices={setSelectedServices}
        />
      )}
    </>
  );
};

export default AddLocationModal;
