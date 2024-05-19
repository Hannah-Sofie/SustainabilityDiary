import React, { useEffect, useState } from "react";
import axios from "axios";
import Greeting from "../Greetings/Greetings";
import LatestReflection from "../Reflection/LatestReflection";
import SustainabilityFact from "../Sustainability/SustainabilityFact";
import DateDisplay from "../DateDisplay/DateDisplay";
import TodoList from "../TodoList/TodoList";
import FavouriteClasses from "../FavouriteClasses/FavouriteClasses";
import { useAuth } from "../../context/AuthContext";
import "./Dashboard.css";

function DashboardStudent() {
  const [latestReflection, setLatestReflection] = useState(null);
  const [classrooms, setClassrooms] = useState([]);
  const { isAuthenticated } = useAuth();

  // Fetch classrooms when the user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchClassrooms();
    }
  }, [isAuthenticated]);

  // Function to fetch classrooms data from the server
  const fetchClassrooms = async () => {
    try {
      const response = await axios.get("/api/classrooms");
      setClassrooms(response.data);
    } catch (error) {
      console.error("Error fetching classrooms:", error);
    }
  };

  // Fetch the latest reflection on component mount
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
      <div className="panel-container">
        {/* Left Panel */}
        <div className="left-panel">
          <Greeting />

          <div className="sustainability-facts">
            <h2>Today's sustainability fact</h2>
            <SustainabilityFact />
          </div>

          <div className="reflection">
            <h2>Latest reflection</h2>
            <LatestReflection latestReflection={latestReflection} />
          </div>
        </div>

        {/* Right Panel */}
        <div className="right-panel">
          <div className="date-display">
            <DateDisplay />
          </div>
          <TodoList />
        </div>
      </div>

      {/* Favourite Classrooms Section */}
      <div className="classrooms">
        <h2>Favourite classrooms</h2>
        <FavouriteClasses classrooms={classrooms} setClassrooms={setClassrooms} />
      </div>
    </div>
  );
}

export default DashboardStudent;
