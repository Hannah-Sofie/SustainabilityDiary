import React from "react";
import { Link } from "react-router-dom";
import "./Reflection.css";

function Reflections() {
  return (
    <div>
      <section className="main-reflection">
        <div className="container-reflection">
          <h1>Reflections</h1>

          <div className="search_bar">
            <input
              type="search"
              placeholder="Search reflections here..."
            ></input>
            <select name="" id="">
              <option>Category</option>
              <option>Web Design</option>
              <option>App Design</option>
              <option>App Development</option>
            </select>
            <select className="filter">
              <option>Filter</option>
            </select>
          </div>

          <div className="row-reflections">
            <p>
              You have <span>4</span> reflections in total
            </p>
            {/* Link component used for routing in React */}
            <Link to="#">See all</Link>
          </div>

          {/* Repeated job card structure for each job */}
          <div className="reflection_card">
            <div className="reflection_details">
              <div className="img">
                <i className="fab fa-google-drive"></i>
              </div>
              <div className="text">
                <h2>UX Designer</h2>
                <span>Google Drive - Junior Post</span>
              </div>
            </div>
            <div className="reflection_salary">
              <h4>$6.7 - $12.5k /yr</h4>
              <span>1 days ago</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Reflections;
