import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useEffect, useState, useRef } from "react";
import {
  updateSellerAccreditations,
  clearAccreditationsStatus,
  deleteSellerAccreditation,
  setIsDirtyRedux,
} from "../../../store/MyProfile/myProfileSlice";
import styles from "./AccreditationsAccordion.module.css";
import ISSAImage from "../../../assets/Images/Setting/newAccoredationImg.svg";
import iIcon from "../../../assets/Images/iIcon.svg";
import { BASE_IMAGE } from "../../../utils";
import { addViewProfileList } from "../../../store/LeadSetting/leadSettingSlice";

const AccreditationsAccordion = ({ details, hasAccreditations }) => {
  const [accordionGroups, setAccordionGroups] = useState([]);

  const fileInputRefs = useRef([]);
  const dispatch = useDispatch();
  const {
    accreditationsUpdateSuccess,
    accreditationsUpdateError,
    isDirtyRedux,
  } = useSelector((state) => state.myProfile);

  const { userToken } = useSelector((state) => state.auth);
  const { registerData } = useSelector((state) => state.findJobs);
  const user_id = userToken?.id ? userToken?.id : registerData?.id;
  const [optional, setOptional] = useState(hasAccreditations || 0);

  const handleInputChange = (index, value) => {
    const updated = [...accordionGroups];
    if (updated[index].id) {
      updated[index].accreditations[0] = value;
    } else {
      updated[index].newAccreditation = value;
    }
    setAccordionGroups(updated);

    dispatch(setIsDirtyRedux(true));
  };

  const handleImageUpload = (index, file) => {
    const updated = [...accordionGroups];
    updated[index].accreImage = file;
    setAccordionGroups(updated);

    dispatch(setIsDirtyRedux(true));
  };

  const handleClickUpload = (index) => {
    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index].click();
    }
  };

  const handleAccreditationAdd = () => {
    setAccordionGroups([
      ...accordionGroups,
      { id: null, accreditations: [], newAccreditation: "", accreImage: null },
    ]);
  };

  const handleRemoveAccreditation = (index) => {
    const updated = [...accordionGroups];

    const removedGroup = updated[index];

    updated.splice(index, 1);
    setAccordionGroups(updated);

    if (removedGroup.id) {
      dispatch(deleteSellerAccreditation(removedGroup.id));
    }

    dispatch(setIsDirtyRedux(true));
  };

  const handleSave = () => {
    const invalid = accordionGroups.some(
      (g) =>
        (g.accreImage &&
          (!g.accreditations[0] || g.accreditations[0].trim() === "") &&
          (!g.newAccreditation || g.newAccreditation.trim() === "")) ||
        (!g.accreImage &&
          (!g.accreditations[0] || g.accreditations[0].trim() === "") &&
          (!g.newAccreditation || g.newAccreditation.trim() === ""))
    );
    if (invalid) {
      toast.error("Please enter accreditation name.");
      return;
    }
    let payload = accordionGroups.map((g) => ({
      id: g.id ?? "",
      accreditations:
        Array.isArray(g.accreditations) &&
        g.accreditations[0] &&
        g.accreditations[0].trim() !== ""
          ? [g.accreditations[0].trim()]
          : [],
      newAccreditation:
        g.newAccreditation && g.newAccreditation.trim() !== ""
          ? g.newAccreditation.trim()
          : "",
      image: g.accreImage || null,
    }));

    if (payload.length === 0 && optional == 0) {
      toast.error("Please add at least one accreditation or image.");
      return;
    }

    payload = { ...payload, has_accreditations: optional };
    if (isDirtyRedux) {
      dispatch(updateSellerAccreditations(payload));
      dispatch(setIsDirtyRedux(false));
    }
  };

  useEffect(() => {
    if (accreditationsUpdateSuccess) {
      toast.success("Accreditations saved successfully!");
      dispatch(clearAccreditationsStatus());
      const sellerData = {
        seller_id: user_id,
      };
      dispatch(addViewProfileList(sellerData));
      dispatch(setIsDirtyRedux(false));
    } else if (accreditationsUpdateError) {
      toast.error(`Error: ${accreditationsUpdateError}`);
      dispatch(clearAccreditationsStatus());
    }
  }, [accreditationsUpdateSuccess, accreditationsUpdateError, dispatch]);

  useEffect(() => {
    if (details && Array.isArray(details)) {
      const mapped = details.map((item) => ({
        id: item.id,
        accreditations: item.name ? [item.name] : [],
        newAccreditation: "",
        accreImage: item.image
          ? { previewUrl: `${BASE_IMAGE}/accreditations/${item.image}` }
          : null,
      }));
      setAccordionGroups(mapped);
    }
  }, [details]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <h3 className={styles.title}>Showcase Your Accreditations</h3>
          <div className={styles.optional}>
            <img src={iIcon} alt="info" className={styles.icon} />
            <span>Optional</span>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={optional == 1 ? true : false}
                onChange={() => {
                  setOptional((prev) => (prev ? 0 : 1));
                  dispatch(setIsDirtyRedux(true));
                }}
              />
              <span className={styles.slider}></span>
            </label>
          </div>
        </div>

        <p className={styles.description}>
          Adding your accreditations helps customers on Localists.com feel more
          confident hiring you and can increase your chances of winning more
          work.
        </p>

        {accordionGroups?.length === 0 && optional == 0 && (
          <button
            className={styles.addAccreditationButtons}
            onClick={handleAccreditationAdd}
          >
            + Add Accreditation
          </button>
        )}

        {optional == 0 &&
          accordionGroups.map((group, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.logoSectionWrapper}>
                <div className={styles.logoSection}>
                  {group.accreImage ? (
                    <img
                      src={
                        group.accreImage.previewUrl
                          ? group.accreImage.previewUrl
                          : URL.createObjectURL(group.accreImage)
                      }
                      alt="Uploaded"
                      className={styles.logo}
                    />
                  ) : (
                    <img src={ISSAImage} alt="ISSA" className={styles.logo} />
                  )}
                </div>

                <div className={styles.accreditationList}>
                  {(group.accreditations[0] || group.newAccreditation) && (
                    <span className={styles.accreditationItem}>
                      {group.accreditations[0] || group.newAccreditation}
                    </span>
                  )}
                </div>

                <button
                  className={styles.closeButton}
                  onClick={() => handleRemoveAccreditation(index)}
                >
                  Delete
                </button>
              </div>

              <div className={styles.inputGroup}>
                <input
                  type="text"
                  value={group.accreditations[0] || group.newAccreditation}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  placeholder="Accreditation Name"
                  className={styles.input}
                  required
                />
              </div>

              <div
                className={styles.AccreditationsAccordionBox}
                style={{ display: "flex", gap: "1rem", marginTop: "10px" }}
              >
                <button
                  className={styles.addAccreditationButton}
                  onClick={() => handleClickUpload(index)}
                >
                  {group.accreImage ? "Change Photo " : "Upload Photo"}
                </button>

                {index === accordionGroups.length - 1 && (
                  <button
                    className={styles.addAccreditationButtons}
                    onClick={handleAccreditationAdd}
                  >
                    + Add Accreditation
                  </button>
                )}

                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  ref={(el) => (fileInputRefs.current[index] = el)}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) handleImageUpload(index, file);
                  }}
                />
              </div>
            </div>
          ))}
      </div>

      <div className={styles.footer}>
        <button
          className={styles.save}
          onClick={handleSave}
          style={{ marginLeft: "auto" }}
        >
          Save
        </button>
      </div>
    </>
  );
};

export default AccreditationsAccordion;
