import styles from "./stats.module.css";

const StatsCard = ({
  counts,
  description = "",
  pl = "0px",
  pr = "0px",
  borderRight = "2px solid #00AFE3",
}) => {
  return (
    <div
      className={styles.statsWrapper}
      style={{
        borderRight,
        paddingLeft: pl,
        paddingRight: pr,
      }}
    >
      <div className={styles.numberText}>{counts}</div>
      <div className={styles.descriptionText}>{description}</div>
    </div>
  );
};

const Stats = () => {
  const statsData = [
    {
      counts: "48,000+",
      description: "Active Service Professionals",
      pr: "50px",
    },
    {
      counts: "13 Million+",
      description: "Daily Bookings",
      pr: "52px",
      pl: "50px",
    },
    {
      counts: "59+",
      description: "Cities**",
      pr: "50px",
      pl: "50px",
    },
    {
      counts: "4",
      description: "Countries",
      pl: "50px",
      pr: "50px",
      borderRight: "none",
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.frameContainer}>
        {statsData.map((stat, index) => (
          <StatsCard
            key={index}
            counts={stat.counts}
            description={stat.description}
            pr={stat.pr}
            borderRight={stat.borderRight}
          />
        ))}
      </div>
    </div>
  );
};

export default Stats;
