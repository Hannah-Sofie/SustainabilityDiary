import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Achievements.css";
import { useAuth } from "../../context/AuthContext";
import LoadingIndicator from "../../components/LoadingIndicator/LoadingIndicator";
import CustomButton from "../../components/CustomButton/CustomButton";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Achievements = () => {
  const { isAuthenticated, userData } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [leaders, setLeaders] = useState([]);
  const [error, setError] = useState("");
  const [isOptedIn, setIsOptedIn] = useState(false);

  // Function to fetch achievements and leaderboard data
  const fetchAchievements = async () => {
    try {
      const { data } = await axios.get("/api/achievements", {
        headers: { Authorization: `Bearer ${userData.token}` },
      });
      setAchievements(data);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      setError("Failed to fetch achievements. Please try again.");
    }
  };

  const fetchLeaderboard = async () => {
    try {
        const response = await axios.get("/api/achievements/leaderboard", {
            headers: { Authorization: `Bearer ${userData.token}` }
        });
        if (response.status === 200) {
            // Sort the data by achievement count in descending order
            const sortedLeaders = response.data.sort((a, b) => b.achievementCount - a.achievementCount);
            setLeaders(sortedLeaders);
        } else {
            console.error('Failed to fetch leaderboard');
        }
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
    }
};

const toggleOptIn = async () => {
  try {
      const url = isOptedIn ? "/api/achievements/opt-out" : "/api/achievements/opt-in";
      const response = await axios.post(url, {}, {
          headers: { Authorization: `Bearer ${userData.token}` },
      });
      if (response.data.isInLeaderboard !== isOptedIn) {
          setIsOptedIn(!isOptedIn); // Toggle the state
          fetchAchievements(); // Refresh data if necessary
          fetchLeaderboard(); // Refresh leaderboard data
          toast.success(`Successfully ${isOptedIn ? "opted out of" : "opted into"} the leaderboard.`);
      } else {
          toast.error(`Failed to ${isOptedIn ? "opt out of" : "opt in to"} the leaderboard.`);
      }
  } catch (error) {
      console.error("Error toggling leaderboard opt-in status:", error);
      toast.error(`Failed to ${isOptedIn ? "opt out of" : "opt in to"} the leaderboard due to an error.`);
  }
};


  // Fetch achievements on mount and auth state change
  useEffect(() => {
    const fetchData = async () => {
        if (!isAuthenticated) {
            return;
        }
    
        try {
            const achievementsResponse = await axios.get("/api/achievements", {
                headers: { Authorization: `Bearer ${userData.token}` },
            });
            if (achievementsResponse.status === 200) {
                setAchievements(achievementsResponse.data);
            } else {
                setError('Failed to fetch achievements. Please try again.');
            }

            if (isAuthenticated) {
                fetchAchievements();
                fetchLeaderboard(); 
              }

            if (isOptedIn) {
                const leaderboardResponse = await axios.get("/api/achievements/leaderboard", {
                    headers: { Authorization: `Bearer ${userData.token}` },
                });
                if (leaderboardResponse.status === 200) {
                    setLeaders(leaderboardResponse.data);
                } else {
                    console.error('Failed to fetch leaderboard data.');
                }
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setError('Failed to fetch data. Please try again.');
        }
    };

    fetchData();
}, [isAuthenticated, userData.token, isOptedIn]);

  return (
    <div className="achievements-container">
      <section className="achievements-main">
        <div className="achievements-content">
          {error && <p className="achievements-error">{error}</p>}
          <h1 className="achievements-title">Your Achievements</h1>
          {achievements.length > 0 ? (
            <ul className="achievements-list">
              {achievements.map((achievement, index) => (
                <li key={index} className="achievement-item">
                  <strong>{achievement.name}</strong> -{" "}
                  {achievement.description}
                  <img
                    src={achievement.image}
                    alt={achievement.name}
                    style={{ width: 100, height: "auto" }}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p>No achievements to display.</p>
          )}
        </div>
      </section>
      <section className="leaderboard-main">
        <div className="leaderboard-content">
    <CustomButton 
    name={isOptedIn ? "Opt-Out of Leaderboard" : "Opt-In to Leaderboard"} 
    onClick={toggleOptIn} 
    backgroundColor={isOptedIn ? "red" : "var(--darker-blue)"} 
    color={isOptedIn ? "var(--darker-blue)" : "var(--green)"} 
/>
<h1 className="leaderboard-title">Leaderboard</h1>
                {leaders.length > 0 ? (
                    <ol className="leaderboard-list">
                        {leaders.map((leader, index) => (
                            <li key={index} className="leader-item">
                                <strong>{index + 1}. {leader.username}</strong> {leader.achievementCount} Achievements
                            </li>
                        ))}
                    </ol>
                ) : (
                    <p>No leaderboard data available.</p>
                )}
        </div>
      </section>
    </div>
  );
};

export default Achievements;
