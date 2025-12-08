import React, { useRef, useState, useEffect } from "react";
import "./MobileSlideInSearch.css";
import { serviceRouteMap } from "../../../utils/allServicesRoute";
import { useNavigate, useParams } from "react-router";

export default function MobileSlideInSearch({
  isOpen,
  setIsOpen,
  services,
  handleServiceSelect,
  dispatch,
  searchService,
  setMobileSearchText,
  mobileSearchText,
}) {
  const [mobileDebouncedText, setMobileDebouncedText] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef(null);
  const { lang, country } = useParams();
  const navigate = useNavigate()

  const closeSearch = () => {
    setIsOpen(false);
    setMobileSearchText("");
    setShowSuggestions(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setMobileSearchText(value);
    setShowSuggestions(true);
  };

  const handleServiceClickLocal = (serviceItem) => {
    handleServiceSelect(serviceItem);
    setMobileSearchText(serviceItem.name);
    setShowSuggestions(false);
   
          const matchedRoute = serviceRouteMap[serviceItem.id];
      if (matchedRoute) {
        navigate(`/${lang}/${country}${matchedRoute}`); 
         closeSearch() // go to the route
      } 
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setMobileDebouncedText(mobileSearchText);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [mobileSearchText]);

  // API call
  useEffect(() => {
    if (mobileDebouncedText.trim() !== "") {
      dispatch(searchService({ search: mobileDebouncedText }));
    } else {
      // Clear search results if input is empty
      dispatch(searchService({ search: "" }));
    }
  }, [mobileDebouncedText, dispatch, searchService]);

  // Auto-focus input when modal opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 100);
    }
  }, [isOpen]);

  return (
    <>
      <div className="mobile-search-container">
        {/* Modal Overlay */}
        {isOpen && <div className="modal-overlay" onClick={closeSearch} />}

        <div className={`modal-content ${isOpen ? "open" : ""}`}>
          <div className={isOpen ? "modal-inner" : ""}>
            {/* Search Input Row */}
            <div className="search-input-row">
              <button onClick={closeSearch} className="close-button">
                <svg
                  className="close-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 18l-6-6 6-6"
                  />
                </svg>
              </button>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search for a service"
                className="search-input"
                value={mobileSearchText}
                onChange={handleInputChange}
                onFocus={() => setShowSuggestions(true)}
              />
            </div>

            {/* Suggestions List */}
            {showSuggestions && (
              <div className="suggestions-container">
                <ul className="suggestions-list">
                  {services && services.length > 0 ? (
                    services.map((serviceItem, index) => (
                      <li
                        key={index}
                        onClick={() => handleServiceClickLocal(serviceItem)}
                        className="service-item"
                      >
                        {serviceItem.name}
                      </li>
                    ))
                  ) : (
                    <li className="no-results">
                      {mobileSearchText && mobileSearchText.trim() !== ""
                        ? "No services found"
                        : "Start typing to search services. example: patio, business, home etc."}
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
