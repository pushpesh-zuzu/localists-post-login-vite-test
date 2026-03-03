// export const safeLocalStorage = {
//   getItem(key) {
//     if (typeof window !== "undefined") {
//       return localStorage.getItem(key);
//     }
//     return null;
//   },
//   setItem(key, value) {
//     if (typeof window !== "undefined") {
//       localStorage.setItem(key, value);
//     }
//   },
//   removeItem(key) {
//     if (typeof window !== "undefined") {
//       localStorage.removeItem(key);
//     }
//   },
// };


export const safeLocalStorage = {
  getItem(key) {
    try {
      if (typeof window !== "undefined") {
        return localStorage.getItem(key);
      }
      return null;
    } catch (e) {
      return null;
    }
  },
  setItem(key, value) {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(key, value);
      }
    } catch (e) {}
  },
  removeItem(key) {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem(key);
      }
    } catch (e) {}
  },
};