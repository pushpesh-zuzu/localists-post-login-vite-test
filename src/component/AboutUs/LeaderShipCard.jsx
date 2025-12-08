import React from "react";
import { LinkedinFilled } from "@ant-design/icons";
import styles from "./leadershipcard.module.css";
import WithBlueTextBlack from "../common/headings/WithBlueTextBlack";

const XIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LeadershipCard = ({ name, position, imageUrl, linkedinUrl, xUrl }) => {
  return (
    <div className={styles.card}>
      <div className={styles.profileImage}>
        <img src={imageUrl} alt={name} className={styles.profileImageImg} />
      </div>
      <h3 className={styles.name}>{name}</h3>
      <p className={styles.position}>{position}</p>
    </div>
  );
};

const LeadershipTeam = () => {
  const teamData = [
    {
      id: 1,
      name: "Michael Marshall",
      position: "Director",
      imageUrl:
        "https://internetmediagroupltd.com/wp-content/uploads/2025/08/cartoon-man-with-glasses-orange-backpack-photorealistic-portraits-unreal-engine-5.png",
      linkedinUrl: "#",
      xUrl: "#",
    },
    {
      id: 1,
      name: "Nathan O'Connor",
      position: "Director",
      imageUrl:
        "https://internetmediagroupltd.com/wp-content/uploads/2025/08/png-hispanic-man-portrait-cartoon-adult.png",
      linkedinUrl: "#",
      xUrl: "#",
    },
    {
      id: 1,
      name: "Danny Browne",
      position: "SEO Manager",
      imageUrl:
        "https://internetmediagroupltd.com/wp-content/uploads/2025/08/3d-male-cartoon-character-progress-concept-illustration.png",
      linkedinUrl: "#",
      xUrl: "#",
    },
    {
      id: 1,
      name: "John Driffield",
      position: "Paid Advertising Manager",
      imageUrl: "/John.jpg",
      linkedinUrl: "#",
      xUrl: "#",
    },
  ];

  return (
    <div className={styles.teamContainer}>
      <div style={{ marginBottom: "20px" }}>
        <WithBlueTextBlack firstblueText="Our Leadership" secondText="Team" />
      </div>
      <div className={styles.cardsGrid}>
        {teamData.map((member) => (
          <LeadershipCard
            key={member.id}
            name={member.name}
            position={member.position}
            imageUrl={member.imageUrl}
            linkedinUrl={member.linkedinUrl}
            xUrl={member.xUrl}
          />
        ))}
      </div>
    </div>
  );
};

export default LeadershipTeam;
