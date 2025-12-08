import styles from "./AllServices.module.css";
import {
  AllServicesData,
  categoryRoutes,
  serviceRoutes,
} from "../../../constant/CloneCategory";
import { Collapse } from "antd";
const { Panel } = Collapse;
import { DownOutlined } from "@ant-design/icons";
import { Link, useParams } from "react-router-dom";

const AllServicesComponent = ({ data }) => {
        const { lang, country } = useParams(); 
        const currentLang = lang || "en";
        const currentCountry = country || "gb";
  const allPanelKeys = AllServicesData.map((panel) => panel.key);
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        All <span className={styles.blueTitle}>Services</span>
      </div>
      {data?.map((category, index) => {
        const categoryName = Object.keys(category)[1];
        const services = category[categoryName];
        const categoryPath = categoryRoutes[categoryName] || "#";
        return (
          <Collapse
            defaultActiveKey={allPanelKeys}
            bordered={false}
            key={index}
            expandIcon={() => null}
            expandIconPosition="end"
            className={styles.category_collapse}
          >
            <Panel
              className={styles.categoryTitle}
              header={
                <Link
                  style={{ color: "#000", cursor: "pointer" }}
                  to={`/${currentLang}/${currentCountry}${categoryPath}`}
                  className={styles.categoryLink}
                >
                  {categoryName}
                </Link>
              }
              key={category?.key}
            >
              <div key={index} className={styles.categoryContainer}>
                <div className={styles.servicesContainer}>
                  {services?.map((service, idx) => {
                    const servicePath = `/${currentLang}/${currentCountry}${
                      serviceRoutes[service] || "#"
                    }`;

                    return (
                      <Link
                        style={{ color: "#000", cursor: "pointer" }}
                        key={idx}
                        to={servicePath}
                        className={styles.serviceItem}
                      >
                        {service}
                      </Link>
                    );
                  })}
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
