import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import "./AchievementItem.css";

const AchievementItem = ({ achievement, unlocked }) => (
  <li className={`achievement-item ${unlocked ? "unlocked" : "locked"}`}>
    {unlocked ? (
      <img
        src={achievement.image}
        alt={achievement.name}
        style={{ width: 100, height: "auto" }}
      />
    ) : (
      <FontAwesomeIcon icon={faLock} size="4x" style={{ marginBottom: 10 }} />
    )}
    <strong>{achievement.name}</strong>
    <p>
      {unlocked
        ? achievement.description
        : `To unlock, ${achievement.unlockCriteria}`}
    </p>
  </li>
);

export default AchievementItem;
