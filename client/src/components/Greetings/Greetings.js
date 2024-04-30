import React from "react";
import { useAuth } from "../../context/AuthContext.js";
import "./Greetings.css";

function Greeting() {
  const { userData } = useAuth();

  // Determine the part of the day
  const getPartOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "morning";
    if (hour < 18) return "afternoon";
    return "evening";
  };

  const partOfDay = getPartOfDay();
  const greeting = `Good ${partOfDay}, ${userData?.name || "Guest"}!`;

  return <h1 className="greetingStyle">{greeting}</h1>;
}

export default Greeting;
