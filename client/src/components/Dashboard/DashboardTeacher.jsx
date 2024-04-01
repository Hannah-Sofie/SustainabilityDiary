import React from "react";
import Greeting from "../Greetings/Greetings";
import Classes from "../Classes/Classes";
import "./Dashboard.css";

function DashboardTeacher() {
  return (
    <div>
      <Greeting />
      <div className="active-classes">
        <h2>Your classes</h2>
        <Classes />
      </div>
    </div>
  );
}

export default DashboardTeacher;
