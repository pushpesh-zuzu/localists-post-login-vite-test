import { useEffect, useMemo, useState } from "react";
import styles from "./BidsList.module.css";
import GreenTickIcon from "../../../../../assets/Images/GreenTickIcon.svg";
import AutoBidLocationIcon from "../../../../../assets/Images/AutoBidLocationIcon.svg";
import QuickToRespond from "../../../../../assets/Images/QuickToRespond.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  getAddManualBidData,
  getAddMultipleManualBidData,
  getAutoBid,
  getBuyerSortByLocationApi,
  getBuyerSortByResponseApi,
  getRatingFilterApi,
  ratingFilterApi,
} from "../../../../../store/LeadSetting/leadSettingSlice";
import {
  BASE_IMAGE,
  DEFAULT_PROFILE_IMAGE,
  showToast,
} from "../../../../../utils";
import { Link, useNavigate, useParams } from "react-router-dom";
import CustomModal from "../../../../Leads/LeadLists/ConfirmModal";
import { Helmet } from "react-helmet-async";
import { Modal, Radio, Select, Spin, Tabs } from "antd";

const BidsList = () => {
  localStorage.setItem("isRegistrationComplete", "true");
  const { requestId } = useParams();
  const { autoBidList, bidListLoader, manualBidLoader, ratingFilterData } =
    useSelector((state) => state.leadSetting);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [visibleCount, setVisibleCount] = useState(0);
  const [ratingList, setRatingList] = useState("");
  const [locationSort, setLocationSort] = useState("");
  const [responseSort, setResponseSort] = useState("");
  const [openPopover, setOpenPopover] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [openSortModal, setOpenSortModal] = useState(false);
  const [activeSortType, setActiveSortType] = useState("");
  const [activeTab, setActiveTab] = useState("matches");
  const { userToken } = useSelector((state) => state.auth);
  const [index, setIndex] = useState(0);
  const { registerData } = useSelector((state) => state.findJobs);
  const { Option } = Select;
  const { TabPane } = Tabs;

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth <= 480);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  const loadingTextInfo = [
    "Discovering the best possible matches for you...",
    "Evaluating options with smart precision...",
    "Measuring distances to ensure convenience...",
    "Organizing results for clarity and impact...",
    "Preparing your personalized list of matches...",
  ];

  const ratingOptions = useMemo(() => {
    if (!ratingFilterData || !ratingFilterData[0]) return [];

    return ratingFilterData[0]
      .slice()
      .sort((a, b) => {
        if (a.value === "no_rating") return -1;
        if (b.value === "no_rating") return 1;
        return 0;
      })
      .map((item) => ({
        value: String(item.value),
        label:
          item.value === "no_rating"
            ? "No Rating"
            : item.value < 5
            ? `${item.value} Star & up`
            : `${item.value} Star`,
      }));
  }, [ratingFilterData]);

  const locationOptions = [
    { value: "Farthest to Nearest", label: "Farthest to Nearest" },
    { value: "Nearest to Farthest", label: "Nearest to Farthest" },
  ];

  const responseOptions = [
    { value: "Responds within 10 mins", label: "Responds within 10 mins" },
    { value: "Responds within 1 hour", label: "Responds within 1 hour" },
    { value: "Responds within 6 hours", label: "Responds within 6 hours" },
    { value: "Responds within 24 hours", label: "Responds within 24 hours" },
  ];

  useEffect(() => {
    let interval = null;

    if (bidListLoader) {
      interval = setInterval(() => {
        setIndex((prevIndex) => (prevIndex + 1) % loadingTextInfo.length);
      }, 3000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [bidListLoader]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const repliesListCount = autoBidList?.map((item) => item?.repliesListCount);
  const webdesignData = autoBidList?.map((item) => item?.service_name);
  const matchingLength = autoBidList?.map((item) => item?.sellers?.length);
  const [selectedSellers, setSelectedSellers] = useState([]);

  const bidCount = autoBidList?.[0]?.bidcount || 0;
  const bidTotal = autoBidList?.[0]?.displayCount || 0;
  const isButtonDisabled = bidCount === bidTotal;

  const shouldShowGreenIcons = bidCount !== bidTotal;

  const handleCheckboxChange = (sellerId) => {
    const maxAllowed = parseInt(autoBidList?.[0]?.displayCount || 0);

    if (selectedSellers.includes(sellerId)) {
      setSelectedSellers(selectedSellers.filter((id) => id !== sellerId));
    } else {
      if (selectedSellers.length >= maxAllowed) {
        showToast("error", `You can select only ${maxAllowed} sellers.`);
        return;
      }
      setSelectedSellers([...selectedSellers, sellerId]);
    }
  };

  useEffect(() => {
    const data = {
      user_id: userToken?.remember_tokens,
      lead_id: requestId,
    };

    dispatch(getAutoBid(data));
  }, [dispatch, userToken?.remember_tokens, requestId]);

  useEffect(() => {
    if (autoBidList?.length > 0 && autoBidList[0]?.sellers?.length > 0) {
      const allowedSelections = parseInt(autoBidList[0]?.displayCount || 0);

      const allowedSellers =
        autoBidList[0]?.sellers
          ?.slice(0, allowedSelections)
          ?.map((seller) => seller.id) || [];

      setSelectedSellers(allowedSellers);
    }
  }, [autoBidList]);

  const handleReply = () => {
    navigate(`/bids-list/reply/${requestId}`);
    setActiveTab("replies");
  };

  useEffect(() => {
    const data = {
      user_id: userToken?.remember_tokens
        ? userToken?.remember_tokens
        : registerData?.remember_tokens,
      lead_id: requestId,
    };
    dispatch(getRatingFilterApi(data));
  }, []);
  useEffect(() => {
    const count = parseInt(autoBidList?.[0]?.displayCount || 0);
    setVisibleCount(count);
  }, [autoBidList]);

  const handleSeeMore = () => {
    setVisibleCount(autoBidList?.[0]?.sellers?.length || 0);
  };
  const handleContinue = (seller) => {
    let selectedItem = seller;
    if (!selectedItem) return;
    const formData = new FormData();
    formData.append(
      "user_id",
      userToken?.remember_tokens
        ? userToken?.remember_tokens
        : registerData?.remember_tokens
    );
    formData.append("seller_id", selectedItem?.id);
    formData.append("bid", selectedItem?.credit_score);
    formData.append("lead_id", requestId);
    formData.append("bidtype", "reply");
    formData.append("service_id", selectedItem?.service_id);
    formData.append("distance", selectedItem?.distance);

    dispatch(getAddManualBidData(formData)).then((result) => {
      if (result) {
        showToast("success", result?.message);
        setModalOpen(false);
        const data = {
          user_id: userToken?.remember_tokens,
          lead_id: requestId,
        };
        dispatch(getAutoBid(data));
      }
    });
  };

  const handleMultple = () => {
    const bidList = autoBidList?.[0]?.sellers?.filter((seller) =>
      selectedSellers.includes(seller.id)
    );

    if (!bidList || bidList.length === 0) {
      showToast("error", "No best matches selected");
      return;
    }

    const multipleData = {
      service_id: bidList.map((item) => item?.service_id),
      seller_id: bidList.map((item) => item?.id),
      bid: bidList.map((item) => item?.credit_score),
      distance: bidList.map((item) => item?.distance),
      lead_id: requestId,
      user_id: userToken?.remember_tokens,
    };

    dispatch(getAddMultipleManualBidData(multipleData)).then((result) => {
      if (result) {
        showToast("success", result?.message);
        const data = {
          user_id: userToken?.remember_tokens,
          lead_id: requestId,
        };
        dispatch(getAutoBid(data));
      }
    });
  };
  const handelChangeSort = (e) => {
    const selectedOption = e.target.value;
    setLocationSort(selectedOption);
    const sortData = {
      lead_id: requestId,
      distance_order: selectedOption,
    };
    dispatch(getBuyerSortByLocationApi(sortData));
  };
  const handelresponseChangeSort = (e) => {
    const selectedResponse = e.target.value;
    setResponseSort(selectedResponse);
    const responseData = {
      lead_id: requestId,
      response_time: selectedResponse,
    };
    dispatch(getBuyerSortByResponseApi(responseData));
  };
  const handleSortRating = (e) => {
    const selectedRating = e.target.value;
    setRatingList(selectedRating);
    const ratingData = {
      lead_id: requestId,
      rating: selectedRating,
    };
    dispatch(ratingFilterApi(ratingData));
  };

  return (
    <>
      <Helmet>
        <title>Localists.com - Request Your 5 Top Matches Here Today</title>
        <meta
          name="description"
          content="Request Your 5 Top Matches Here on Localists. Connect with verified local professionals, get free quotes, and hire the right expert for your needs"
        />
      </Helmet>
      <div className={styles.container}>
        {bidListLoader ? (
          <div className={styles.loaderWrapper}>
            <div className={styles.centeredContent}>
              <Spin size="large" />
              <span className={styles.loadingText}>
                {loadingTextInfo[index]}
              </span>
            </div>
          </div>
        ) : (
          <>
            <div className={styles.headerWrapper}>
              <div className={styles.headingTabsWrapper}>
                <h1 className={styles.heading}>
                  {webdesignData && webdesignData?.length > 0
                    ? webdesignData[0]
                    : "No Service"}
                </h1>

                {isMobile ? (
                  <div className={styles.mobileMiddleText}>
                    Your Top 5 local professional matches are below. Request
                    replies from your top matches to hear back faster
                  </div>
                ) : (
                  <div className={styles.middleText}>
                    Your Top 5 local professional matches are below. You can
                    contact any of the <br className={styles.lineBreak} />{" "}
                    professionals to get more information using the contact
                    button.
                  </div>
                )}

                <>
                  {isMobile ? (
                    <Tabs
                      activeKey={activeTab}
                      onChange={(key) => {
                        setActiveTab(key);
                        if (key === "replies") {
                          handleReply();
                        }
                      }}
                      centered
                      tabBarGutter={24}
                      className={styles.mobileTabs}
                    >
                      <TabPane tab="Your Matches" key="matches"></TabPane>
                      <TabPane tab="Replies" key="replies"></TabPane>
                    </Tabs>
                  ) : (
                    <div className={styles.tabs}>
                      <button
                        className={
                          activeTab === "matches"
                            ? styles.activeTab
                            : styles.tab
                        }
                        onClick={() => setActiveTab("matches")}
                      >
                        Your Matches
                      </button>
                      <button
                        className={
                          activeTab === "replies"
                            ? styles.activeTab
                            : styles.tab
                        }
                        onClick={handleReply}
                      >
                        Replies
                      </button>
                    </div>
                  )}
                </>
              </div>
            </div>

            <div className={styles.filters}>
              <div className={styles.matchCountWrapper}>
                <span className={styles.matchCount}>
                  {matchingLength} matches
                </span>
              </div>

              {!isMobile ? (
                <div className={styles.selectsWrapper}>
                  <Select
                    value={ratingList || "All ratings"}
                    onChange={(value) => {
                      setRatingList(value);
                      handleSortRating({ target: { value } });
                    }}
                    className={styles.customSelect}
                    dropdownMatchSelectWidth={false}
                    notFoundContent={
                      !ratingFilterData || ratingFilterData.length === 0
                        ? "Loading..."
                        : null
                    }
                  >
                    <Option value="all">All ratings</Option>
                    {ratingOptions.map((opt) => (
                      <Option key={opt.value} value={opt.value}>
                        {opt.label}
                      </Option>
                    ))}
                  </Select>

                  <Select
                    value={locationSort || "Farthest to Nearest"}
                    onChange={(value) => {
                      setLocationSort(value);
                      handelChangeSort({ target: { value } });
                    }}
                    className={styles.customSelect}
                    popupMatchSelectWidth={false}
                  >
                    {locationOptions.map((opt) => (
                      <Option key={opt.value} value={opt.value}>
                        {opt.label}
                      </Option>
                    ))}
                  </Select>

                  <Select
                    value={responseSort || "Response time"}
                    onChange={(value) => {
                      setResponseSort(value);
                      handelresponseChangeSort({ target: { value } });
                    }}
                    className={styles.customSelect}
                    dropdownMatchSelectWidth={false}
                  >
                    <Option value="">Response time</Option>
                    {responseOptions.map((opt) => (
                      <Option key={opt.value} value={opt.value}>
                        {opt.label}
                      </Option>
                    ))}
                  </Select>
                </div>
              ) : (
                <div className={styles.mobileSortButtons}>
                  <button
                    className={styles.sortBtn}
                    onClick={() => {
                      setActiveSortType("rating");
                      setOpenSortModal(true);
                    }}
                  >
                    {ratingList
                      ? ratingOptions.find((opt) => opt.value === ratingList)
                          ?.label || "All Ratings"
                      : "All Ratings"}
                  </button>
                  <button
                    className={styles.sortBtn}
                    onClick={() => {
                      setActiveSortType("location");
                      setOpenSortModal(true);
                    }}
                  >
                    {locationSort || "Sort by Distance"}
                  </button>
                  <button
                    className={styles.sortBtn}
                    onClick={() => {
                      setActiveSortType("response");
                      setOpenSortModal(true);
                    }}
                  >
                    {responseSort || "Response Time"}
                  </button>
                </div>
              )}
            </div>

            <Modal
              open={openSortModal}
              onCancel={() => setOpenSortModal(false)}
              footer={null}
              closable={false}
              className={styles.bottomModal}
            >
              <div className={styles.modalHeader}>
                <h3>
                  {activeSortType === "rating"
                    ? "Sort by Ratings"
                    : activeSortType === "location"
                    ? "Sort by Distance"
                    : "Sort by Response Time"}
                </h3>
              </div>
              <Radio.Group
                onChange={(e) => {
                  const value = e.target.value;

                  if (activeSortType === "rating") {
                    setRatingList(value);
                    handleSortRating({ target: { value } });
                  } else if (activeSortType === "location") {
                    setLocationSort(value);
                    handelChangeSort({ target: { value } });
                  } else if (activeSortType === "response") {
                    setResponseSort(value);
                    handelresponseChangeSort({ target: { value } });
                  }

                  setOpenSortModal(false);
                }}
                value={
                  activeSortType === "rating"
                    ? ratingList
                    : activeSortType === "location"
                    ? locationSort
                    : responseSort
                }
                className={styles.radioGroup}
              >
                {(activeSortType === "rating"
                  ? ratingOptions
                  : activeSortType === "location"
                  ? locationOptions
                  : responseOptions
                ).map((opt) => (
                  <Radio
                    key={opt.value}
                    value={opt.value}
                    className={styles.radioItem}
                  >
                    {opt.label}
                  </Radio>
                ))}
              </Radio.Group>
            </Modal>

            <div className={styles.recommendBar}>
              <div className={styles.recommendBox}>
                <div>
                  <span>Recommended:</span> Request replies from your{" "}
                  <strong>top matches</strong> to hear back faster
                </div>
                {matchingLength > 0 && (
                  <button
                    className={styles.requestBtn}
                    onClick={handleMultple}
                    disabled={isButtonDisabled}
                  >
                    Request your best matches here
                  </button>
                )}
              </div>
            </div>
            <div className={styles.requestMatchBox}>
              {matchingLength > 0 && (
                <button
                  className={styles.requestBtnMatchBox}
                  onClick={handleMultple}
                  disabled={isButtonDisabled}
                >
                  Request Your 5 Top Matches Here
                </button>
              )}
            </div>
            {/* {bidListLoader ? <Spin size="small"/> :  <> */}
            {autoBidList?.every((item) => item?.sellers?.length === 0) ? (
              <div className={styles.noBidWrapper}>
                <h1 className={styles.noBidText}>
                  {repliesListCount > 0
                    ? "Your Matches Can Be Viewed in Request Replies"
                    : "Local services professionals are preparing to contact you now. Keep an eye out for any communications"}
                </h1>
              </div>
            ) : (
              autoBidList?.map((item) =>
                item?.sellers?.slice(0, visibleCount)?.map((seller, index) => (
                  <div className={styles.card} key={seller?.id}>
                    <div className={styles.cardLeft}>
                      <div className={styles.imageWrapper}>
                        {seller?.company_logo ? (
                          <img
                            src={`${BASE_IMAGE}/users/${seller?.company_logo}`}
                            alt="Profile"
                            className={styles.image}
                            style={{
                              width: "180px",
                              height: "180px",
                              objectFit: "cover",
                              borderRadius: "50%",
                            }}
                          />
                        ) : (
                          <span
                            style={{
                              width: "180px",
                              height: "180px",
                              borderRadius: "50%",
                              backgroundColor: "#ccc",
                              color: "#000",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              fontSize: "48px",
                              fontWeight: "500",
                              textTransform: "uppercase",
                              overflow: "hidden",
                              verticalAlign: "center",
                            }}
                            className={styles.firstLetterSpan}
                          >
                            {seller?.business_profile_name?.[0]?.toUpperCase()}
                          </span>
                        )}
                      </div>

                      <div className={styles.details}>
                        <div className={styles.header}>
                          <div>
                            <h3>
                              {shouldShowGreenIcons && index < bidTotal && (
                                <img src={GreenTickIcon} alt="" />
                              )}
                              {seller?.business_profile_name}
                            </h3>
                            <p>
                              <img src={AutoBidLocationIcon} alt="" />
                              {seller?.distance ? seller?.distance : "0"} miles
                              away
                            </p>
                          </div>

                          <div className={styles.sidebar}>
                            <div className={styles.rating}>
                              {(() => {
                                const rating = seller?.avg_rating || 0;

                                const sellerId = item?.id;
                                const matchedSeller = item?.sellers?.find(
                                  (seller) => seller?.id === sellerId
                                );

                                return (
                                  <>
                                    <span className={styles.stars}>
                                      {[...Array(5)].map((_, index) => {
                                        if (rating >= index + 1) {
                                          return <span key={index}>★</span>;
                                        } else if (rating >= index + 0.5) {
                                          return <span key={index}>★</span>;
                                        } else {
                                          return (
                                            <span
                                              key={index}
                                              className={styles.grayImg}
                                            >
                                              ★
                                            </span>
                                          );
                                        }
                                      })}
                                    </span>
                                    {rating > 0 && (
                                      <span className={styles.ratingCount}>
                                        {rating}
                                      </span>
                                    )}
                                  </>
                                );
                              })()}
                            </div>
                          </div>
                        </div>
                        <div className={styles.mobileImageWrapper}>
                          <div className={styles.imageWrapper}>
                            {seller?.company_logo ? (
                              <img
                                src={
                                  seller?.company_logo
                                    ? `${BASE_IMAGE}/users/${seller?.company_logo}`
                                    : DEFAULT_PROFILE_IMAGE
                                }
                                alt="Profile"
                                className={styles.images}
                              />
                            ) : (
                              <span
                                style={{
                                  width: "100px",
                                  height: "100px",
                                  borderRadius: "50%",
                                  backgroundColor: "#ccc",
                                  color: "#000",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  fontSize: "36px",
                                  fontWeight: "500",
                                  textTransform: "uppercase",
                                  overflow: "hidden",
                                  verticalAlign: "center",
                                }}
                              >
                                {seller?.business_profile_name?.[0]?.toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div className={styles.mobileHeader}>
                            <h3>
                              {shouldShowGreenIcons && index < bidTotal && (
                                <img src={GreenTickIcon} alt="" />
                              )}
                              {seller?.business_profile_name}
                            </h3>
                            <p>
                              <img src={AutoBidLocationIcon} alt="" />
                              {seller?.distance ? seller?.distance : "0"} miles
                              away
                            </p>
                          </div>
                        </div>
                        <div>
                          <div className={styles.sidebar}>
                            <div className={styles.badge}>
                              <span>{seller?.service_name}</span>
                            </div>
                            <div className={styles.ratings}>
                              {(() => {
                                const rating = seller?.avg_rating || 0;

                                return (
                                  <>
                                    <span className={styles.stars}>
                                      {[...Array(5)].map((_, index) => {
                                        if (rating >= index + 1) {
                                          return <span key={index}>★</span>;
                                        } else if (rating >= index + 0.5) {
                                          return <span key={index}>★</span>;
                                        } else {
                                          return (
                                            <span
                                              key={index}
                                              className={styles.grayImg}
                                            >
                                              ★
                                            </span>
                                          );
                                        }
                                      })}
                                    </span>
                                    {rating > 0 && (
                                      <span className={styles.ratingCount}>
                                        {rating}
                                      </span>
                                    )}
                                  </>
                                );
                              })()}
                            </div>
                          </div>
                        </div>
                        <div className={styles.badges}>
                          <span>{seller?.service_name}</span>
                        </div>

                        {seller?.about_company && (
                          <p className={styles.description}>
                            {seller.about_company.length > 80
                              ? seller.about_company.slice(0, 80) + "..."
                              : seller.about_company}
                          </p>
                        )}

                        <div className={styles.quickToRespondWrapper}>
                          <Link
                            to={`/view-profile/${requestId}/${seller.id}`}
                            className={styles.profileLink}
                            onClick={() => hanleViewProfile(seller)}
                          >
                            View Profile →
                          </Link>

                          {seller?.quicktorespond == 1 && (
                            <div className={styles.quickToRespond}>
                              <img src={QuickToRespond} alt="" />
                              Quick to respond
                            </div>
                          )}
                        </div>
                      </div>

                      <div className={styles.replyBtnWrapper}>
                        <div className={styles.replyCheckbox}>
                          <input
                            type="checkbox"
                            checked={selectedSellers.includes(seller.id)}
                            onChange={() => handleCheckboxChange(seller.id)}
                            className={styles.checkbox}
                            disabled={
                              !selectedSellers.includes(seller.id) &&
                              selectedSellers.length >=
                                parseInt(autoBidList?.[0]?.displayCount || 0)
                            }
                          />
                        </div>
                        <button
                          className={styles.replyBtn}
                          onClick={() => {
                            setSelectedItem(seller);
                            handleContinue(seller);
                          }}
                        >
                          Contact the Professional Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )
            )}

            <CustomModal
              isOpen={isModalOpen}
              onClose={() => setModalOpen(false)}
              onContinue={handleContinue}
              message="Are you sure you want to continue?"
              loading={manualBidLoader}
            />
          </>
        )}

        {autoBidList?.[0]?.sellers?.length > visibleCount && (
          <div className={styles.moreProfessionalBtnBox}>
            <button
              className={styles.moreProfessionalBtn}
              onClick={handleSeeMore}
            >
              See More Professionals
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default BidsList;
