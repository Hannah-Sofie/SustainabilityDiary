import React from "react";
import "./DateDisplay.css";

const DateDisplay = () => {
  // Get current date and time
  const currentDate = new Date();
  const day = currentDate.toLocaleDateString("en-US", { weekday: "long" });
  const month = currentDate.toLocaleDateString("en-US", { month: "long" });
  const date = currentDate.getDate();

  return (
    <time dateTime={currentDate.toISOString()} className="date-icon">
      <em>{day}</em>
      <strong>{month}</strong>
      <span>{date}</span>
    </time>
  );
};

export default DateDisplay;
