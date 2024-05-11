import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Achievements.css";
import { useAuth } from "../../context/AuthContext";
import LoadingIndicator from "../../components/LoadingIndicator/LoadingIndicator";
import CustomButton from "../../components/CustomButton/CustomButton";

const Achievements = () => {
    const { isAuthenticated, userData, loading } = useAuth();
    const [achievements, setAchievements] = useState([]);
    const [error, setError] = useState('');

    const fetchAchievements = async () => {
        if (!isAuthenticated) {
            setError('Authentication error. Please log in.');
            return;
        }
    
        try {
            const response = await axios.get("/api/achievements", {
                headers: { Authorization: `Bearer ${userData.token}` },
            });
            if (response.status === 200) {
                setAchievements(response.data);
            } else {
                setError('Failed to fetch achievements. Please try again.');
            }
        } catch (error) {
            console.error("Error fetching achievements:", error);
            setError('Failed to fetch achievements. Please try again.');
        }
    };
    

    useEffect(() => {
        const fetchAchievements = async () => {
          if (!isAuthenticated) {
            console.error('User is not authenticated');
            setError('Authentication error. Please log in.');
            return;
          }
        
          try {
            const response = await axios.get("/api/achievements", {
              headers: {
                Authorization: `Bearer ${userData.token}`,
              },
            });
            setAchievements(response.data);
          } catch (error) {
            console.error("Error fetching achievements:", error);
            setError('Failed to fetch achievements. Please try again.');
          }
        };
        if (isAuthenticated) {
          fetchAchievements();
        }
      }, [isAuthenticated, userData.token]); // Now fetchAchievements is inside useEffect and uses the dependencies directly
      

    if (loading) {
        return <LoadingIndicator />;
    }

    if (!isAuthenticated) {
        return <div>Please log in to view your achievements.</div>;
    }

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
                            <strong>{achievement.name}</strong> - {achievement.description}
                            <img src={achievement.image} alt={achievement.name} style={{ width: 100, height: 'auto' }}/>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No achievements to display.</p>
            )}
        </div>
    </section>
</div>

    );
}
export default Achievements;
