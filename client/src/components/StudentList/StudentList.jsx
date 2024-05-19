import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StudentList.css";
import DefaultImage from "../../assets/img/default-profilepic.png";
import { toast } from "react-toastify";

function StudentList() {
  // State to manage the list of students
  const [students, setStudents] = useState([]);
  // State to manage which student is currently being edited
  const [editing, setEditing] = useState(null);
  // State to manage the form data for editing a student
  const [editFormData, setEditFormData] = useState({ name: "", email: "" });

  // Fetch the list of students when the component mounts
  useEffect(() => {
    fetchStudents();
  }, []);

  // Function to fetch students from the server
  const fetchStudents = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/users/students`,
        { withCredentials: true }
      );
      // Sort students by name and update state
      setStudents(data.sort((a, b) => a.name.localeCompare(b.name)));
    } catch (error) {
      console.error("Failed to fetch students:", error);
      toast.error("Failed to fetch students. Please try again later.");
    }
  };

  // Function to handle clicking the edit button for a student
  const handleEditClick = (student) => {
    setEditing(student._id); // Set the current editing student
    setEditFormData({ name: student.name, email: student.email }); // Populate the form with existing student data
  };

  // Function to handle canceling the edit
  const handleCancelClick = () => {
    setEditing(null); // Reset the editing state
  };

  // Function to handle changes in the edit form
  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setEditFormData({ ...editFormData, [name]: value }); // Update the form data state
  };

  // Function to handle saving the edited student details
  const handleSaveClick = async () => {
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/users/students/${editing}`,
        editFormData,
        { withCredentials: true }
      );
      // Update the students state with the edited details
      const newStudents = students.map((student) =>
        student._id === editing ? { ...student, ...data.user } : student
      );
      setStudents(newStudents);
      toast.success("Student details updated successfully!");
      setEditing(null); // Reset the editing state
    } catch (error) {
      console.error("Failed to update student details:", error);
      toast.error("Failed to update student details. Please try again.");
    }
  };

  // Function to get the URL of the student's photo
  const getStudentPhotoUrl = (photo) => {
    return photo
      ? `${process.env.REACT_APP_API_URL}/uploads/profilepics/${photo}`
      : DefaultImage;
  };

  return (
    <div className="student-list-container">
      <h2>Student List</h2>
      {students.length > 0 ? (
        <table className="student-list-table">
          <thead>
            <tr>
              <th>Photo</th>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                {editing === student._id ? (
                  <>
                    <td>
                      <img
                        src={getStudentPhotoUrl(student.photo)}
                        alt={`${student.name}`}
                        className="student-photo"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="name"
                        value={editFormData.name}
                        onChange={handleFormChange}
                      />
                    </td>
                    <td>
                      <input
                        type="email"
                        name="email"
                        value={editFormData.email}
                        onChange={handleFormChange}
                      />
                    </td>
                    <td>
                      <button onClick={handleSaveClick}>Save</button>
                      <button onClick={handleCancelClick}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>
                      <img
                        src={getStudentPhotoUrl(student.photo)}
                        alt={`${student.name}`}
                        className="student-photo"
                      />
                    </td>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>
                      <button onClick={() => handleEditClick(student)}>
                        Edit
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-students-message">No students have registered yet.</p>
      )}
    </div>
  );
}

export default StudentList;
