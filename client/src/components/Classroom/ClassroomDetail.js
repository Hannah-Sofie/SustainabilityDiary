import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import DefaultImage from "../../assets/img/default-profilepic.png";
import PublicReflections from "../Reflection/PublicReflections";
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator";
import Modal from "../Modal/Modal";
import { useAuth } from "../../context/AuthContext";
import "./ClassroomDetail.css";
import EditClassroom from "./EditClassroom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencilAlt,
  faEye,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

function ClassroomDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [classroom, setClassroom] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { userData } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/classrooms/${id}`);
        setClassroom(response.data);
      } catch (error) {
        console.error("Error fetching classroom details:", error);
      }
    };

    fetchData();
  }, [id]);

  if (!classroom) {
    return <LoadingIndicator />;
  }

  const handleViewStudents = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openEditModal = () => setIsEditModalOpen(true);
  const closeEditModal = () => setIsEditModalOpen(false);

  const onClassroomUpdated = (updatedClassroom) => {
    setClassroom(updatedClassroom);
    closeEditModal(); // Close the modal
  };

  const removeStudent = async (studentId) => {
    try {
      const response = await axios.delete(
        `/api/classrooms/${id}/students/${studentId}`,
        {
          headers: { Authorization: `Bearer ${userData.token}` },
        }
      );
      setClassroom(response.data);
      alert("Student removed successfully");
    } catch (error) {
      console.error("Error removing student:", error.response?.data?.message);
      alert("Failed to remove student");
    }
  };

  const getStudentPhotoUrl = (photo) => {
    return photo
      ? `${process.env.REACT_APP_API_URL}/uploads/profilepics/${photo}`
      : DefaultImage;
  };

  return (
    <div className="classroom-detail-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faArrowLeft} className="fa-icon" /> Go Back
      </button>
      <div
        className="classroom-header"
        style={{
          backgroundImage: `url(${
            classroom.headerPhotoUrl
              ? `${process.env.REACT_APP_API_URL}${classroom.headerPhotoUrl}`
              : DefaultImage
          })`,
        }}
      >
        <h1>{classroom.title}</h1>
        <span
          className={`classroom-status ${
            classroom.classStatus ? "active" : "finished"
          }`}
        >
          {classroom.classStatus ? "Active" : "Finished"}
        </span>
      </div>
      <div className="classroom-content">
        <div className="classroom-info">
          <p className="classroom-detail-text">
            <span>Description:</span> {classroom.description}
          </p>
          <p className="classroom-detail-text">
            <span>Learning Goals:</span> {classroom.learningGoals}
          </p>
          <div className="classroom-detail-actions">
            <p className="classroom-detail-text">
              <span>Class Code:</span> {classroom.classCode}
            </p>
            {userData && userData.role === "teacher" && (
              <button className="edit-classroom-button" onClick={openEditModal}>
                <FontAwesomeIcon icon={faPencilAlt} className="fa-icon" /> Edit
                classroom details
              </button>
            )}
          </div>
          {userData && userData.role === "teacher" && (
            <button
              className="classroom-detail-button"
              onClick={handleViewStudents}
            >
              <FontAwesomeIcon icon={faEye} className="fa-icon" /> View students
            </button>
          )}
        </div>
        <Modal isOpen={isEditModalOpen} closeModal={closeEditModal}>
          <EditClassroom
            classroom={classroom}
            onClose={closeEditModal}
            onClassroomUpdated={onClassroomUpdated}
          />
        </Modal>
        <Modal isOpen={isModalOpen} closeModal={closeModal}>
          <h2 className="students-in">Students in {classroom.title}</h2>
          <div className="student-table">
            <div className="student-header">
              <span>Photo</span>
              <span>Name</span>
              <span>Email</span>
              <span>Action</span>
            </div>
            {classroom.students.length > 0 ? (
              <ul className="student-list">
                {classroom.students.map((student) => (
                  <li key={student._id} className="student-row">
                    <div className="student-info">
                      <img
                        src={getStudentPhotoUrl(student.photo)}
                        alt={`${student.name}`}
                        className="student-photo"
                      />
                      <span>{student.name}</span>
                      <span>{student.email}</span>
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
            ) : (
              <p className="no-students-message">
                No students have joined this classroom yet.
              </p>
            )}
          </div>
        </Modal>
        <h1>Public Reflections</h1>
        <PublicReflections classroomId={id} />
      </div>
    </div>
  );
}

export default ClassroomDetail;
