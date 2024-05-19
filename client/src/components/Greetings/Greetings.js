import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "./Greetings.css";

function Greeting() {
  const { userData } = useAuth(); // Get user data from AuthContext
  const [hovered, setHovered] = useState(false); // State to track if the emoji is hovered

  // Determine the part of the day based on the current hour
  const getPartOfDay = () => {
    const hour = new Date().getHours();
    return hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
  };

  const partOfDay = getPartOfDay(); // Get current part of the day
  const greetingText = `Good ${partOfDay},`; // Construct greeting text
  const username = userData?.name || "Guest"; // Get the username or default to "Guest"

  return (
    <div className="dashboard-greeting">
      <h1 className="greetingStyle">
        {greetingText} <span className="username">{username}</span>
        <span
          className={`waveEmoji ${hovered ? "animated" : ""}`}
          onMouseEnter={() => setHovered(true)} // Set hovered state to true on mouse enter
          onAnimationEnd={() => setHovered(false)} // Reset hovered state after animation ends
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
