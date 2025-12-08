import React, { useState, useEffect } from "react";
import styles from "./AddServiceModal.module.css";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import iIcon from "../../assets/Images/iIcon.svg";
import { useSelector, useDispatch } from "react-redux";

const AddServiceModal = ({
  isModalOpen,
  setIsModalOpen,
  input,
  setInput,
  isDropdownOpen,
  setIsDropdownOpen,
  service = [],
  searchServiceLoader = false,
  handleSelectService,
  handleSubmitData,
  selectedServices,
  handleRemoveService,
  popularList = [],
}) => {
  const dispatch = useDispatch();

  const [localSuggestions, setLocalSuggestions] = useState([]);

  useEffect(() => {
    setLocalSuggestions(popularList);
  }, [popularList, isModalOpen]);

  if (!isModalOpen) return null;

  const handleSelect = (item) => {
    handleSelectService(item);

    setLocalSuggestions((prev) =>
      prev.filter((suggestion) => suggestion.id !== item.id)
    );
  };

  const handleRemove = (id) => {
    // find removed service
    const removedItem = selectedServices.find((s) => s.id === id);
    if (removedItem) {
      // add back to suggestions (only if not already there)
      setLocalSuggestions((prev) => {
        const alreadyExists = prev.some((s) => s.id === removedItem.id);
        return alreadyExists ? prev : [...prev, removedItem];
      });
    }
    // call parent remove handler
    handleRemoveService(id);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button
          className={styles.closeButton}
          onClick={() => setIsModalOpen(false)}
        >
          ×
        </button>

        <h2 className={styles.title}>Add a Service</h2>
        <p className={styles.subtitle}>
          <span className={styles.infoIcon}>
            <img src={iIcon} alt="" />
          </span>{" "}
          Start typing the name of your service to search our full directory of
          available options.
        </p>

        <label className={styles.label}>Service</label>
        <input
          type="text"
          placeholder="Start typing to find services fast..."
          className={styles.input}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setIsDropdownOpen(!!e.target.value);
          }}
        />

        {isDropdownOpen && service?.length > 0 && (
          <div className={styles.dropdown}>
            {searchServiceLoader ? (
              <Spin indicator={<LoadingOutlined spin />} />
            ) : (
              service.map((item) => (
                <p
                  key={item.id}
                  className={styles.dropdownItem}
                  onClick={() => handleSelect(item)}
                >
                  {item.name}
                </p>
              ))
            )}
          </div>
        )}
        <div className={styles.selectedTags}>
          {selectedServices.map((service) => (
            <div key={service.id} className={styles.selectedTag}>
              {service.name}
              <button
                className={styles.removeIcon}
                onClick={() => handleRemove(service.id)}
              >
                x
              </button>
            </div>
          ))}
        </div>
        <div className={styles.suggestions}>
          <label className={styles.label}>Suggestions</label>
          <p className={styles.suggestionText}>
            We’ve recommended some services based on your profile. Click to add
            them instantly:
          </p>
          <div className={styles.tags}>
            {/* {popularList?.map((item, idx) => (
              <span
                key={idx}
                className={styles.tag}
                onClick={() => handleSelect(item)}
              >
                + {item.name}
              </span>
            ))} */}
            {localSuggestions?.map((item) => (
              <span
                key={item.id}
                className={styles.tag}
                onClick={() => handleSelect(item)}
              >
                + {item.name}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.cancelButton}
            onClick={() => setIsModalOpen(false)}
          >
            Cancel
          </button>
          <button className={styles.submitButton} onClick={handleSubmitData}>
            Add Services
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddServiceModal;
