import React, { useEffect, useState } from "react";
import axios from "axios";
import Greeting from "../Greetings/Greetings";
import SustainabilityFact from "../Sustainability/SustainabilityFact";
import DateDisplay from "../DateDisplay/DateDisplay";
import TodoList from "../TodoList/TodoList";
import "./Dashboard.css";

function DashboardStudent() {
  return (
    <div className="dashboard-container">
      <div className="left-panel">
        <Greeting />

        <div className="sustainability-facts">
          <h2>Today's Sustainability Fact</h2>
          <SustainabilityFact />
        </div>
        <div className="classrooms">
          <h2>Your Classrooms</h2>
          {/* Add your classrooms component here */}
        </div>
      </div>
      <div className="right-panel">
        <div className="date-display">
          <DateDisplay />
        </div>
        <TodoList />
      </div>
    </div>
  );
}

export default DashboardStudent;
