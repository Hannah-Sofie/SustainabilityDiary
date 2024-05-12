import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "./Greetings.css";

function Greeting() {
  const { userData } = useAuth();
  const [hovered, setHovered] = useState(false);

  // Determine the part of the day
  const getPartOfDay = () => {
    const hour = new Date().getHours();
    return hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
  };

  const partOfDay = getPartOfDay();
  const greetingText = `Good ${partOfDay},`;
  const username = userData?.name || "Guest";

  return (
    <div className="dashboard-greeting">
      <h1 className="greetingStyle">
        {greetingText} <span className="username">{username}</span>
        <span
          className={` waveEmoji ${hovered ? "animated" : ""}`}
          onMouseEnter={() => setHovered(true)}
          onAnimationEnd={() => setHovered(false)}
          role="img"
          aria-label="Hand Wave"
        >
          👋
        </span>
      </h1>
      <p className="greetingStyle">Welcome to your dashboard!</p>
    </div>
  );
}

export default Greeting;
