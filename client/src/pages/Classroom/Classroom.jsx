import React, { useState, useEffect } from "react";
import axios from "axios";
import Classes from "../../components/Classes/Classes";
import CreateClassroom from "../../components/Classroom/CreateClassroom";
import JoinClassroom from "../../components/Classroom/JoinClassroom";
import { useAuth } from "../../context/AuthContext";
import LoadingIndicator from "../../components/LoadingIndicator/LoadingIndicator";
import "./Classroom.css";

function Classroom() {
  // State for managing the modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  // State for storing the list of classrooms
  const [classrooms, setClassrooms] = useState([]);
  // Access authentication status and user data from the Auth context
  const { isAuthenticated, userData, loading } = useAuth();

  // Fetch classrooms when the user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchClassrooms();
    }
  }, [isAuthenticated]);

  // Function to fetch classrooms from the server
  const fetchClassrooms = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/classrooms`
      );
      setClassrooms(response.data);
    } catch (error) {
      console.error("Error fetching classrooms:", error);
    }
  };

  // Handle the addition of a new classroom
  const handleNewClassroom = (newClassroom) => {
    setClassrooms([...classrooms, newClassroom]);
  };

  // Handle the successful joining of a classroom
  const handleJoinSuccess = (joinedClassroom) => {
    setClassrooms([...classrooms, joinedClassroom]);
  };

  // Display a loading indicator while fetching data
  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="classroom-container">
      <h1>Classrooms</h1>
      <div className="top-controls">
        {/* Component for joining a classroom */}
        <div className="join-classroom">
          <JoinClassroom onJoinSuccess={handleJoinSuccess} />
        </div>
        {/* Button to open the modal for creating a new classroom, visible only to teachers */}
        {userData && userData.role === "teacher" && (
          <div className="button-container">
            <button onClick={() => setIsModalOpen(true)}>
              + Create New Classroom
            </button>
          </div>
        )}
      </div>
      {/* Component to display the list of classrooms */}
      <Classes classrooms={classrooms} />
      {/* Modal for creating a new classroom */}
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
