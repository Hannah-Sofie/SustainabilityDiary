import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./Achievements.css";
import { useAuth } from "../../context/AuthContext";
import LoadingIndicator from "../../components/LoadingIndicator/LoadingIndicator";
import CustomButton from "../../components/CustomButton/CustomButton";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AchievementItem from "../../components/Achievements/AchievementItem";
import LeaderboardItem from "../../components/Achievements/LeaderboardItem";
import { faSignInAlt, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

const Achievements = () => {
  const { isAuthenticated, userData } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [leaders, setLeaders] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [error, setError] = useState("");
  const [isOptedIn, setIsOptedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch achievements from the server
  const fetchAchievements = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/achievements/all`,
        {
          headers: { Authorization: `Bearer ${userData.token}` },
        }
      );
      setAchievements(data);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      setError("Failed to fetch achievements. Please try again.");
    }
  }, [userData.token]);

  // Fetch leaderboard data from the server
  const fetchLeaderboard = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/achievements/leaderboard`,
        {
          headers: { Authorization: `Bearer ${userData.token}` },
        }
      );

      // Extract top 5 leaders
      const topLeaders = data.slice(0, 5);
      setLeaders(topLeaders);

      // Find the current user's rank
      const userRankIndex = data.findIndex(
        (leader) => leader.userId === userData._id
      );

      if (userRankIndex >= 5) {
        setUserRank(data[userRankIndex]);
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  }, [userData.token, userData._id]);

  // Fetch opt-in status for the leaderboard
  const fetchOptInStatus = useCallback(async () => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/achievements/opt-in-status`,
        {},
        {
          headers: { Authorization: `Bearer ${userData.token}` },
        }
      );
      setIsOptedIn(data.isInLeaderboard);
    } catch (error) {
      console.error("Error fetching opt-in status:", error);
    }
  }, [userData.token]);

  // Toggle opt-in status for the leaderboard
  const toggleOptIn = async () => {
    try {
      const url = isOptedIn
        ? `${process.env.REACT_APP_API_URL}/api/achievements/opt-out`
        : `${process.env.REACT_APP_API_URL}/api/achievements/opt-in`;
      const { data } = await axios.post(
        url,
        {},
        {
          headers: { Authorization: `Bearer ${userData.token}` },
        }
      );
      setIsOptedIn(data.isInLeaderboard);
      toast.success(
        `Successfully ${
          isOptedIn ? "opted out of" : "opted into"
        } the leaderboard.`
      );
      fetchLeaderboard();
    } catch (error) {
      console.error("Error toggling leaderboard opt-in status:", error);
      toast.error(
        `Failed to ${
          isOptedIn ? "opt out of" : "opt in to"
        } the leaderboard due to an error.`
      );
    }
  };

  // Effect to fetch data when the component mounts and when dependencies change
  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      Promise.all([fetchAchievements(), fetchLeaderboard(), fetchOptInStatus()])
        .then(() => setLoading(false))
        .catch(() => {
          setLoading(false);
          setError("Failed to fetch data. Please try again.");
        });
    }
  }, [isAuthenticated, fetchAchievements, fetchLeaderboard, fetchOptInStatus]);

  // Separate unlocked and locked achievements
  const unlockedAchievements = achievements.filter((ach) => ach.unlocked);
  const lockedAchievements = achievements.filter((ach) => !ach.unlocked);

  return (
    <div className="achievements-container">
      {loading ? (
        <LoadingIndicator />
      ) : (
        <>
          <section className="leaderboard-main">
            <div className="leaderboard-content">
              <h1 className="leaderboard-title">Top 5 Achievers</h1>
              {leaders.length > 0 ? (
                <ol className="leaderboard-list">
                  {leaders.map((leader, index) => (
                    <LeaderboardItem
                      key={index}
                      leader={leader}
                      index={index}
                    />
                  ))}
                  {userRank && (
                    <>
                      <li className="leader-item dots">...</li>
                      <LeaderboardItem
                        key={userRank.userId}
                        leader={userRank}
                        index={userRank.rank - 1}
                      />
                    </>
                  )}
                </ol>
              ) : (
                <p>No leaderboard data available.</p>
              )}
              <CustomButton
                name={
                  isOptedIn ? "Opt-Out of Leaderboard" : "Opt-In to Leaderboard"
                }
                onClick={toggleOptIn}
                icon={isOptedIn ? faSignOutAlt : faSignInAlt}
                backgroundColor="#FFD700"
                color="#333"
                hoverBackgroundColor="#FFEC8B"
                hoverColor="#333"
                hoverBorderColor="#FFD700"
                style={{
                  borderRadius: "25px",
                  padding: "10px 20px",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              />
            </div>
          </section>
          <section className="achievements-main">
            <div className="achievements-content">
              {error && <p className="achievements-error">{error}</p>}
              <h1 className="achievements-title">Unlocked Achievements</h1>
              {unlockedAchievements.length > 0 ? (
                <ul className="achievements-list">
                  {unlockedAchievements.map((achievement) => (
                    <AchievementItem
                      key={achievement.name}
                      achievement={achievement}
                      unlocked={achievement.unlocked}
                    />
                  ))}
                </ul>
              ) : (
                <p>No achievements to display.</p>
              )}
              <h1 className="achievements-title">Locked Achievements</h1>
              {lockedAchievements.length > 0 ? (
                <ul className="achievements-list">
                  {lockedAchievements.map((achievement) => (
                    <AchievementItem
                      key={achievement.name}
                      achievement={achievement}
                      unlocked={achievement.unlocked}
                    />
                  ))}
                </ul>
              ) : (
                <p>All achievements unlocked!</p>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Achievements;
