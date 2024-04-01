import React from "react";
import "./ReflectionEntries.css";

function SingleReflectionEntry({ entry }) {
  // Function to format date
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to truncate text
  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  return (
    <div className="reflection_card">
      <div className="reflection_details">
        <div className="img">
          {/* Placeholder for an icon or image */}
          <i className="fab fa-google-drive"></i>
        </div>
        <div className="text">
          <h3>{entry.title}</h3>
          <p>{truncateText(entry.body, 50)}</p> {/* Truncate body text */}
        </div>
      </div>
      <div className="reflection_date">
        <p>
          <span>Created at:</span> {formatDate(entry.createdAt)}
        </p>
        <p>
          <span>Updated at:</span> {formatDate(entry.updatedAt)}
        </p>
      </div>
    </div>
  );
}

export default SingleReflectionEntry;
