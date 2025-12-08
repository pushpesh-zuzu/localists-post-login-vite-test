import { useState } from "react";
import styles from "./contactus.module.css";
import { contactUsBanner, contactUsMap } from "../../assets/Images/MainBanners";
import { Form } from "antd";
import TextInput from "../customInputs/TextInput";
import { Helmet } from "react-helmet-async";
import axiosInstance from "../../Api/axiosInstance";
import { showToast } from "../../utils";
import CalonicalTags from "../common/CalonicalTags/CalonicalTags";

const ContactUs = () => {
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    customerType: "customer",
    message: "",
  });

  const onFinish = async (values) => {
    try {
      const userType = values.customerType === "customer" ? 1 : 2;

      const payload = {
        full_name: values.fullName,
        phone: `+44${values.phoneNumber}`,
        email: values.email,
        user_type: userType,
        message: values.message,
      };

      const response = await axiosInstance.post("contact-us", payload);

      if (response.data.success) {
        showToast("success", "Thank You, We'll get back to you soon!");
        form.resetFields();
      } else {
        showToast(
          "error",
          response.data.message || "Please try again after some time"
        );
      }
    } catch (error) {
      showToast("error", "Please try again after some time ");
    }
  };

  const bannerImage = {
    backgroundImage: `url(${contactUsBanner})`,
  };

  return (
    <>
      <CalonicalTags bannerImage={contactUsBanner} isRequiredjsonLd={false} />
      <Helmet>
        <title>
          Get in Touch with Localists | Customer & Professional Support
        </title>
        <meta
          property="og:title"
          content="Get in Touch with Localists | Customer & Professional Support"
        />
        <meta
          name="twitter:title"
          content="Get in Touch with Localists | Customer & Professional Support"
        />
        <meta
          property="og:description"
          content="Have questions or need help? Contact Localists & Speak with our team, find professionals, or join as a service provider. We’re here to help you connect."
        />
        <meta
          name="description"
          content=" Have questions or need help? Contact Localists & Speak with our team, find professionals, or join as a service provider. We’re here to help you connect."
        />
      </Helmet>

      <div className={styles.contactSection}>
        <div className={styles.bannerImage} style={bannerImage}>
          <h1 className={styles.bannerTitle}>Contact Us</h1>
        </div>

        <div className={styles.formContainer}>
          <h2 className={styles.formTitle}>Get in touch with our Team</h2>

          <Form
            form={form}
            name="login"
            initialValues={{ customerType: "customer" }}
            requiredMark="optional"
            onFinish={onFinish}
            layout="vertical"
            className={styles.formWrapper}
          >
            <Form.Item name="customerType" hidden>
              <input type="hidden" />
            </Form.Item>

            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <TextInput
                  type="text"
                  name="fullName"
                  required
                  label="Full Name"
                />
              </div>
              <div className={styles.inputGroup}>
                <TextInput
                  type="text"
                  name="phoneNumber"
                  label="Phone Number"
                  required
                  maxLength={10}
                  prefix="+44"
                  onInput={(e) => {
                    e.target.value = e.target.value
                      .replace(/[^0-9]/g, "")
                      .slice(0, 10);
                  }}
                />
              </div>
            </div>

            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <TextInput
                  type="email"
                  name="email"
                  required
                  label="Email"
                  placeholder="Enter Email"
                />
              </div>
              <div className={styles.inputGroup}>
                <div className={styles.customerTypeGroup}>
                  <span
                    style={{ visibility: "hidden" }}
                    className={styles.buttonlable}
                  >
                    ''
                  </span>
                  <div className={styles.buttonContainer}>
                    <div
                      className={`${styles.buttonSlider} ${
                        formData.customerType === "professional"
                          ? styles.professional
                          : ""
                      }`}
                    ></div>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          customerType: "customer",
                        }));
                        form.setFieldsValue({ customerType: "customer" });
                      }}
                      className={`${styles.customerButton} ${
                        formData.customerType === "customer"
                          ? styles.active
                          : ""
                      }`}
                    >
                      Customer
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          customerType: "professional",
                        }));
                        form.setFieldsValue({ customerType: "professional" });
                      }}
                      className={`${styles.customerButton} ${
                        formData.customerType === "professional"
                          ? styles.active
                          : ""
                      }`}
                    >
                      Professional
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.textareaGroup}>
              <TextInput
                type="textarea"
                label="Message"
                name="message"
                required
              />
            </div>

            <button type="submit" className={styles.submitButton}>
              Submit
            </button>
          </Form>
        </div>

        <div
          className={styles.mapSection}
          style={{ backgroundImage: `url(${contactUsMap})` }}
        ></div>
      </div>
    </>
  );
};

export default ContactUs;
