import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StudentList.css";
import { toast } from "react-toastify"; // Import toast

function StudentList() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/students`,
          { withCredentials: true }
        );
        // Sort students by name alphabetically
        const sortedData = data.sort((a, b) => a.name.localeCompare(b.name));
        setStudents(sortedData);
      } catch (error) {
        console.error("Failed to fetch students:", error);
        // Display an error message to the user with react-toastify
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
