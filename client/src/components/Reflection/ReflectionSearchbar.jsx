import React from "react";
import "./ReflectionSearchbar.css";

function ReflectionSearchbar() {
  return (
    <div>
      <div className="search_bar">
        <input type="search" placeholder="Search reflections here..."></input>
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
    </div>
  );
}

export default ReflectionSearchbar;
