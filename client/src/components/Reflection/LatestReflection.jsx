import React from "react";
import { Link } from "react-router-dom";
import DefaultImage from "../../assets/img/default-image.jpg";
import "./LatestReflection.css";

function LatestReflection({ latestReflection }) {
  return (
    <div className="latest-reflection">
      {latestReflection ? (
        <div className="reflection-content">
          <div className="image">
            <img
              src={
                latestReflection.photo
                  ? `${process.env.REACT_APP_API_URL}/uploads/reflections/${latestReflection.photo}`
                  : DefaultImage
              }
              alt="Reflection"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="text">
            <h3>{latestReflection.title}</h3>
            <p>{latestReflection.body}</p>
          </div>
        </div>
      ) : (
        <p>No reflections found.</p>
      )}
      {latestReflection && (
        <div className="view-button-container">
          <Link to="/reflections" className="view-button">
            View all reflections <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
      )}
    </div>
  );
}

export default LatestReflection;
