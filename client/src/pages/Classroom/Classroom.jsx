import React from "react";
import Classes from "../../components/Classes/Classes";
import "./Classroom.css";
import PublicReflections from "../../components/Reflection/PublicReflections";

function Classroom() {
  return (
    <div>
      <div className="main-classroom">
        <h1>Classrooms</h1>
        <Classes />
        <h1>Public Reflections</h1>
        <PublicReflections />
      </div>
    </div>
  );
}

export default Classroom;
