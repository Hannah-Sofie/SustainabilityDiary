import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ReflectionEntries.css";

function ReflectionEntries() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/reflections`,
          { withCredentials: true }
        );
        setEntries(data);
      } catch (error) {
        console.error("Failed to fetch reflection entries:", error);
        alert("Failed to fetch reflection entries");
      }
    };
    fetchEntries();
  }, []);

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
    <div>
      {entries.map((entry) => (
        <div className="reflection_card" key={entry._id}>
          <div className="reflection_details">
            <div className="img">
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
      ))}
    </div>
  );
}

export default ReflectionEntries;
