import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import searchIcon from "../../../assets/Icons/MyResponse/searchIcon.svg";
import styles from "./navbar.module.css";
import { useDispatch, useSelector } from "react-redux";
import { searchService } from "../../../store/FindJobs/findJobSlice";
import { Popover } from "antd";
import {
  getNotificationList,
  markNotificationsAsRead,
} from "../../../store/Seller/notificationService";
import bellIcon from "../../../assets/Icons/bell.svg";
import { userLogout } from "../../../store/Auth/authSlice";
import { showToast } from "../../../utils";
import downarrowIcon from "../../../assets/Icons/downArrowIcon.svg";
import MobileSlideInSearch from "./MobileSlideInSearch";
import { setIsDirtyRedux } from "../../../store/MyProfile/myProfileSlice";
import { serviceRouteMap } from "../../../utils/allServicesRoute";
import { resetProgress } from "../../../store/Buyer/BuyerSlice";
import { getBarkUserData, setCookie } from "../../../utils/getCookies";

const LogSwitch = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { lang, country } = useParams();
  const currentLang = lang || "en";
  const currentCountry = country || "gb";
  const wrapperRef = useRef(null);
  const { serviceTitle } = useParams();
  const [dataSave, setDataSave] = useState();
  const [searchText, setSearchText] = useState("");
  const [debouncedText, setDebouncedText] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const { isDirtyRedux } = useSelector((state) => state.myProfile);
  const { userToken } = useSelector((state) => state.auth);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [mobileSearchText, setMobileSearchText] = useState("");
  const [canOpenModal, setCanOpenModal] = useState(false);

  const { selectedServiceId, registerToken, registerData } = useSelector(
    (state) => state.findJobs
  );
  const { service } = useSelector((state) => state.findJobs);

  const { viewProfileData, reviewProfileData } = useSelector(
    (state) => state.leadSetting
  );
  const [selectedServiceIds, setSelectedServiceIds] = useState(null);
  const [show, setShow] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const profileId = useParams();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const menuRef = useRef(null);

  const confirmNavigation = (callback) => {
    if (isDirtyRedux) {
      const confirmLeave = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?"
      );
      if (!confirmLeave) return false;
      dispatch(setIsDirtyRedux(false));
    }
    callback();
    return true;
  };
  useEffect(() => {
    setDataSave(getBarkUserData()?.active_status);
  }, [getBarkUserData()]);
  useEffect(() => {
    let email = viewProfileData?.email || reviewProfileData?.email;

    let registerDataToken = null;
    const storedRegisterData = localStorage.getItem("registerDataToken");
    const storedBarkData = localStorage.getItem("barkUserToken");

    if (storedRegisterData) {
      registerDataToken = JSON.parse(storedRegisterData);
    } else if (storedBarkData) {
      registerDataToken = JSON.parse(storedBarkData);
    }
    if (!registerDataToken || registerDataToken == null) {
      setCanOpenModal(true);
    } else if (
      registerDataToken &&
      registerDataToken?.email &&
      registerDataToken.email !== email
    ) {
      setCanOpenModal(true);
    } else {
      setCanOpenModal(false);
    }
  }, [viewProfileData?.email, reviewProfileData?.email]);
  useEffect(() => {
    const payload = {
      user_id: getBarkUserData()?.id || registerData?.id || "",
    };
    if (payload.user_id) {
      dispatch(getNotificationList(payload));

      const intervalId = setInterval(() => {
        dispatch(getNotificationList(payload));
      }, 30000);

      return () => clearInterval(intervalId);
    }
  }, [dispatch, getBarkUserData(), registerData]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }

      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    const handleScroll = () => {
      setMenuOpen(false);
      setShowDropdown(false);
      setUserDropdownOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setShowDropdown(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const handleNavigation = (path) => {
    confirmNavigation(() => {
      navigate(path);
      setMenuOpen(false);
    });
  };
  const handleNavigate = () => {
    navigate("/sellers/leads/save-for-later");
  };
  const content = (
    <div className={styles.saveForLater}>
      <p onClick={handleNavigate}>Save For Later</p>
    </div>
  );

  const getUserType = () => {
    if (getBarkUserData()?.remember_tokens) {
      return getBarkUserData()?.active_status;
    } else {
      return registerData?.active_status;
    }
  };

  const handleMyRequest = () => {
    navigate("/buyers/create");
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    setShowDropdown(true);
  };
  const handleServiceSelect = (item) => {
    setSelectedServiceIds(item);
    setShow(true);
    setSearchText(item.name);
    setSearchText("");
    const matchedRoute = serviceRouteMap[item.id];
    if (matchedRoute) {
      navigate(`/${currentLang}/${currentCountry}${matchedRoute}`); // go to the route
    } else {
      setShow(true);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setDebouncedText(searchText);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchText]);

  useEffect(() => {
    const isUserLoggedIn =
      getBarkUserData()?.remember_tokens || registerData?.remember_tokens;

    if (!getBarkUserData()?.remember_tokens && !registerData?.remember_tokens) {
      if (debouncedText.trim() !== "") {
        dispatch(searchService({ search: debouncedText }));
      } else {
        dispatch(searchService({ search: "" }));
      }
    }
  }, [debouncedText, dispatch, getBarkUserData(), registerData]);

  const handleLogout = async () => {
    confirmNavigation(async () => {
      try {
        const result = await dispatch(userLogout());
        if (result) {
          showToast("info", "Logout successful!");
          // handleNavigation("/en/gb/login");
          const baseURL = import.meta.env.VITE_COOKIE_DOMAIN;
          window.location.href = `${baseURL}en/gb/login`;
          localStorage.removeItem("pendingBuyerModal");
          setCookie('logout',true)
          dispatch(resetProgress());
        }
      } catch (error) {
        console.error("Logout Error:", error);
      }
    });
  };
console.log(registerToken,'registerToken')
  const notifications = useSelector(
    (state) => state.notification.notificationList
  );
  const unreadCount = notifications?.filter(
    (n) => n.status === "unread"
  ).length;
  const lastId = useSelector((state) => state.notification.lastId);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const viewProfile = location.pathname === `/review/${profileId?.profileId}`;

  const userName = getBarkUserData()?.name || registerData?.name || "";

  const showHamburgerIcon =
    getBarkUserData()?.remember_tokens || registerData?.remember_tokens;

  const handleVisibleChange = (visible) => {
    setPopoverVisible(visible);
  };
  return (
    <>
      <div className={styles.logSwitchContainer}>
        {showHamburgerIcon ? (
          <div
            className={styles.hamburger}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div></div>
            <div></div>
            <div></div>
          </div>
        ) : (
          <div style={{ marginTop: "4px" }} className={styles.inputWrapper}>
            <div
              className={`${styles.mobileOnly}`}
              style={{ cursor: "pointer !important !important" }}
            >
              <img
                src={searchIcon}
                onClick={() => setShowMobileSearch((prev) => !prev)}
                alt="Search"
                className={styles.icon}
                width={18}
                height={18}
              />
            </div>
            <div
              className={`${styles.inputWrapper} ${styles.desktopOnly}`}
              style={{ position: "relative" }}
              ref={wrapperRef}
            >
              <img
                src={searchIcon}
                alt="Search"
                width={18}
                height={18}
                className={`${styles.icon} ${
                  inputFocused ? styles.iconFocused : styles.iconFocusedNo
                }`}
              />
              <input
                type="text"
                placeholder="Search for a service"
                onChange={handleSearch}
                className={styles.input}
                style={
                  showDropdown && service?.length > 0
                    ? {
                        borderTopLeftRadius: "0.5rem",
                        borderTopRightRadius: "0.5rem",
                        borderBottomLeftRadius: "0",
                        borderBottomRightRadius: "0",
                      }
                    : {
                        borderRadius: "0.5rem",
                      }
                }
                onFocus={() => setInputFocused(true)}
                onBlur={() => {
                  setInputFocused(false);
                  setTimeout(() => {
                    setShowDropdown(false);
                  }, 500);
                }}
                value={searchText}
              />
            </div>

            {showDropdown && service?.length > 0 && (
              <div
                style={{ position: "absolute", top: "18px" }}
                className={styles.dropdown}
              >
                {service?.map((item, index) => (
                  <div
                    key={index}
                    className={styles.dropdownItem}
                    onClick={() => handleServiceSelect(item)}
                    onMouseDown={() => handleServiceSelect(item)}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div
          className={`${styles.navMenu} ${menuOpen ? styles.activeMenu : ""}`}
        >
          {getUserType() == 1 && !viewProfile && (
            <>
              <Link
                to="/sellers/dashboard"
                className={`${styles.navItem} ${
                  location.pathname === "/sellers/dashboard"
                    ? styles.active
                    : ""
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation("/sellers/dashboard");
                }}
              >
                Dashboard
              </Link>

              <Link
                to="/sellers/leads"
                style={{ textDecoration: "none" }}
                className={`${styles.navItem} ${
                  location.pathname === "/sellers/leads" ? styles.active : ""
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation("/sellers/leads");
                }}
              >
                New Leads
              </Link>

              <Link
                to="/sellers/leads/save-for-later"
                style={{ textDecoration: "none" }}
                className={`${styles.navItem} ${
                  location.pathname === "/sellers/leads/save-for-later"
                    ? styles.active
                    : ""
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation("/sellers/leads/save-for-later");
                }}
              >
                Saved Leads
              </Link>

              <Link
                to="/sellers/leads/my-responses"
                style={{ textDecoration: "none" }}
                className={`${styles.navItem} ${
                  location.pathname === "/sellers/leads/my-responses"
                    ? styles.active
                    : ""
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation("/sellers/leads/my-responses");
                }}
              >
                My Responses
              </Link>

              <Link
                to="/settings"
                style={{ textDecoration: "none" }}
                className={`${styles.navItem} ${
                  location.pathname === "/settings" ? styles.active : ""
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation("/settings");
                }}
              >
                Settings
              </Link>

              <Link
                to={`/${currentLang}/${currentCountry}/contact-us`}
                style={{ textDecoration: "none" }}
                className={`${styles.navItem} ${
                  location.pathname ===
                  `/${currentLang}/${currentCountry}/contact-us`
                    ? styles.active
                    : ""
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation(
                    `/${currentLang}/${currentCountry}/contact-us`
                  );
                }}
              >
                Help
              </Link>
            </>
          )}

          {(getUserType() == 2 || viewProfile) && canOpenModal && (
            <>
              <div className={styles.requestBox}>
                <div className={styles.myrequestText} onClick={handleMyRequest}>
                  My Request
                </div>
              </div>
            </>
          )}
        </div>
        {getUserType() == 1 && !viewProfile && (
          <Popover
            trigger="click"
            placement={
              typeof window !== "undefined" && window.innerWidth > 540
                ? "bottomRight"
                : "top"
            }
            visible={popoverVisible}
            onVisibleChange={handleVisibleChange}
            overlayStyle={{
              maxHeight: "60vh",
              overflowY: "auto",
              width: "360px",
              paddingLeft: "10px",
              paddingRight: "10px",
            }}
            content={
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  maxHeight: "50vh",
                  overflow: "hidden",
                  width: "320px",
                }}
              >
                <div
                  style={{
                    flex: "1",
                    overflowY: "auto",
                    padding: "10px",
                  }}
                >
                  {notifications.length > 0 ? (
                    notifications
                      .slice()
                      .sort(
                        (a, b) =>
                          new Date(b.created_at) - new Date(a.created_at)
                      )
                      .map((noti, index) => (
                        <div key={noti.id}>
                          <div style={{ marginBottom: "8px" }}>
                            <div
                              style={{ fontWeight: "600", fontSize: "14px" }}
                            >
                              {noti.title}
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: "12px",
                                marginTop: "4px",
                                fontSize: "11px",
                              }}
                            >
                              <span>{noti.message}</span>
                              <span>
                                {new Date(noti.created_at).toLocaleString(
                                  "en-GB",
                                  {
                                    timeZone: "Europe/London",
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false,
                                  }
                                )}
                              </span>
                            </div>
                          </div>
                          {index !== notifications.length - 1 && (
                            <hr
                              style={{
                                borderTop: "1px solid #eee",
                                margin: "8px 0",
                              }}
                            />
                          )}
                        </div>
                      ))
                  ) : (
                    <div style={{ fontSize: "12px", color: "#999" }}>
                      No new notifications
                    </div>
                  )}
                </div>

                {notifications.length > 0 && (
                  <div
                    style={{
                      padding: "10px",
                      borderTop: "1px solid #eee",
                      textAlign: "right",
                      backgroundColor: "#fff",
                      position: "sticky",
                      bottom: "0",
                    }}
                  >
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (unreadCount > 0) {
                          const payload = {
                            user_id: getBarkUserData()?.id || registerData?.id,
                            last_id: lastId,
                          };
                          dispatch(markNotificationsAsRead(payload));
                        }

                        setPopoverVisible(false);
                      }}
                      style={{ fontSize: "12px", color: "#1890ff" }}
                    >
                      Mark all as read
                    </a>
                  </div>
                )}
              </div>
            }
          >
            <div
              style={{
                position: "relative",
                cursor: "pointer !important",
                marginRight: "8px",
              }}
            >
              <img src={bellIcon} alt="Notifications" width={20} height={20} />
              {unreadCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-4px",
                    right: "-4px",
                    backgroundColor: "red",
                    color: "white",
                    borderRadius: "50%",
                    width: "16px",
                    height: "16px",
                    fontSize: "10px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </div>
          </Popover>
        )}

        {registerToken || getBarkUserData() ? (
          <Popover
            content={
              <>
                {getUserType() == 2 && (
                  <div className={styles.logoutBtn}>
                    <a
                      href="/user/notification"
                      style={{ textDecoration: "none", color: "#000" }}
                      className={`${
                        location.pathname === "/user/notification"
                          ? styles.active
                          : ""
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
                          handleNavigation("/user/notification");
                        }
                      }}
                    >
                      Notification
                    </a>
                  </div>
                )}

                {getUserType() == 2 && (
                  <div className={styles.logoutBtn}>
                    <a
                      href="/user/settings"
                      style={{ textDecoration: "none", color: "#000" }}
                      className={`${
                        location.pathname === "/user/settings"
                          ? styles.active
                          : ""
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
                          handleNavigation("/user/settings");
                        }
                      }}
                    >
                      Account Settings
                    </a>
                  </div>
                )}

                <div className={styles.logoutBtn} onClick={handleLogout}>
                  Logout
                </div>
              </>
            }
            trigger="click"
            open={userDropdownOpen}
            onVisibleChange={setUserDropdownOpen}
          >
            <div>
              <div
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className={styles.loginBtn}
              >
                {userName} <img src={downarrowIcon} alt="icon" />
              </div>
            </div>
          </Popover>
        ) : (
         ''
        )}
      </div>

      {showMobileSearch && (
        <MobileSlideInSearch
          isOpen={showMobileSearch}
          setIsOpen={setShowMobileSearch}
          services={service}
          handleServiceSelect={handleServiceSelect}
          dispatch={dispatch}
          searchService={searchService}
          mobileSearchText={mobileSearchText}
          setMobileSearchText={setMobileSearchText}
        />
      )}
    </>
  );
};

export default LogSwitch;
