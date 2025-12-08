import { useState } from "react";
import styles from "./TransgationLogTable.module.css";
import CreditModal from "./CreditModal";
import { Pagination } from "antd";

const TransgationLogTable = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const handleOpen = () => {
    setIsOpen(true);
  };

  const reversedData = [...data].reverse();
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = reversedData.slice(startIndex, startIndex + pageSize);

  return (
    <div className={styles.container}>
      <h2 className={styles.creditTransactionLog} onClick={handleOpen}>
        Credit transaction log
      </h2>

      <div className={styles.scrollTable}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Description</th>
              <th>Credits</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((tx, index) => (
              <tr key={index}>
                <td className={styles.bold}>{tx.id}</td>
                <td>{tx.details}</td>
                <td className={styles.negative}>
                  {tx.payment_type == 1 ? "-" : ""}
                  {Math.abs(tx.credits)}
                </td>
                <td>{tx.purchase_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={data.length}
        onChange={(page) => setCurrentPage(page)}
        style={{ marginTop: 16, textAlign: "right", justifyContent: "right" }}
      />

      {/* {isOpen && (
        <CreditModal onClose={() => setIsOpen(false)} />
      )} */}
    </div>
  );
};

export default TransgationLogTable;
