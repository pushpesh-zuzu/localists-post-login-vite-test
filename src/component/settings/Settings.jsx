import React from "react";
import styles from "./Settings.module.css";
import SettingsList from "./SettingsList/SettingsList";

const Settings = () => {
    return (
        <>
            <div className={styles.settings}>
                <SettingsList />
            </div>
        </>
    );
}

export default Settings;