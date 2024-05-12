import React from "react";
import Greeting from "../Greetings/Greetings";
import Classes from "../Classes/Classes";
import "./Dashboard.css";

// Need to make hook for fetching data from classes to be used in the dashboard
// This is needed to pass the data to the Classes component like the Classroom component does
// Or else the component wont show any data

function DashboardTeacher() {
  return (
    <div>
      <Greeting />
      <Classes />
      <div className="active-classes"></div>
    </div>
  );
}

export default DashboardTeacher;
