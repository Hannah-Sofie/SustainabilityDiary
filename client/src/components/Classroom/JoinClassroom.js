import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./JoinClassroom.css";

function JoinClassroom({ onJoinSuccess }) {
  // State to store the classroom code input by the user
  const [classCode, setClassCode] = useState("");

  // Handler for form submission
  const handleJoin = async (event) => {
    event.preventDefault();
    try {
      // Send a POST request to join the classroom using the class code
      const response = await axios.post("/api/classrooms/join", { classCode });
      // Show a success message on successful join
      toast.success("Joined classroom successfully!");
      // Pass the joined classroom data back up if needed
      onJoinSuccess(response.data);
    } catch (error) {
      // Show an error message if the join fails
      toast.error(
        "Failed to join classroom: " +
          (error.response?.data?.message || "Unknown error")
      );
    }
  };

  return (
    <form onSubmit={handleJoin} className="join-classroom-form">
      {/* Input field for the classroom code */}
      <input
        type="text"
        placeholder="Enter Classroom Code"
        value={classCode}
        onChange={(e) => setClassCode(e.target.value)}
        required
      />
      {/* Submit button to join the classroom */}
      <button type="submit" className="join-button">
        Join Classroom
      </button>
    </form>
  );
}

export default JoinClassroom;
