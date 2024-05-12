import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import "./DateDisplay.css";

function DateDisplay() {
  const formatDate = (dateString) => {
    const options = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <div className="date-container">
      <FontAwesomeIcon icon={faCalendarAlt} />
      <span>{formatDate(new Date())}</span>
    </div>
  );
}

export default DateDisplay;
