import React, { useState } from "react";
import styles from "./AccordionItem.module.css";
import { UpOutlined, DownOutlined, CheckOutlined } from "@ant-design/icons";
import { Progress } from "antd";
import ProfileArrowUp from "../../assets/Icons/ProfileArrow.svg";

const AccordionItem = ({ title, children, isOpen, onClick }) => {
  return (
    <div className={styles.accordionItem}>
      <div className={styles.header} onClick={onClick}>
        <span className={styles.title}>{title}</span>
        <div className={styles.rightSection}>
          {/* <Progress
            type="circle"
            percent={25}
            width={24}
            strokeColor="#00b2ff"
            format={() => <CheckOutlined />}
          /> */}
          <span className={styles.icon}>
            {/* {isOpen ? <UpOutlined /> : <DownOutlined />} */}
            <img
              src={ProfileArrowUp}
              alt="arrow"
              className={`${styles.arrow} ${isOpen ? styles.up : styles.down}`}
            />
          </span>
        </div>
      </div>
      {isOpen && <div className={styles.content}>{children}</div>}
    </div>
  );
};

export default AccordionItem;
