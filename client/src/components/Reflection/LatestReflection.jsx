import React from "react";
import "./LatestReflection.css";

function LatestReflection({ latestReflection }) {
  return (
    <div className="latest-reflection">
      <h2>Latest Reflection</h2>
      {latestReflection ? (
        <div className="reflection-content">
          <h3>{latestReflection.title}</h3>
          <p>{latestReflection.body}</p>
        </div>
      ) : (
        <p>No reflections found.</p>
      )}
    </div>
  );
}

export default LatestReflection;
