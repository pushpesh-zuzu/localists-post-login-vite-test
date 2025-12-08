import { useState, useRef, useEffect, useCallback } from "react";
import styles from "./LeadSettings.module.css";
import EditIcon from "../../../assets/Images/Leads/EditIcon.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  addServiceLead,
  editLocationLead,
  getleadPreferencesList,
  getLocationLead,
  getOnlineRemoteApi,
  getSevenWeekBidApi,
  getSevenWeekPausedBidApi,
  isOnlineRemote,
  leadPreferences,
  removeItemLocationData,
} from "../../../store/LeadSetting/leadSettingSlice";
import { Spin, Tooltip } from "antd";
import {
  setService,
  searchAvailableService,
  getPopularServiceListUser,
} from "../../../store/FindJobs/findJobSlice";
import { useLocation, useNavigate } from "react-router-dom";
import RemoveServiceModal from "../RemoveModal";
import ServiceSelectionModal from "./ServiceModal";
import { showToast } from "../../../utils";
import LocationModal from "../LocationModal";
import AddServiceModal from "../LeadAddServiceModal";
import AddLocationModal from "../AddLocation/AddLocationModal";
import TravelTimeModal from "../AddLocation/TravelTimeModal";
import DrawOnMapModal from "../AddLocation/DrawOnMapModal";
import ViewOnMapModal from "../AddLocation/ViewOnMapModal";
import CheckPrimary from "../../../assets/Icons/MyResponse/primaryServiceIcon.svg";
import blackArrow from "../../../assets/Images/Leads/blackArrowRight.svg";

