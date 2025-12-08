import { toast } from "react-toastify";
import DummyImage from "../assets/Images/Setting/ProfileWebIcon.svg"; 
export const generateSlug = (name) => {
  return name.toLowerCase().replace(/\s+/g, "-");
};

export const showToast = (type, message) => {
  const options = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  if (type === "success") {
    toast.success(message, options);
  } else if (type === "error") {
    toast.error(message, options);
  } else if (type === "info") {
    toast.info(message, options);
  } else if (type === "warning") {
    toast.warn(message, options);
  }
};

export const BASE_IMAGE_URL = import.meta.env.VITE_REACT_APP_BASE_URL;
export const BASE_URL_IMAGE = `${BASE_IMAGE_URL}storage/app/public/images/category/`;
export const BASE_IMAGE = `${BASE_IMAGE_URL}storage/app/public/images/`;
export const BASE_COMPLETE = `${BASE_IMAGE_URL}`;
// export const BASE_URL_IMAGE_MAIN = `${BASE_IMAGE_URL}public/images/`



export const DEFAULT_PROFILE_IMAGE = DummyImage;
export const loadGooglePlacesAutocomplete = ({
  inputRef,
  setPincode,
  setCity,
  setErrors,
  dispatch,
  setcitySerach,
}) => {
  const initAutocomplete = () => {
    if (!inputRef?.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ["geocode"], // Allows both city and pincode based search
        componentRestrictions: { country: "UK" },
      }
    );

    
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.address_components) return;

      const postalCode = place.address_components.find((component) =>
        component.types.includes("postal_code")
      )?.long_name;

      const cityName = place.address_components.find((component) =>
        component.types.includes("locality")
      )?.long_name;

      const townName = place.address_components.find((component) =>
        component.types.includes("administrative_area_level_3")
      )?.long_name;

      const formattedAddress = place.formatted_address;

      if (postalCode) {
        setPincode(postalCode);
        inputRef.current.value = postalCode;
        setErrors((prev) => ({ ...prev, pincode: "" }));
      }

      if (cityName || townName) {
        const finalCity = cityName || townName;
        setCity(finalCity);
        dispatch(setcitySerach(finalCity));
      }

      if (!postalCode && !cityName && !townName) {
        alert("No city or PIN code found! Please try again.");
      }
    });
  };

  const loadGoogleMapsScript = () => {
    if (!window.google?.maps) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBIdwxC-hvTxiXdHvrqYEuCGvOvpEV-wNE&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initAutocomplete;
      document.body.appendChild(script);
    } else {
      initAutocomplete();
    }
  };

  loadGoogleMapsScript();
};

export const updateLocalStorageValue = (storageKey, targetKey, newValue) => {
  try {
    const storedData = localStorage.getItem(storageKey);
    if (!storedData) {
      // console.warn(No data found in localStorage for key: ${storageKey});
      return;
    }

    const parsedData = JSON.parse(storedData);
    parsedData[targetKey] = newValue;

    localStorage.setItem(storageKey, JSON.stringify(parsedData));
  } catch (error) {
    console.error('Error updating localStorage:', error);
  }
};



export function clearAuthData() {
  const keysToRemove = [
    "barkToken",
    "barkUserToken",
    "registerDataToken",
    "registerTokens",
    "createRequestToken",
    "createRequest"
  ];

  keysToRemove.forEach((key) => {
    localStorage.removeItem(key);
  });
}
