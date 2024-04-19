import React from "react";
import "./Classes.css";
import DefaultImage from "../../assets/img/default-classroom.png";

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
            {classrooms.map((classroom, index) => (
              <div key={index} className="box">
                <img
                  src={classroom.photoUrl || DefaultImage}
                  alt={classroom.title}
                  className="classroom-icon"
                />
                <h3>{classroom.title}</h3>
                <p>{classroom.description}</p>
                <button>Open</button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Classes;
