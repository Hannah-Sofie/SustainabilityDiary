import React from "react";
import "./Classes.css";

function Classes() {
  return (
    <div>
      <div className="main-class">
        <section className="container-class">
          <div className="class-box">
            <ul>
              <li className="active">All classes</li>
              <li>Active Classes</li>
              <li>Finished Classes</li>
            </ul>
            <div className="class">
              <div className="box">
                <h3>IDG2100</h3>
                <p>Full-Stack</p>
                <button>Open</button>
                <i className="fab fa-html5 html"></i>
              </div>
              <div className="box">
                <h3>IDG2671</h3>
                <p>Webproject</p>
                <button>Open</button>
                <i className="fab fa-css3-alt css"></i>
              </div>
              <div className="box">
                <h3>IDG2000</h3>
                <p>Design</p>
                <button>Open</button>
                <i className="fab fa-js-square js"></i>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Classes;
