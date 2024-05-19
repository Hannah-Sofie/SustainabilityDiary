import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy, faMedal, faAward } from "@fortawesome/free-solid-svg-icons";
import "./LeaderboardItem.css";

// LeaderboardItem component to display individual leaderboard entries
const LeaderboardItem = ({ leader, index }) => {
  // Function to get the appropriate icon based on the position in the leaderboard
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
      {/* Display the rank icon */}
      <div className="leader-rank-icon">{getIcon(index)}</div>
      <div className="leader-info">
        {/* Display the leader's username */}
        <div className="leader-name">{leader.username}</div>
        {/* Display the number of achievements */}
        <div className="leader-achievements">
          {leader.achievementCount} Achievements
        </div>
      </div>
    </li>
  );
};

export default LeaderboardItem;
