import { useEffect, useState } from "react";
import styles from "./CreditCard.module.css";
import visaImg from "../../../assets/Images/Setting/Visa.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  getSellerCardApi,
  removeCardDetailsApi,
  makePrimaryApi,
} from "../../../store/MyProfile/MyCredit/MyCreditSlice";
import AddCardModal from "../MyPaymentDetails/AddCardModal";

import { LoadingOutlined } from "@ant-design/icons";
import { Flex, Spin } from "antd";
import { showToast } from "../../../utils";

const CreditCard = () => {
  const [isopen, setIsOpen] = useState(false);
  const [primaryId, setPrimaryId] = useState(0);
  const dispatch = useDispatch();
  const { getSellerCardData, creditCardLoader } = useSelector(
    (state) => state.myCredit
  );

  useEffect(() => {
    dispatch(getSellerCardApi());
  }, []);

  const handleAddCard = () => {
    setIsOpen(true);
  };

  const handleChangeModal = () => {
    setIsOpen(true);
  };

  const handleRemoveCard = async (data) => {
    try {
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
    }
  };

  const handlePrimaryChange = async (data) => {
    try {
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
    }
  };

  return (
    <>
      {creditCardLoader && (
        <div className={styles.loaderOverlay}>
          <Spin
            indicator={<LoadingOutlined spin />}
            size="large"
            tip="Loading..."
          />
        </div>
      )}

      <div
        className={
          !getSellerCardData || getSellerCardData.length < 1
            ? styles.parent_container
            : styles.container_wrapper
        }
      >
        {getSellerCardData && getSellerCardData.length > 0 ? (
          <>
            {/* {getSellerCardData.map((item, index) => (
              <div className={styles.container} key={index}>
                <div className={styles.visaCard_wrapper}>
                  <div className={styles.visaCard}>
                    <div className={styles.card_brand}>
                      <span>
                        {item?.brand?.charAt(0).toUpperCase() +
                          item?.brand?.slice(1).toLowerCase() || ""}
                      </span>
                    </div>
                    <div className={styles.separator}></div>
                    <div>
                      We'll charge the card ending *
                      {String(item.card_number)?.slice(-4)} that we have on file{" "}
                      {item.is_primary == 1 && (
                        <span
                          style={{ textDecoration: "none", color: "#00AFE3" }}
                          className={styles.primary_text}
                        >
                          (Primary)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={styles.remove_actionButtons}>
                    {item.is_primary == 0 && (
                      <>
                        <span
                          onClick={() => {
                            setPrimaryId(index);
                            handlePrimaryChange(item);
                          }}
                          className={styles.primary_text}
                          style={{
                            color: "black",
                          }}
                        >
                          Make Primary
                        </span>
                        <span className={styles.separator}></span>
                      </>
                    )}

                    <span
                      onClick={() => handleRemoveCard(item)}
                      className={styles.primary_text}
                      style={{
                        color: "black",

                        marginLeft: "auto",
                      }}
                    >
                      Remove
                    </span>
                  </div>
                </div>
              </div>
            ))} */}
            {getSellerCardData &&
              getSellerCardData
                .slice()
                .sort((a, b) => b.is_primary - a.is_primary)
                .map((item, index) => (
                  <div className={styles.container} key={index}>
                    <div className={styles.visaCard_wrapper}>
                      <div className={styles.visaCard}>
                        <div className={styles.card_brand}>
                          <span>
                            {item?.brand?.charAt(0).toUpperCase() +
                              item?.brand?.slice(1).toLowerCase() || ""}
                          </span>
                        </div>
                        <div className={styles.separator}></div>
                        <div>
                          We'll charge the card ending *
                          {String(item.card_number)?.slice(-4)} that we have on
                          file{" "}
                          {item.is_primary == 1 && (
                            <span
                              style={{
                                textDecoration: "none",
                                color: "#00AFE3",
                              }}
                              className={styles.primary_text}
                            >
                              (Primary)
                            </span>
                          )}
                        </div>
                      </div>

                      <div className={styles.remove_actionButtons}>
                        {item.is_primary == 0 && (
                          <>
                            <span
                              onClick={() => {
                                setPrimaryId(index);
                                handlePrimaryChange(item);
                              }}
                              className={styles.primary_text}
                              style={{ color: "black" }}
                            >
                              Make Primary
                            </span>
                            <span className={styles.separator}></span>
                          </>
                        )}

                        <span
                          onClick={() => handleRemoveCard(item)}
                          className={styles.primary_text}
                          style={{ color: "black", marginLeft: "auto" }}
                        >
                          Remove
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

            {/* ✅ Add Card only once, below the last card */}
            <div className={styles.actionButtons}>
              <span onClick={handleAddCard} className={styles.actionText}>
                Add Card
              </span>
            </div>
          </>
        ) : (
          <>
            <div className={styles.visaCard}>
              <img src={visaImg} alt="Visa" />
              <div className={styles.separator}></div>
              <div className={styles.textRight}>
                Buy credits and take advantage of the exclusive sign up offer
                now!
              </div>
            </div>

            <div className={styles.actionButtons}>
              <span onClick={handleAddCard} className={styles.actionText}>
                Add Card
              </span>
            </div>
          </>
        )}
      </div>

      {isopen && <AddCardModal onClose={() => setIsOpen(false)} />}
    </>
  );
};

export default CreditCard;
