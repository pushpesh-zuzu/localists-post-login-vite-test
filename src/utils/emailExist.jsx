import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { checkEmailIdApi } from "../store/FindJobs/findJobSlice";

export const useEmailCheck = (email = "") => {
  const dispatch = useDispatch();
  const [isChecking, setIsChecking] = useState(false);
  const [isEmailAvailable, setIsEmailAvailable] = useState(true);
  const timeoutRef = useRef(null);
  useEffect(() => {
    const checkEmail = async () => {
      if (!email) {
        setIsEmailAvailable(true);
        return;
      }

      setIsChecking(true);

      try {
        const result = await dispatch(checkEmailIdApi({ email }));
        const success = result?.success || false;
        setIsEmailAvailable(success);
      } catch (error) {
        console.error("Email check error:", error);
        setIsEmailAvailable(false);
      } finally {
        setIsChecking(false);
      }
    };

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout with debounce
    timeoutRef.current = setTimeout(checkEmail, 300);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [email, dispatch]);

  return {
    isEmailAvailable,
    isChecking,
  };
};
