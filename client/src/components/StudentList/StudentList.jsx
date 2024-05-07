import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StudentList.css";
import DefaultImage from "../../assets/img/default-profilepic.png";
import { toast } from "react-toastify";

function StudentList() {
  const [students, setStudents] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: "", email: "" });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/users/students`,
        { withCredentials: true }
      );
      setStudents(data.sort((a, b) => a.name.localeCompare(b.name)));
    } catch (error) {
      console.error("Failed to fetch students:", error);
      toast.error("Failed to fetch students. Please try again later.");
    }
  };

  const handleEditClick = (student) => {
    setEditing(student._id);
    setEditFormData({ name: student.name, email: student.email });
  };

  const handleCancelClick = () => {
    setEditing(null);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleSaveClick = async () => {
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/users/students/${editing}`,
        editFormData,
        { withCredentials: true }
      );
      const newStudents = students.map((student) =>
        student._id === editing ? { ...student, ...data.user } : student
      );
      setStudents(newStudents);
      toast.success("Student details updated successfully!");
      setEditing(null);
    } catch (error) {
      console.error("Failed to update student details:", error);
      toast.error("Failed to update student details. Please try again.");
    }
  };

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
        <p>No students found.</p>
      )}
    </div>
  );
}

export default StudentList;
