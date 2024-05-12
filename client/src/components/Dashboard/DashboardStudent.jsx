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
    <div className="dashboard-container">
      <div className="left-panel">
        <Greeting />

        <div className="sustainability-facts">
          <h2>Today's Sustainability Fact</h2>
          <SustainabilityFact />
        </div>
        <div className="reflection">
          <h2>Latest Reflection</h2>
          <LatestReflection latestReflection={latestReflection} />
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
