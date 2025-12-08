import PropTypes from "prop-types";
import { Form, Input } from "antd";
import styles from "./customeInput.module.css";

const TextInput = ({ label, name, type = "text", rules, required = true, ...rest }) => {
  const defaultRules = [
    { required: true, message: `${label} is required!` },
    ...(type === "email"
      ? [{ type: "email", message: "Please enter a valid email address!" }]
      : []),
  ];

  return (
    <Form.Item
      label={
        <span className={styles.lablename}>
          {label} {required && <span style={{ color: "red" }}>*</span>}
        </span>
      }
      name={name}
      rules={rules || defaultRules}
    >
      {type === "textarea" ? (
        <Input.TextArea
          placeholder={`Enter ${label}`}
          className={styles.inputFiled}
          rows={4} // rows customise kar sakte ho
        />
      ) : (
        <Input
          type={type}
          placeholder={`Enter ${label}`}
          className={styles.inputFiled}
          {...rest} 
        />
      )}
    </Form.Item>
  );
};

TextInput.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["text", "email", "number", "textarea"]),
  rules: PropTypes.arrayOf(PropTypes.object),
  required: PropTypes.bool,
};

export default TextInput;
