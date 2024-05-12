// DashboardStudent.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import Greeting from "../Greetings/Greetings";
import LatestReflection from "../Reflection/LatestReflection";
import SustainabilityFact from "../Sustainability/SustainabilityFact";
import DateDisplay from "../DateDisplay/DateDisplay";
import TodoList from "../TodoList/TodoList";
import "./Dashboard.css";

function DashboardStudent() {
  const [latestReflection, setLatestReflection] = useState(null);

  useEffect(() => {
    const fetchLatestReflection = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/reflections/latest`,
          { withCredentials: true }
        );
        setLatestReflection(data);
      } catch (error) {
        console.error("Failed to fetch latest reflection:", error);
      }
    };

    fetchLatestReflection();
  }, []);

  return (
    <div>
      <Greeting />
      <DateDisplay />
      <TodoList />
      <h2>Today's Sustainability Fact</h2>
      <SustainabilityFact />
      <div className="active-classes">
        <h2>Your classrooms</h2>
      </div>
      <div className="reflection-latest">
        <h2>Latest Reflection</h2>
        <LatestReflection latestReflection={latestReflection} />
      </div>
    </div>
  );
}

export default DashboardStudent;
