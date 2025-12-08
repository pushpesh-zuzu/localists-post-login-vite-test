import PropTypes from "prop-types";
import { Form, Input } from "antd";
import styles from './customeInput.module.css'

const PasswordInput = ({
  label = "Password",
  name = "password",
  rules,
  required = true,
}) => {
  const defaultRules = [
    { required: true, message: `${label} is required!` },
    { min: 6, message: "Password must be at least 6 characters long!" },
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
      <Input.Password placeholder={`Enter ${label}`} className={styles.inputFiled} />
    </Form.Item>
  );
};

PasswordInput.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  rules: PropTypes.arrayOf(PropTypes.object),
  required: PropTypes.bool,
};

export default PasswordInput;
