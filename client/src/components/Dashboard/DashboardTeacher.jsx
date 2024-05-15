import React, { useEffect, useState } from "react";
import axios from "axios";
import Greeting from "../Greetings/Greetings";
import SustainabilityFact from "../Sustainability/SustainabilityFact";
import DateDisplay from "../DateDisplay/DateDisplay";
import TodoList from "../TodoList/TodoList";
import FavouriteClasses from "../FavouriteClasses/FavouriteClasses";
import { useAuth } from "../../context/AuthContext";
import "./Dashboard.css";

function DashboardTeacher() {
  const [classrooms, setClassrooms] = useState([]);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchClassrooms();
    }
  }, [isAuthenticated]);

  const fetchClassrooms = async () => {
    try {
      const response = await axios.get("/api/classrooms");
      setClassrooms(response.data);
    } catch (error) {
      console.error("Error fetching classrooms:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="left-panel">
        <Greeting />

        <div className="sustainability-facts">
          <h2>Today's sustainability fact</h2>
          <SustainabilityFact />
        </div>
        <div className="classrooms">
          <h2>Favourite classrooms</h2>
          <FavouriteClasses
            classrooms={classrooms}
            setClassrooms={setClassrooms}
          />
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

export default DashboardTeacher;
