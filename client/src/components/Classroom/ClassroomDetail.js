import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import DefaultImage from "../../assets/img/default-header.jpeg";
import PublicReflections from "../Reflection/PublicReflections.js";
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator.jsx";
import Modal from "../Modal/Modal.js";
import { useAuth } from "../../context/AuthContext.js";
import "./ClassroomDetail.css";

function ClassroomDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [classroom, setClassroom] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { userData } = useAuth();

  useEffect(() => {
    axios
      .get(`/api/classrooms/${id}`)
      .then((response) => {
        // console.log("API Response:", JSON.stringify(response.data, null, 2));
        setClassroom(response.data);
      })
      .catch((error) => {
        console.error("Error fetching classroom details:", error);
      });
  }, [id]);

  if (!classroom) {
    return <LoadingIndicator />;
  }

  const handleViewStudents = () => {
    setIsModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  const removeStudent = (studentId) => {
    axios
      .delete(`/api/classrooms/${id}/students/${studentId}`, {
        headers: { Authorization: `Bearer ${userData.token}` },
      })

      .then((response) => {
        // Update the classroom state to reflect the change
        setClassroom(response.data);
        alert("Student removed successfully");
      })
      .catch((error) => {
        console.error("Error removing student:", error.response.data.message);
        alert("Failed to remove student");
      });
  };

  return (
    <div className="classroom-detail-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        Go Back
      </button>
      <div
        className="classroom-header"
        style={{
          backgroundImage: `url(${classroom.photoUrl || DefaultImage})`,
        }}
      >
        <h1>{classroom.title}</h1>
      </div>
      <div className="classroom-content">
        <p className="classroom-detail-text">
          <span>Description:</span> {classroom.description}
        </p>
        <p className="classroom-detail-text">
          <span>Learning Goals:</span> {classroom.learningGoals}
        </p>
        <p className="classroom-detail-text">
          <span>Class Code:</span> {classroom.classCode}
        </p>
        {userData && userData.role === "teacher" && (
          <button
            className="classroom-detail-button"
            onClick={handleViewStudents}
          >
            View Students
          </button>
        )}
        <Modal isOpen={isModalOpen} closeModal={closeModal}>
          <h2 className="students-in">Students in {classroom.title}</h2>
          <div className="student-table">
            <div className="student-header">
              <span>Name</span>
              <span>Email</span>
              <span>Role</span>
              <span>Action</span>
            </div>
            <ul className="student-list">
              {classroom.students.map((student) => (
                <li key={student._id} className="student-row">
                  <div className="student-info">
                    <span>{student.name}</span>
                    <span>{student.email}</span>
                    <span>{student.role}</span>
                  </div>
                  <div className="student-action">
                    <button
                      className="remove-student-button"
                      onClick={() => removeStudent(student._id)}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Modal>

        <h1>Public Reflections</h1>
        <PublicReflections classroomId={id} />
      </div>
    </div>
  );
}

export default ClassroomDetail;
