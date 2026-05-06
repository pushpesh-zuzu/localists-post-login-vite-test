// RequestInputField.jsx
import React from "react";
import styles from "./RequestInputField.module.css";

const RequestInputField = ({
  label,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  required = false,
  disabled = false,
  name,
  id,
  className = "",
  onBlur,
  labelGap = "10px",   // space between label & input
  inputGap = "20px",   // space below input (before error or next element)
  errorGap = "",
  ...props
}) => {
  const inputId = id || name || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={`${styles.wrapper} ${className}`}>

      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          style={{ marginBottom: labelGap }}
          className={styles.label}
        >
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}

      {/* Input */}
      <div
        className={styles.inputWrapper}
        style={{ marginBottom: error ? "0px" : label ? inputGap : "0px" }}
      >
        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          onBlur={onBlur}
          {...props}
          className={`${styles.input} ${error ? styles.inputError : styles.inputNormal}`}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div
          className={styles.errorWrapper}
          style={{ marginBottom: label === "" ? "20px" : errorGap }}
        >
          <p className={styles.errorText}>
            <span>{error}</span>
          </p>
        </div>
      )}

    </div>
  );
};

export default RequestInputField;