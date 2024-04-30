import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StudentList.css";
import { toast } from "react-toastify";

function StudentList() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/users/students`,
          { withCredentials: true }
        );
        if (Array.isArray(data) && data.length > 0) {
          // Only sort and set students if data is valid and not empty
          const sortedData = data.sort((a, b) =>
            a.name && b.name ? a.name.localeCompare(b.name) : 0
          );
          setStudents(sortedData);
        } else {
          // Handle cases where data is an empty array or malformed
          setStudents([]);
          console.error("No valid student data received:", data);
          toast.error("No student data available.");
        }
      } catch (error) {
        console.error("Failed to fetch students:", error);
        toast.error("Failed to fetch students. Please try again later.");
      }
    };

    fetchStudents();
  }, []);

  return (
    <div className="student-list-container">
      <h2>Student List</h2>
      {students.length > 0 ? (
        <table className="student-list-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                <td>{student.name}</td>
                <td>{student.email}</td>
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
