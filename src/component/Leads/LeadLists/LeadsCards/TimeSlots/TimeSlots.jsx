import React, { useState } from "react";
import styles from "./TimeSlots.module.css";

const SLOT_LABELS = {
  "09:00 AM - 12:00 PM": "Morning",
  "12:00 PM - 03:00 PM": "Afternoon",
  "03:00 PM - 06:00 PM": "Evening",
};

function TimeSlots({ apiData }) {
  const [showAll, setShowAll] = useState(false);

  const parseTimeSlots = (raw) => {
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return parsed.flatMap((item) =>
        item.slots
          ? item.slots.split(", ").map((slot) => ({
              date: item.date,
              slot: slot.trim(),
            }))
          : [],
      );
    } catch {
      return [];
    }
  };

  const allSlots = parseTimeSlots(apiData?.time_slots);

  const visibleSlots = showAll ? allSlots : allSlots.slice(0, 3);
  const remainingCount = allSlots.length - 3;

  return (
    <div className={styles.slotContainer}>
      {visibleSlots.map(({ date, slot }) => {
        const label = SLOT_LABELS[slot] || slot;
        const monthDay = new Date(date + "T00:00:00").toLocaleDateString(
          "en-GB",
          {
            day: "numeric",
            month: "long",
          },
        );

        return (
          <div key={date + slot} className={styles.slotChip}>
            {label} - {monthDay}
          </div>
        );
      })}

      {showAll ? (
        <button className={styles.moreBtn} onClick={() => setShowAll(false)}>
          Show Less
        </button>
      ) : (
        remainingCount > 0 && (
          <button className={styles.moreBtn} onClick={() => setShowAll(true)}>
            +{remainingCount} More
          </button>
        )
      )}
    </div>
  );
}

export default TimeSlots;
