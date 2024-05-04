import React, { useEffect, useState } from "react";
import axios from "axios";
import Greeting from "../Greetings/Greetings";
import LatestReflection from "../Reflection/LatestReflection";
import SustainabilityFact from "../Sustainability/SustainabilityFact";
import "./Dashboard.css";

function DashboardStudent() {
  const [latestReflection, setLatestReflection] = useState(null);

  useEffect(() => {
    const fetchLatestReflection = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/reflections/latest`,
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
      <SustainabilityFact />
      <div className="active-classes">
        <h2>Your classrooms</h2>
      </div>
      <LatestReflection latestReflection={latestReflection} />
    </div>
  );
}

export default DashboardStudent;
