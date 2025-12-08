// import { useState } from "react";
// import styles from "./Leads.module.css";
// import LeadSettings from "./LeadSettings/LeadSettings";
// import CustomerQuestions from "./LeadSettings/CustomerQuestions";

// const LeadSetting = () => {
//   const [selectedService, setSelectedService] = useState(null);
//   const [isRemoved, setIsRemoved] = useState(false);
//   const handleServiceClick = (service) => {
//     setSelectedService(service);
//     setIsRemoved(false);
//   };

//   return (
//     <>
//       <div className={styles.leadsOverlay}>
//         <>
//           {/* {!selectedService && (
//             <div className={styles.leadSettingsTabView}>
//               <LeadSettings
//                 setSelectedService={handleServiceClick}
//                 selectedService={selectedService}
//               />
//             </div>
//           )}
//           <div className={styles.leadSettingsOverlay}>
//             <LeadSettings
//               setSelectedService={handleServiceClick}
//               selectedService={selectedService}
//             />
//           </div> */}

//           {!selectedService ? (
//             <div className={styles.leadSettingsTabView}>
//               <LeadSettings
//                 setSelectedService={handleServiceClick}
//                 selectedService={selectedService}
//               />
//             </div>
//           ) : (
//             <div className={styles.leadSettingsOverlay}>
//               <LeadSettings
//                 setSelectedService={handleServiceClick}
//                 selectedService={selectedService}
//               />
//             </div>
//           )}

//           {selectedService && !isRemoved && (
//             <CustomerQuestions
//               selectedService={selectedService}
//               setSelectedService={setSelectedService}
//               setIsRemoved={setIsRemoved}
//             />
//           )}
//         </>
//       </div>
//     </>
//   );
// };

// export default LeadSetting;

import { useEffect, useState } from "react";
import styles from "./Leads.module.css";
import LeadSettings from "./LeadSettings/LeadSettings";
import CustomerQuestions from "./LeadSettings/CustomerQuestions";

const LeadSetting = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [isRemoved, setIsRemoved] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 786);

  const handleServiceClick = (service) => {
    setSelectedService(service);
    setIsRemoved(false);
  };

  // handle resize (if user resizes window)
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 786);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleBack = () => {
    setSelectedService(null);
  };

  return (
    <div className={styles.leadsOverlay}>
      {/* Desktop view: show both sections */}
      {!isMobile ? (
        <>
          <div className={styles.leadSettingsOverlay}>
            <LeadSettings
              setSelectedService={handleServiceClick}
              selectedService={selectedService}
            />
          </div>

          {selectedService && !isRemoved && (
            <CustomerQuestions
              selectedService={selectedService}
              setSelectedService={setSelectedService}
              setIsRemoved={setIsRemoved}
              onBack={handleBack}
            />
          )}
        </>
      ) : (
        // Mobile view: toggle between the two
        <>
          {!selectedService ? (
            <div className={styles.leadSettingsOverlay}>
              <LeadSettings
                setSelectedService={handleServiceClick}
                selectedService={selectedService}
              />
            </div>
          ) : (
            <CustomerQuestions
              selectedService={selectedService}
              setSelectedService={setSelectedService}
              setIsRemoved={setIsRemoved}
              onBack={handleBack}
            />
          )}
        </>
      )}
    </div>
  );
};

export default LeadSetting;
