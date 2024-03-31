import React from "react";
import "./Reflection.css";

function Reflections() {
  return (
    <div>
      <div className="main-reflection">
        <section className="container-reflection">
          <h1>My Reflections</h1>
          <div className="reflection-box">
            <ul>
              <li className="active">In progress</li>
              <li>Explore</li>
              <li>Incoming</li>
              <li>Finished</li>
            </ul>
            <div className="reflection">
              <div className="box">
                <h3>HTML</h3>
                <p>80% - progress</p>
                <button>Continue</button>
                <i className="fab fa-html5 html"></i>
              </div>
              <div className="box">
                <h3>CSS</h3>
                <p>50% - progress</p>
                <button>Continue</button>
                <i className="fab fa-css3-alt css"></i>
              </div>
              <div className="box">
                <h3>JavaScript</h3>
                <p>30% - progress</p>
                <button>Continue</button>
                <i className="fab fa-js-square js"></i>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Reflections;
