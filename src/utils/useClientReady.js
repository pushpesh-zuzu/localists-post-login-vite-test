import { useEffect, useState } from "react";

const useClientReady = (delay = 3000) => {
  const [isClientReady, setIsClientReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsClientReady(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return isClientReady;
};

export default useClientReady;
