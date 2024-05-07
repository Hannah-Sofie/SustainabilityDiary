import React from "react";
import { Link } from "react-router-dom";
import "./Classes.css";
import DefaultImage from "../../assets/img/default-classroom.png";

// Replace with your environment variable or direct API URL if not using env variables.
const baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function Classes({ classrooms }) {
  if (!classrooms || !classrooms.length) {
    return (
      <div className="no-classrooms">
        No classrooms available or still loading...
      </div>
    );
  }

  return (
    <div className="main-class">
      <section className="container-class">
        <div className="class-box">
          <ul className="class-filter">
            <li className="active">All classes</li>
            <li>Active Classes</li>
            <li>Finished Classes</li>
          </ul>
          <div className="class">
            {classrooms.map((classroom, index) => {
              // Use the baseURL with the classroom's `iconPhotoUrl`
              const iconUrl = classroom.iconPhotoUrl
                ? `${baseURL}${classroom.iconPhotoUrl}`
                : DefaultImage;

              return (
                <div key={index} className="box">
                  <img
                    src={iconUrl}
                    alt={classroom.title}
                    className="classroom-icon"
                  />
                  <h3>{classroom.title}</h3>
                  <p>{classroom.description}</p>
                  <Link
                    to={`/classroom/${classroom._id}`}
                    className="button-link"
                  >
                    Open
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Classes;