const LeadSettings = ({ setSelectedService, selectedService }) => {
  const location = useLocation();
  const serviceRefs = useRef({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [editLocationId, setEditLocationId] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const {
    preferenceList,
    serviceLoader,
    getlocationData,
    removeLocationLoader,

    sevenPausedData,
    getOnlineRemote,
  } = useSelector((state) => state.leadSetting);
  const { userToken } = useSelector((state) => state.auth);
  const [autobid_pause, setAutoBid] = useState(
    sevenPausedData?.autobidpause === 1
  );
  const [is_online, setIsOnline] = useState(getOnlineRemote?.isonline === 1);
  const [isNextModalOpen, setIsNextModalOpen] = useState(false);
  const [isEditModalOpen, setIseditModalOpen] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [previousPostcode, setPreviousPostcode] = useState("");
  const [isTravelTimeModalOpen, setIsTravelTimeModalOpen] = useState(false);
  const [isDrawTimeOpen, setIsDrawTimeOpen] = useState(false);
  const [selectedTravelLocation, setSelectedTravelLocation] = useState(null);
  const [isopenviewModal, setIsOpenViewModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [latitude, setLatitude] = useState([]);
  const { popularList } = useSelector((state) => state.findJobs);

  const type = useRef();

  useEffect(() => {
    dispatch(
      getPopularServiceListUser({
        user_id: userToken?.id ? userToken?.id : registerData?.id,
      })
    );
  }, [dispatch]);

  useEffect(() => {
    setAutoBid(sevenPausedData?.autobidpause === 1);
    setIsOnline(getOnlineRemote?.isonline === 1);
  }, [sevenPausedData?.autobidpause, getOnlineRemote?.isonline]);

  const [isMobileView, setIsMobileView] = useState(false);
  const { searchServiceLoader, service, registerData } = useSelector(
    (state) => state.findJobs
  );
  const [locationData, setLocationData] = useState({
    miles1: "20",
    postcode: "",
  });

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setLocationData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    let data = {};
    if (userToken?.active_status == 1) {
      data = {
        user_id: userToken?.remember_tokens,
      };
    } else {
      data = {
        user_id: registerData?.remember_tokens,
      };
    }

    dispatch(getleadPreferencesList(data));
    dispatch(getSevenWeekPausedBidApi(data));
    dispatch(getOnlineRemoteApi(data));
  }, []);

  useEffect(() => {
    if (userToken?.active_status == 1) {
      const data = {
        user_id: userToken?.remember_tokens,
      };
      dispatch(getLocationLead(data));
    } else {
      const locationData = {
        user_id: registerData?.remember_tokens,
      };
      dispatch(getLocationLead(locationData));
    }
  }, []);

  const handleServiceClick = (service, name, primaryService) => {
    setSelectedService({
      name: name,
      id: service,
      primaryService: primaryService,
    });

    if (service) {
      const questionData = {
        service_id: service,
        user_id: userToken?.remember_tokens,
      };

      dispatch(leadPreferences(questionData));
    }
  };

  const handleService = () => {
    setIsModalOpen(true);
    setInput("");
    setSelectedService(null);
    dispatch(setService([]));
    setSelectedServices([]);
  };
  useEffect(() => {
    if (isDropdownOpen && input.trim() !== "") {
      const delayDebounce = setTimeout(() => {
        dispatch(
          searchAvailableService({
            user_id: userToken?.id ? userToken?.id : registerData?.id,
            search: input,
          })
        );
      }, 500);

      return () => clearTimeout(delayDebounce);
    }
  }, [input, dispatch, isDropdownOpen]);

  const handleSelectService = useCallback(
    (item) => {
      setInput("");
      setIsDropdownOpen(false);

      setSelectedServices((prev) => {
        const isAlreadySelected = prev.some(
          (service) => service.id === item.id
        );
        return isAlreadySelected ? prev : [...prev, item];
      });

      setTimeout(() => dispatch(setService([])), 100);
    },
    [dispatch]
  );
  const handleSubmitData = useCallback(() => {
    const serviceIds = selectedServices.map((item) => item.id).join(",");

    const serviceDataList = {
      user_id: userToken?.remember_tokens,
      service_id: serviceIds,
    };

    dispatch(addServiceLead(serviceDataList)).then((result) => {
      if (result?.success) {
        dispatch(
          getleadPreferencesList({
            user_id: userToken?.remember_tokens
              ? userToken?.remember_tokens
              : registerData?.remember_tokens,
          })
        );
        const data = {
          user_id: userToken?.remember_tokens
            ? userToken?.remember_tokens
            : registerData?.remember_tokens,
        };
        dispatch(getLocationLead(data));
        setIsModalOpen(false);
        setSelectedServices([]);
      }
    });
  }, [selectedServices, userToken, dispatch]);

  const handleRemoveService = useCallback((id) => {
    setSelectedServices((prev) => prev.filter((service) => service.id !== id));
  }, []);
  const [removeModal, setRemoveModal] = useState({
    show: false,
    service_id: null,
    nation_wide: null,
    miles: null,
  });

  const handleNext = () => {
    if (!locationData.postcode || !locationData.miles1) {
      return;
    }
    setIsLocationModalOpen(false);
  };

  const handleLocationNext = () => {
    setIseditModalOpen(false);
    setIsNextModalOpen(true);
  };

  const handleEditLocation = (location) => {
    setIsEdit(true);
    type.current = location.type;

    if (location.service_ids) {
      try {
        let serviceIdsArray = [];

        if (typeof location.service_ids === "string") {
          serviceIdsArray = location.service_ids
            .split(",")
            .map((id) => id.trim())
            .filter((id) => id !== "");
        } else if (Array.isArray(location.service_ids)) {
          serviceIdsArray = location.service_ids.map((id) => id.toString());
        } else if (typeof location.service_ids === "number") {
          serviceIdsArray = [location.service_ids.toString()];
        }

        const serviceArray = serviceIdsArray.map((id) => {
          const serviceObj = preferenceList.find(
            (s) => s.id.toString() === id.toString()
          );
          return {
            id: id,
            name: serviceObj ? serviceObj.name : `Service ${id}`,
          };
        });

        setSelectedServices(serviceArray);
      } catch (error) {
        console.error("Error processing service IDs:", error);
        setSelectedServices([]);
      }
    } else {
      setSelectedServices([]);
    }
    if (location?.type === "Travel Time") {
      setLocationData({
        travel_time: location?.travel_time || "",
        travel_by: location?.travel_by || "",
        postcode: location?.postcode || previousPostcode || "",
        coordinates: location?.coordinates || "",
        nation_wide: location?.nation_wide,
      });
      setSelectedTravelLocation(location);
      setIsTravelTimeModalOpen(true);
      setEditLocationId(location.id);
      setPreviousPostcode(location.postcode);
      return;
    }

    if (location?.type === "Draw on Map") {
      try {
        // const data = JSON.parse(location.coordinates);
        const data = location.coordinates;
        setLatitude(data);
      } catch (error) {
        console.error("Error parsing coordinates:", error);
        setLatitude([]);
      }

      setLocationData({
        postcode: location?.postcode,
        city: location?.city,
        nation_wide: location?.nation_wide,
      });
      setIsDrawTimeOpen(true);
      setEditLocationId(location.id);
      setPreviousPostcode(location.postcode);
      return;
    }

    if (location?.type === "Distance") {
      setLocationData({
        miles1: location.miles,
        postcode: location.postcode,
        coordinates: location?.coordinates,
        nation_wide: location?.nation_wide,
      });
      setEditLocationId(location.id);
      setIseditModalOpen(true);
      setPreviousPostcode(location.postcode);
      return;
    }
    if (location?.nation_wide == 0) {
      setLocationData({
        miles1: location.miles,
        postcode: location.postcode,
        coordinates: location?.coordinates,
        nation_wide: location?.nation_wide,
      });
      setEditLocationId(location.id);
      setIseditModalOpen(true);
      setPreviousPostcode(location.postcode);
      return;
    }

    if (location?.type === "Nationwide" && location?.nation_wide == 1) {
      setLocationData({
        miles1: location.miles,
        postcode: location.postcode,
        city: location?.city,
        coordinates: "",
        nation_wide: 1,
      });
      setIsNextModalOpen(true);
      return;
    }
  };

  const handleConfirm = (data) => {
    const serviceIds = data.join(",");

    const typeOfTravel = type.current;
    console.log(locationData.postcode, "jfhfiuhiu");
    const locationdata = {
      user_id: userToken?.remember_tokens,
      miles: locationData.miles1 ? locationData.miles1 : 0,
      postcode:
        locationData.postcode && locationData.postcode.trim() !== ""
          ? locationData.postcode
          : previousPostcode || "000000",

      service_id: serviceIds,
      postcode_old: previousPostcode ? previousPostcode : "000000",

      travel_time: locationData?.travel_time,
      travel_by: locationData?.travel_by,
      type: typeOfTravel,
      miles_old: previousPostcode,
      city: locationData?.city,
      coordinates: locationData?.coordinates ?? "",
      nation_wide: locationData?.nation_wide,
    };

    console.log("locationdata", locationdata);

    dispatch(
      editLocationLead({ ...locationdata, location_id: editLocationId })
    ).then((result) => {
      if (result?.success) {
        const data = { user_id: userToken?.remember_tokens };
        dispatch(getLocationLead(data));
        dispatch(getleadPreferencesList(data));
        setIsNextModalOpen(false);
        setIseditModalOpen(false);
        setIsEditingLocation(false);
        setSelectedOption(false);
        setIsLocationModalOpen(false);
        setEditLocationId(null);
        setLocationData({
          miles1: "20",
          postcode: "",
        });
      }
    });
  };
  const handleRemoveOpen = (id) => {
    setRemoveModal({
      show: true,
      service_id: id?.postcode,
      nation_wide: id?.nation_wide,
      miles: id?.miles,
    });
  };

  const onHandleCancel = () => {
    setRemoveModal({ show: false, service_id: null, nation_wide: null });
  };
  const handleViewMap = (item) => {
    item = { ...item, miles1: item.miles };
    setLocationData(item);
    setIsOpenViewModal(true);
  };

  const handleRemove = () => {
    const removeData = {
      user_id: userToken?.remember_tokens
        ? userToken?.remember_tokens
        : registerData?.remember_tokens,
      postcode: removeModal?.service_id,
      nation_wide: removeModal?.nation_wide,
      miles: removeModal?.miles,
    };

    dispatch(removeItemLocationData(removeData)).then((result) => {
      if (result) {
        showToast(
          "success",
          result?.message || "Remove Location Successfully!"
        );
        setRemoveModal({ show: false, service_id: null });
        const data = {
          user_type: userToken?.remember_tokens
            ? userToken?.remember_tokens
            : registerData?.remember_tokens,
        };
        dispatch(getLocationLead(data));
        dispatch(getleadPreferencesList(data));
      }
    });
  };
  const handleLocaltionModalOpen = () => {
    setIsLocationModalOpen(true);
  };
  const handleBack = () => {
    navigate("/settings");
  };
  return (
    <>
      <div className={styles.container}>
        <div onClick={handleBack} className={styles.arrowBtn}>
          {" "}
          <img src={blackArrow} alt="..." /> Back
        </div>
        <h1 className={styles.heading}>Lead settings</h1>
        <p className={styles.subHeading}>
          Tell us what you’re looking for — we’ll send you the right leads on
          Localists.com.
        </p>

        <div className={styles.section}>
          <h3 className={styles.title}>Your services</h3>
          <p className={styles.info}>
            Customise your lead alerts to receive the most relevant
            opportunities.
          </p>
          {serviceLoader ? (
            <Spin />
          ) : (
            <div className={styles.serviceList}>
              {preferenceList?.map((service) => (
                <div
                  key={service.id}
                  ref={(el) => (serviceRefs.current[service.id] = el)}
                  className={`${styles.serviceItem} ${
                    selectedService?.id === service.id
                      ? styles.selectedService
                      : ""
                  }`}
                  onClick={() =>
                    handleServiceClick(
                      service?.id,
                      service?.name,
                      service?.primaryService
                    )
                  }
                >
                  <div className={styles.serviceNameWrapper}>
                    <p className={styles.serviceName}>{service.name}</p>
                    <p className={styles.serviceDetails}>
                      All leads <span>|</span> {service?.locations} Location
                    </p>
                  </div>
                  <div className={styles.checkprimayBox}>
                    {service?.primaryService === service?.id && (
                      <Tooltip title="Primary Service">
                        <img
                          src={CheckPrimary}
                          alt="Primary Service"
                          width={19}
                          height={19}
                        />
                      </Tooltip>
                    )}
                    <img src={EditIcon} alt="Edit" />
                  </div>
                </div>
              ))}
            </div>
          )}
          <button className={styles.addService} onClick={handleService}>
            + Add a service
          </button>
        </div>

        <div className={styles.section}>
          <h3 className={styles.title}>Your locations</h3>
          <p className={styles.info}>
            Tell us what locations you want new leads from
          </p>

          {getlocationData?.map((item) => (
            <div className={styles.location}>
              <div key={item.id} className={styles.yourLocationInputWrapper}>
                {item?.type === "Distance" ? (
                  <p className={styles.locationInput}>
                    Within <strong>{item.miles} miles</strong> of{" "}
                    <strong>{item.postcode}</strong>
                  </p>
                ) : item?.type === "Draw on Map" ? (
                  <p className={styles.locationInput}>
                    Draws area near <strong>{item.city}</strong>
                  </p>
                ) : item?.type === "Nationwide" && item?.nation_wide !== 0 ? (
                  <p className={styles.locationInput}>Nationwide</p>
                ) : item?.type === "Travel Time" ? (
                  <p className={styles.locationInput}>
                    Within <strong>{item?.travel_time} </strong>{" "}
                    {item?.travel_by} of{" "}
                    <strong>{item.city ? item.city : item?.postcode}</strong>
                  </p>
                ) : (
                  <p className={styles.locationInput}>
                    Within <strong>{item.miles} miles</strong> of{" "}
                    <strong>{item.postcode}</strong>
                  </p>
                )}

                <p className={styles.locationInputService}>
                  <span
                    className={styles.link}
                    onClick={() => handleViewMap(item)}
                  >
                    View on map
                  </span>{" "}
                  |{" "}
                  <span
                    className={styles.link}
                    onClick={() => handleRemoveOpen(item)}
                  >
                    Remove
                  </span>{" "}
                  |{" "}
                  <span className={styles.serviceLink}>
                    {item?.total_services} services
                  </span>
                </p>
              </div>
              <div className={styles.editButton}>
                <img
                  src={EditIcon}
                  alt="Edit"
                  onClick={() => handleEditLocation(item)}
                />
              </div>
            </div>
          ))}

          <button
            className={styles.addLocation}
            onClick={() => handleLocaltionModalOpen()}
          >
            + Add a location
          </button>
        </div>

        <div className={styles.section}>
          <h3 className={styles.title}>Online/remote leads</h3>
          <p className={styles.info}>
            Tell us if you can provide your service remotely or online We tell
            you when a customer is happy to receive your service remotely or
            online.
          </p>
          <div className={styles.toggle}>
            <span>See online/remote leads</span>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={is_online}
                onChange={() => {
                  const newValue = !is_online;
                  setIsOnline(newValue);

                  const isOnlineData = {
                    user_id: registerData?.remember_tokens,
                    is_online: newValue ? 1 : 0,
                  };
                  dispatch(isOnlineRemote(isOnlineData)).then((result) => {
                    if (result?.success) {
                      showToast(
                        "success",
                        result?.message ||
                          "Online/Remote status updated successfully"
                      );
                    }
                  });
                }}
              />
              <span className={styles.slider}></span>
            </label>
          </div>
        </div>
        <div className={styles.toggle}>
          <span>Pause Auto Bid for 7 Days</span>
          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={autobid_pause}
              onChange={() => {
                const newValue = !autobid_pause;

                const isAutoBidPauseData = {
                  user_id: registerData?.remember_tokens
                    ? registerData?.remember_tokens
                    : userToken?.remember_tokens,
                  autobid_pause: newValue ? 1 : 0,
                };
                dispatch(getSevenWeekBidApi(isAutoBidPauseData)).then(
                  (result) => {
                    if (result?.success) {
                      setAutoBid(newValue);
                      showToast(
                        "success",
                        result?.message || "Auto Bid updated successfully"
                      );
                    }
                  }
                );
              }}
            />
            <span className={styles.slider}></span>
          </label>
        </div>

        <a
          href="/sellers/leads"
          style={{ textDecoration: "none" }}
          className={`${styles.viewLeadsLink} ${
            location.pathname === "/sellers/leads" ? styles.active : ""
          }`}
          onClick={(e) => {
            if (
              e.button === 0 &&
              !e.metaKey &&
              !e.ctrlKey &&
              !e.shiftKey &&
              !e.altKey
            ) {
              e.preventDefault();
              handleNavigation("/sellers/leads");
            }
          }}
        >
          View leads
        </a>

        <AddServiceModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          input={input}
          setInput={setInput}
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={setIsDropdownOpen}
          service={service}
          searchServiceLoader={searchServiceLoader}
          handleSelectService={handleSelectService}
          handleSubmitData={handleSubmitData}
          handleRemoveService={handleRemoveService}
          selectedServices={selectedServices}
          popularList={popularList}
        />

        {isEditModalOpen && (
          <LocationModal
            open={isEditModalOpen}
            isEditing={isEditingLocation}
            locationData={locationData}
            onChange={handleLocationChange}
            onClose={() => {
              setIseditModalOpen(false);
              setIsEditingLocation(false);
              setEditLocationId(null);
              setLocationData({ miles1: "", postcode: "" });
            }}
            onNext={handleLocationNext}
          />
        )}

        {isNextModalOpen && (
          <ServiceSelectionModal
            isOpen={isNextModalOpen}
            isEditing={isEdit}
            onClose={() => setIsNextModalOpen(false)}
            onConfirm={handleConfirm}
            selectedServices={selectedServices}
            setSelectedServices={setSelectedServices}
            locationData={locationData}
            setLocationData={setLocationData}
          />
        )}

        <AddLocationModal
          open={isLocationModalOpen}
          isEditing={isEditingLocation}
          onChange={handleLocationChange}
          selectedServices={selectedServices}
          previousPostcode={previousPostcode}
          setSelectedServices={setSelectedServices}
          setIsLocationModalOpen={setIsLocationModalOpen}
          onCancel={() => {
            setIsLocationModalOpen(false);
            setIsEditingLocation(false);
            setEditLocationId(null);
            setLocationData({ miles1: "", postcode: "" });
          }}
          onNext={handleNext}
        />

        {removeModal?.show && (
          <RemoveServiceModal
            open={removeModal?.show}
            onCancel={onHandleCancel}
            onConfirm={handleRemove}
            loading={removeLocationLoader}
            serviceName={"This Location"}
          />
        )}

        {isTravelTimeModalOpen && (
          <TravelTimeModal
            isOpen={isTravelTimeModalOpen}
            onClose={() => setIsTravelTimeModalOpen(false)}
            locationData={locationData}
            setLocationData={setLocationData}
            onNext={handleLocationNext}
            previousPostcodeprops={previousPostcode}
          />
        )}
        {isDrawTimeOpen && (
          <DrawOnMapModal
            isEdit={isEdit}
            locationData={locationData}
            setLocationData={setLocationData}
            onNext={handleLocationNext}
            isOpen={isDrawTimeOpen}
            onClose={() => setIsDrawTimeOpen(false)}
            data={latitude}
          />
        )}
        {isopenviewModal && (
          <ViewOnMapModal
            locationData={locationData}
            setLocationData={setLocationData}
            isOpen={isopenviewModal}
            onClose={() => setIsOpenViewModal(false)}
          />
        )}
      </div>
    </>
  );
};

export default LeadSettings;
