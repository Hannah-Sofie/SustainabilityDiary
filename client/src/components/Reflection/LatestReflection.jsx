import React from "react";
import { Link } from "react-router-dom";
import "./LatestReflection.css";

function LatestReflection({ latestReflection }) {
  return (
    <div className="latest-reflection">
      {latestReflection ? (
        <div className="reflection-content">
          <h3>{latestReflection.title}</h3>
          <p>{latestReflection.body}</p>
          <div className="button-container">
            <Link to="/reflections" className="view-button">
              Go to Reflection
            </Link>
          </div>
        </div>
      ) : (
        <p>No reflections found.</p>
      )}
    </div>
  );
}

export default LatestReflection;
