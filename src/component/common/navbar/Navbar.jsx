import { useLocation } from "react-router-dom";
import LogoComponent from "./LogoComponent";
import LogSwitch from "./LogSwitch";
import styles from "./navbar.module.css";
const Navbar = () => {
  const location = useLocation(); // gives you current route info
  return (
    <nav
      role="tablist"
      aria-label="Professional matches navigation"
      className={styles.navbarContainer}
    >
      <div className={styles.navbarItems}>
        <div className={styles.navbarLeftContainer}>
          <LogoComponent />
        </div>
        <div className={styles.navbarRightContainer}>
          <LogSwitch />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
