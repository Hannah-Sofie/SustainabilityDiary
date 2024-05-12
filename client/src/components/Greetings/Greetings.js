import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "./Greetings.css";

function Greeting() {
  const { userData } = useAuth();
  const [hovered, setHovered] = useState(false);

  // Determine the part of the day
  const getPartOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "morning";
    if (hour < 18) return "afternoon";
    return "evening";
  };

  const partOfDay = getPartOfDay();
  const greeting = `Good ${partOfDay}, ${userData?.name || "Guest"}!`;

  return (
    <h1 className="greetingStyle">
      {greeting}{" "}
      <span
        className={`waveEmoji ${hovered ? "animated" : ""}`}
        onMouseEnter={() => setHovered(true)}
        onAnimationEnd={() => setHovered(false)}
        role="img"
        aria-label="Hand Wave"
      >
        👋
      </span>
    </h1>
  );
}

export default Greeting;
