import { Form, Button, Checkbox, Typography, Spin } from "antd";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
import "./index.css";
import TextInput from "../../component/customInputs/TextInput";
import PasswordInput from "../../component/customInputs/PasswordInput";
import { useDispatch, useSelector } from "react-redux";
import {
  userLogin,
  sendPasswordlessLink,
  fetchProfileFromMagicLink,
} from "../../store/Auth/authSlice";
import { showToast } from "../../utils";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import CalonicalTags from "../../component/common/CalonicalTags/CalonicalTags";

const { Text } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { lang, country } = useParams();
  const currentLang = lang || "en";
  const currentCountry = country || "gb";
  const [passwordless, setPasswordless] = useState(
    location.pathname === "/passwordless_login"
  );

  const { loginLoader, passwordlessLoader } = useSelector(
    (state) => state.auth
  );
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const clientIdBase64 = urlParams.get("client_id");

    if (clientIdBase64) {
      dispatch(fetchProfileFromMagicLink())
        .then((res) => {
          if (res?.success) {
            if (res?.profileData?.active_status === 1) {
              navigate("/sellers/leads");
            } else if (res?.profileData?.active_status === 2) {
              navigate("/buyers/create");
            } else {
            }
          }
        })
        .catch((err) => {
          showToast("error", err.message);
        });
    }
  }, [dispatch, navigate]);

  const handleLogin = (values) => {
    const { email, password } = values;
    dispatch(userLogin({ email, password }))
      .then((result) => {
        if (result?.success) {
          showToast("success", result?.message || "Login successful!");
          if (result?.data?.active_status === 1) {
            navigate("/sellers/leads", { replace: true });
          } else if (result?.data?.active_status === 2) {
            navigate("/buyers/create", { replace: true });
          }
        } else {
          showToast(
            "error",
            result?.message || "Login failed. Please try again."
          );
        }
      })
      .catch((error) => {
        showToast(
          "error",
          error?.response?.data?.message ||
            "An error occurred. Please try again."
        );
      });
  };

  const handlePasswordlessSend = (values) => {
    dispatch(sendPasswordlessLink({ email: values.email }))
      .then((result) => {
        if (result?.success) {
          showToast(
            "success",
            result?.message || "Magic link sent to your email."
          );
        } else {
          showToast("error", result?.message || "Failed to send magic link.");
        }
      })
      .catch((error) => {
        console.error("Passwordless send error:", error);
        showToast(
          "error",
          error?.message || "An error occurred. Please try again."
        );
      });
  };

  const onFinish = (values) => {
    if (passwordless) {
      handlePasswordlessSend(values);
    } else {
      handleLogin(values);
    }
  };

  return (
    <div className="login-container">
      <Helmet>
        <meta name="robots" content="noindex" />
      </Helmet>
      <CalonicalTags isRequiredjsonLd={false}/>
      <div className="login-box">
        <h1 className="login-title">
          {passwordless ? (
            <>
              Passwordless <br /> login
            </>
          ) : (
            "Login"
          )}
        </h1>

        <Form
          name="login"
          initialValues={{ remember: true }}
          requiredMark="optional"
          onFinish={onFinish}
          layout="vertical"
        >
          <TextInput label="Email" name="email" type="email" required />

          {!passwordless && (
            <PasswordInput
              label="Password"
              name="password"
              placeholder="Enter your password"
            />
          )}

          <div className="login-options">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="loginBtn"
              cursor="pointer"
            >
              {passwordless ? (
                passwordlessLoader ? (
                  <Spin
                    indicator={
                      <LoadingOutlined spin style={{ color: "white" }} />
                    }
                  />
                ) : (
                  "Send"
                )
              ) : loginLoader ? (
                <Spin
                  indicator={
                    <LoadingOutlined spin style={{ color: "white" }} />
                  }
                />
              ) : (
                "Login"
              )}
            </Button>
          </Form.Item>

          {!passwordless && (
            <>
              <div className="or-divider">OR</div>
              <Form.Item>
                <Button
                  block
                  className="btnLink"
                  onClick={() => {
                    setPasswordless(true);
                    navigate("/en/gb/passwordless_login");
                  }}
                >
                  Send me a link to log in
                </Button>
              </Form.Item>
            </>
          )}

          {passwordless && (
            <div style={{ textAlign: "left" }}>
              <Text
                style={{ cursor: "pointer", color: "#ABABAB" }}
                onClick={() => {
                  setPasswordless(false);
                  navigate(`/${currentLang}/${currentCountry}/login`);
                }}
              >
                Back to Login
              </Text>
            </div>
          )}
        </Form>
      </div>

      {!passwordless && (
        <div className="bottom-links">
          <Text className="text">
            Offering a service?{" "}
            <Link
              to={`/${currentLang}/${currentCountry}/sellers/create`}
              className="linkText"
            >
              Join as a professional
            </Link>
          </Text>
          <br />
          <Text className="text">
            Looking for a service?{" "}
            <Link to={`/${currentLang}/${currentCountry}/`} className="linkText">
              Get started
            </Link>
          </Text>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
