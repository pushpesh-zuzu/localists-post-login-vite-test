export const extractAllParams = (searchString) => {
  try {
    const allParams = {};

    const decodedUrl = decodeURIComponent(searchString);

    const paramRegex = /([^?=&]+)=([^&]*)/g;
    let match;

    while ((match = paramRegex.exec(decodedUrl)) !== null) {
      const key = match[1];
      const value = match[2];

      allParams[key] = value;
    }

    return allParams;
  } catch (error) {
    console.error("Error decoding URL:", error);
    return {};
  }
};
