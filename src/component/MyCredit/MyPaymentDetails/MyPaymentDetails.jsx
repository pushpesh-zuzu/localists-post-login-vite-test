import { useEffect, useState } from "react";
import iIcon from "../../../assets/Images/Setting/paymentCard.svg";
import styles from "./MyPaymentDetails.module.css";
import AddCardModal from "./AddCardModal";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getSellerCardApi,
  removeCardDetailsApi,
  makePrimaryApi,
} from "../../../store/MyProfile/MyCredit/MyCreditSlice";
import blackArrow from "../../../assets/Images/Leads/blackArrowRight.svg";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { showToast } from "../../../utils";

const MyPaymentDetails = () => {
  const [showModal, setShowModal] = useState(false);
  const [primaryId, setPrimaryId] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { getSellerCardData } = useSelector((state) => state.myCredit);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // if (getSellerCardData?.length) {
    dispatch(getSellerCardApi());
    // }
  }, []);

  const handleOpen = () => {
    setShowModal(true);
  };

  const handleRemoveCard = async (data) => {
    try {
      setLoading(true);
      const result = await dispatch(
        removeCardDetailsApi({ card_id: data?.id })
      );

      if (result) {
        await dispatch(getSellerCardApi());
        showToast("success", "Card removed successfully!");
      }
    } catch (error) {
      console.error("Error removing card:", error);
      showToast("error", "Failed to remove card. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrimaryChange = async (data) => {
    try {
      setLoading(true);
      const result = await dispatch(
        makePrimaryApi({ card_id: data?.id, user_id: data?.user_id })
      );
      if (result) {
        await dispatch(getSellerCardApi());
        showToast("success", "Primary card updated successfully!");
      }
    } catch (err) {
      console.error("Error removing card:", error);
      showToast("error", "Failed to update primary card. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleBack = () => {
    navigate("/settings");
  };
  return (
    <>
      {loading && (
        <div className={styles.loaderOverlay}>
          <Spin
            indicator={
              <LoadingOutlined style={{ color: "white", fontSize: 36 }} spin />
            }
            size="large"
            tip="Processing..."
          />
        </div>
      )}
      <div className={styles.container}>
        <div className={styles.backText} onClick={handleBack}>
          <img src={blackArrow} alt="..." /> Settings
        </div>
        {/* <h1 className={styles.heading}>My Saved Card</h1> */}
        <div className={styles.headingRow}>
          <h1 className={styles.heading}>My Saved Card</h1>

          {getSellerCardData?.length > 0 && (
            <button className={styles.addCardBtnRight} onClick={handleOpen}>
              + Add New Card
            </button>
          )}
        </div>
        <div className={styles.manageWrapper}>
          <span className={styles.infoIcon}>
            <img src={iIcon} alt="iIcon" />
          </span>
          <p className={styles.description}>Please add a card to continue</p>
        </div>
        <div className={styles.addCardText}>
          Adding a card now ensures you’re ready to respond to leads the moment
          they come in — no delays, no missed opportunities
        </div>

        {/* <>
          {getSellerCardData &&
            getSellerCardData.length > 0 &&
            getSellerCardData.map((item, index) => (
              <div key={index} className={styles.cardWrapper}>
                <div className={styles.card}>
                  <div className={styles.cardTop}>
                    <span className={styles.cardBrand}>VISA</span>
                    <span
                      className={styles.cardChange}
                      onClick={() => {
                        handleRemoveCard(item);
                      }}
                    >
                      Remove
                    </span>
                    {item.is_primary == 1 && <span>Primary</span>}
                    {item.is_primary == 0 && (
                      <>
                        <span className={styles.separator}>|</span>
                        <span
                          onClick={() => {
                            setPrimaryId(index);
                            handlePrimaryChange(item);
                          }}
                          className={styles.rightText}
                        >
                          Make Primary
                        </span>
                      </>
                    )}
                  </div>
                  <div
                    className={styles.cardNumber}
                  >{`•••• •••• •••• ${item?.card_number}`}</div>
                  <div className={styles.cardExpiry}>{item.expiry_date}</div>
                </div>
              </div>
            ))}
        </> */}

        <div className={styles.cardGrid}>
          {getSellerCardData &&
            getSellerCardData.length > 0 &&
            [...getSellerCardData]
              .sort((a, b) => b.is_primary - a.is_primary)
              .map((item, index) => {
                let brandName =
                  item?.brand?.charAt(0).toUpperCase() +
                    item?.brand?.slice(1).toLowerCase() || "";

                return (
                  <div key={index} className={styles.cardWrapper}>
                    {/* ---- Card ---- */}
                    <div className={styles.card}>
                      <div className={styles.cardTop}>
                        <span className={styles.cardBrand}>{brandName}</span>
                        {item.is_primary == 1 && (
                          <span className={styles.primaryBadge}>Primary</span>
                        )}
                      </div>

                      <div className={styles.cardNumber}>
                        {`•••• •••• •••• ${item?.card_number}`}
                      </div>
                      <div className={styles.cardExpiry}>
                        {item.expiry_date}
                      </div>
                    </div>

                    {/* ---- Buttons below card ---- */}
                    {/* <div className={styles.cardActions}>
                    {item.is_primary == 0 && (
                      <button
                        onClick={() => {
                          setPrimaryId(index);
                          handlePrimaryChange(item);
                        }}
                        className={styles.primaryBtn}
                      >
                        Make Primary
                      </button>
                    )}
                    <button
                      onClick={() => handleRemoveCard(item)}
                      className={styles.removeBtn}
                    >
                      Remove
                    </button>
                  </div> */}
                    {/* ---- Buttons below card ---- */}
                    <div className={styles.cardActions}>
                      {item.is_primary == 0 ? (
                        <>
                          <span
                            onClick={() => {
                              setPrimaryId(index);
                              handlePrimaryChange(item);
                            }}
                            className={styles.linkText}
                          >
                            Make Primary
                          </span>
                          <span className={styles.separator}></span>
                          <span
                            onClick={() => handleRemoveCard(item)}
                            className={`${styles.linkText} ${styles.removeLink}`}
                          >
                            Remove
                          </span>
                        </>
                      ) : (
                        <span
                          onClick={() => handleRemoveCard(item)}
                          className={`${styles.linkText} ${styles.removeLink}`}
                        >
                          Remove
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
        </div>

        {getSellerCardData?.length === 0 && (
          <div className={styles.btnBox}>
            <button className={styles.addCardBtn} onClick={handleOpen}>
              Click here to add a card
            </button>
          </div>
        )}
      </div>

      {showModal && <AddCardModal onClose={() => setShowModal(false)} />}
    </>
  );
};
export default MyPaymentDetails;
