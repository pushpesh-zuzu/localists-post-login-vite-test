import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setbuyerRequestData } from "../store/Buyer/BuyerSlice";

export default function useUserInfo() {
  const [ip, setIp] = useState(null);
  const [url, setUrl] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    // ✅ Get user IP
    const fetchIp = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        setIp(data.ip);
        dispatch(setbuyerRequestData({ ip: data.ip }));
      } catch (error) {
        console.error("Error fetching IP:", error);
      }
    };

    // ✅ Get current full URL
    const fullUrl = window.location.href;
    setUrl(fullUrl);
    dispatch(setbuyerRequestData({ url: fullUrl }));
    fetchIp();
  }, []);

  return { ip, url };
}
