import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy, faMedal, faAward } from "@fortawesome/free-solid-svg-icons";
import "./LeaderboardItem.css";

const LeaderboardItem = ({ leader, index }) => {
  const getIcon = (position) => {
    switch (position) {
      case 0:
        return <FontAwesomeIcon icon={faTrophy} className="gold-trophy" />;
      case 1:
        return <FontAwesomeIcon icon={faMedal} className="silver-medal" />;
      case 2:
        return <FontAwesomeIcon icon={faAward} className="bronze-award" />;
      default:
        return <span className="rank">{position + 1}</span>;
    }
  };

  return (
    <li className="leader-item">
      <div className="leader-rank-icon">{getIcon(index)}</div>
      <div className="leader-info">
        <div className="leader-name">{leader.username}</div>
        <div className="leader-achievements">
          {leader.achievementCount} Achievements
        </div>
      </div>
    </li>
  );
};

export default LeaderboardItem;
