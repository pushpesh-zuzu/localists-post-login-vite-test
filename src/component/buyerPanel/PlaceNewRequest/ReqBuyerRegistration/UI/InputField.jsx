import React, { useState } from "react";
import styles from "./InputField.module.css";

/**
 * labelClass prop behaviour:
 * ──────────────────────────
 *  - NOT passed  → uses styles.labelDefault  (has built-in responsive mt/mb)
 *  - Passed      → uses styles.labelBase (always-on styles) + your class
 *
 * Example from NameEmailPhone:
 *   <InputField labelClass={nameEmailStyles.inputLabel} ... />
 *
 * styles.labelBase always adds:
 *   display:block, line-height:100%, letter-spacing:-0.03em,
 *   font-weight:700, font-family:Arial, color:#253238
 * Your class adds spacing/size on top.
 */
const InputField = ({
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
  labelClass,
  labelStyle
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || name || label?.toLowerCase().replace(/\s+/g, "-");
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  const resolvedLabelClass = labelClass
    ? `${styles.labelBase} ${labelClass}`
    : styles.labelDefault;

  return (
    <div className={`${styles.wrapper} ${className}`}>

      {/* ── Label ── */}
      {label && (
        <label
          htmlFor={inputId}
          className={resolvedLabelClass}
          style={labelStyle}
        >
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}

      {/* ── Input wrapper (for eye icon) ── */}
      <div className={styles.inputWrapper}>
        <input
          id={inputId}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          onBlur={onBlur}
          className={[
            styles.input,
            error        ? styles.inputError    : "",
            isPassword   ? styles.inputPassword : "",
          ].join(" ")}
        />
      </div>

      {/* ── Error message ── */}
      {error && (
        <div className={styles.errorBox}>
          <p className={styles.errorText}>
            <span>{error}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default InputField;