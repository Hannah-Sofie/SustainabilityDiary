import React from "react";
import Greeting from "../Greetings/Greetings";
import Classes from "../Classes/Classes";
import "./Dashboard.css";

function DashboardTeacher() {
  return (
    <div>
      <Greeting />
      <div className="active-classes">
        <Classes />
      </div>
    </div>
  );
}

export default DashboardTeacher;
