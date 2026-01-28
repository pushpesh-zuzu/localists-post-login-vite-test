import { showToast } from ".";

export const formatUKPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return phoneNumber;

  if (phoneNumber.startsWith("+44")) {
    return "0" + phoneNumber.slice(3);
  }

  if (phoneNumber.startsWith("44")) {
    return "0" + phoneNumber.slice(2);
  }

  if (phoneNumber.startsWith("0")) {
    return phoneNumber;
  }

  return "0" + phoneNumber;
};

export const validateUKPhoneNumber = (phoneNumber) => {
  if (phoneNumber.startsWith("00")) {
    showToast("error", "Phone number should start with only one '0'");
    return false;
  }

  if (!phoneNumber.startsWith("0")) {
    showToast("error", "Please enter phone number start with '0'");
    return false;
  }

  if (phoneNumber.length < 11) {
    showToast("error", "Please enter at least 11 digits");
    return false;
  }

  return true;
};
