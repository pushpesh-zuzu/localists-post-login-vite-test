import styles from "./AllServices.module.css";
import { AllServicesData } from "../../../constant/Category";
import { Collapse } from "antd";
const { Panel } = Collapse;
import { DownOutlined } from "@ant-design/icons";

const AllServicesComponent = () => {
  const allPanelKeys = AllServicesData.map((panel) => panel.key);

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        All <span className={styles.blueTitle}>Services</span>
      </div>
      {AllServicesData.map((category, index) => {
        const categoryName = Object?.keys(category)[1];
        const services = category[categoryName];
        return (
          <Collapse
            defaultActiveKey={allPanelKeys}
            bordered={false}
            key={index}
            // expandIcon={({ isActive }) => (
            //   <DownOutlined
            //     style={{
            //       transform: isActive ? "rotate(180deg)" : "rotate(0deg)",
            //       transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            //     }}
            //   />
            // )}
            expandIcon={() => null}
            expandIconPosition="end"
            className={styles.category_collapse}
          >
            <Panel
              className={styles.categoryTitle}
              header={categoryName}
              key={category?.key}
            >
              <div key={index} className={styles.categoryContainer}>
                {/* <hr className={styles.separator} /> */}
                <div className={styles.servicesContainer}>
                  {services?.map((service, idx) => (
                    <span key={idx} className={styles.serviceItem}>
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            </Panel>
          </Collapse>
        );
      })}
    </div>
  );
};

export default AllServicesComponent;
