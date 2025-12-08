import { MailOutlined } from "@ant-design/icons";
import styles from "./getintouch.module.css";
import WithBlueTextBlack from "../common/headings/WithBlueTextBlack";

const contactMethods = [
  {
    id: 1,
    icon: (
      <MailOutlined
        style={{ fontSize: "32px", color: "#00AFE3" }}
        className={styles.icon}
      />
    ),
    text: "contact@localists.com",
    href: "mailto:contact@localists.com",
  },
];

const GetInTouchButton = () => {
  return (
    <div className={styles.container}>
      <WithBlueTextBlack
        secondText="Get"
        firstblue={false}
        firstblueText="in touch"
      />

      <div className={styles.buttonsContainer}>
        {contactMethods.map((method) => (
          <a
            key={method.id}
            className={styles.button}
            href={method.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {method.icon}
            <span>{method.text}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default GetInTouchButton;
