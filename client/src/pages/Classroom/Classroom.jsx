import React, { useState, useEffect } from "react";
import axios from "axios";
import Classes from "../../components/Classes/Classes";
import PublicReflections from "../../components/Reflection/PublicReflections";
import CreateClassroom from "../../components/Classroom/CreateClassroom";
import { useAuth } from "../../context/AuthContext";
import LoadingIndicator from "../../components/LoadingIndicator/LoadingIndicator";
import "./Classroom.css";

function Classroom() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [classrooms, setClassrooms] = useState([]);
  const { isAuthenticated, loading } = useAuth();

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

  const handleNewClassroom = (newClassroom) => {
    setClassrooms([...classrooms, newClassroom]);
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="main-classroom">
      <h1>Classrooms</h1>
      <div className="button-container">
        <button onClick={() => setIsModalOpen(true)}>
          + Create New Classroom
        </button>
      </div>
      <Classes classrooms={classrooms} />
      <h1>Public Reflections</h1>
      <PublicReflections />
      {isModalOpen && (
        <CreateClassroom
          closeModal={() => setIsModalOpen(false)}
          onNewClassroom={handleNewClassroom}
        />
      )}
    </div>
  );
}

export default Classroom;
