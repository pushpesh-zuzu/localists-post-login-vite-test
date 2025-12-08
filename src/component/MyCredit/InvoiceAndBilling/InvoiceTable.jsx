import React, { useState } from "react";
import styles from "./InvoiceAndBilling.module.css";
import GreenTick from "../../../assets/Images/Setting/RightClick.svg";
import downloadIcon from "../../../assets/Images/Setting/DownloadIcon.svg";
import { downloadInvoceApi } from "../../../store/MyProfile/MyCredit/MyCreditSlice";
import { useDispatch, useSelector } from "react-redux";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

const InvoiceTable = ({ data }) => {
  const dispatch = useDispatch();
  const { invoiceLoader } = useSelector((state) => state.myCredit)

  const [downloadingId, setDownloadingId] = useState(null);
  const handleDownload = async (item) => {
  setDownloadingId(item.id);

  const datas = {
    invoice_id: item?.id,
  };

  try {
    await dispatch(downloadInvoceApi(datas));
  } finally {
    setDownloadingId(null);
  }
};

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className={styles.tableSection}>
      <h3 className={styles.subHeading}>Invoices</h3>
      <table className={styles.invoiceTable}>
        <thead>
          <tr>
            <th>Invoice#</th>
            <th>Date</th>
            <th>Total</th>
            <th>Paid</th>
            <th>Invoice</th>
          </tr>
        </thead>
        <tbody>
             {data && data.length > 0 ? (
            data.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td  style={{minWidth:"100px"}}>{formatDate(item.created_at)}</td>
                <td>£{item.total_amount}</td>
                <td><img src={GreenTick} alt="Paid" /></td>
                <td>
                  {downloadingId === item.id ? (
                    <Spin
                      indicator={
                        <LoadingOutlined spin style={{ color: "blue" }} />
                      }
                    />
                  ) : (
                    <img
                      src={downloadIcon}
                      alt="Download"
                      className={styles.downloadIcon}
                      onClick={() => handleDownload(item)}
                      style={{ cursor: "pointer !important" }}
                    />
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No invoices found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceTable;
