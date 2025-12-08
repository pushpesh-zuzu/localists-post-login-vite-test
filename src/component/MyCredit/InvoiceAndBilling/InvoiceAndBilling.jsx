import { useEffect, useState } from "react";
import styles from "./InvoiceAndBilling.module.css";
import iIcon from "../../../assets/Images/iIcon.svg";
import InvoiceTable from "./InvoiceTable";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  AddSellerBillingDetailsApi,
  getInvoiceListDataApi,
} from "../../../store/MyProfile/MyCredit/MyCreditSlice";
import { showToast } from "../../../utils";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import blackArrow from "../../../assets/Images/Leads/blackArrowRight.svg";

const InvoiceAndBilling = () => {
  const dispatch = useDispatch();
  const { registerData } = useSelector((state) => state.findJobs);
  const { userToken } = useSelector((state) => state.auth);
  const { sellerCardLoader, getInvoiceList } = useSelector(
    (state) => state.myCredit
  );
  const [formData, setFormData] = useState({
    contactName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    postcode: "",
    country: "",
    phoneNumber: "",
    vatRegister: 0,
  });
  const navigate = useNavigate();
  const userData = userToken || registerData;
  useEffect(() => {
    if (userData) {
      setFormData({
        contactName: userData?.name || "",
        addressLine1: userData?.address || "",
        addressLine2: userData?.apartment || "",
        city: userData?.city || "",
        postcode: userData?.zipcode || "",
        country: userData?.country || "",
        phoneNumber: userData?.phone || "",
        vatRegister: userData?.billing_vat_register ? 1 : 0,
      });
    }
  }, [userData]);

  useEffect(() => {
    dispatch(getInvoiceListDataApi());
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleBack = () => {
    navigate("/settings");
  };
  const handleSaveData = () => {
    const data = {
      user_id: userToken?.remember_tokens
        ? userToken?.remember_tokens
        : registerData?.remember_tokens,
      billing_contact_name: formData.contactName,
      billing_address1: formData.addressLine1,
      billing_address2: formData.addressLine2,
      billing_city: formData.city,
      billing_postcode: formData.postcode,
      billing_phone: formData.phoneNumber,
      country: formData.country,
      billing_vat_register: Number(formData.vatRegister),
    };
    dispatch(AddSellerBillingDetailsApi(data)).then((result) => {
      if (result) {
        showToast("success", result?.message);
      }
    });
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.backText} onClick={handleBack}>
          <img src={blackArrow} alt="..." /> Settings
        </div>
        <h1 className={styles.heading}>Invoices & Billing Details</h1>

        <div className={styles.manageWrapper}>
          <span className={styles.infoIcon}>
            <img src={iIcon} alt="iIcon" />
          </span>
          <p className={styles.description}>
            We use these details to manage your account and send you billing
            information. This information is private and won’t be shared with
            customers. To manage what contact details are visible to customers,
            visit your{" "}
            <Link to="/settings/profile/my-profile" className={styles.link}>
              My Profile
            </Link>{" "}
            settings .
          </p>
        </div>

        <div className={styles.card}>
          <h3 className={styles.subHeading}>Billing address</h3>
          <p className={styles.note}>
            Your business address for billing & invoicing
          </p>

          <label className={styles.label}>Contact name</label>
          <input
            type="text"
            name="contactName"
            className={styles.input}
            value={formData.contactName}
            onChange={handleChange}
          />
          <label className={styles.label}>Street address</label>
          <input
            type="text"
            name="addressLine1"
            className={styles.input}
            value={formData.addressLine1}
            onChange={handleChange}
          />
          <label className={styles.label}>Building or House Name/Number</label>
          <input
            type="text"
            name="addressLine2"
            className={styles.input}
            value={formData.addressLine2}
            onChange={handleChange}
          />

          <div className={styles.row}>
            <div className={styles.column}>
              <label className={styles.label}>City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
            <div className={styles.column}>
              <label className={styles.label}>Postcode</label>
              <input
                type="text"
                name="postcode"
                value={formData.postcode}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
          </div>
          <label className={styles.label}>Country</label>
          <input
            type="text"
            name="country"
            className={styles.input}
            value={formData.country}
            onChange={handleChange}
          />
          <label className={styles.label}>Phone number</label>
          <input
            type="text"
            name="phoneNumber"
            className={styles.input}
            value={formData.phoneNumber}
            onChange={handleChange}
          />
          <div className={styles.vatRegisterBox}>
            <input
              type="checkbox"
              id="vatRegister"
              name="vatRegister"
              checked={formData.vatRegister === 1}
              onChange={(e) => {
                const isChecked = e.target.checked;
                setFormData((prev) => ({
                  ...prev,
                  vatRegister: isChecked ? 1 : 0,
                }));
              }}
            />
            <label className={styles.labels}>VAT Register</label>
          </div>

          <div className={styles.saveButtonBox}>
            <button
              className={styles.saveButton}
              onClick={() => handleSaveData()}
            >
              {sellerCardLoader ? (
                <Spin
                  indicator={
                    <LoadingOutlined spin style={{ color: "white" }} />
                  }
                />
              ) : (
                "Save"
              )}{" "}
            </button>
          </div>
        </div>
        <InvoiceTable data={getInvoiceList} />
      </div>
    </>
  );
};

export default InvoiceAndBilling;
