import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./JoinClassroom.css";

function JoinClassroom({ onJoinSuccess }) {
  const [classCode, setClassCode] = useState("");

  const handleJoin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("/api/classrooms/join", { classCode });
      toast.success("Joined classroom successfully!");
      onJoinSuccess(response.data); // Pass the joined classroom data back up if needed
    } catch (error) {
      toast.error(
        "Failed to join classroom: " +
          (error.response?.data?.message || "Unknown error")
      );
    }
  };

  return (
    <form onSubmit={handleJoin} className="join-classroom-form">
      <input
        type="text"
        placeholder="Enter Classroom Code"
        value={classCode}
        onChange={(e) => setClassCode(e.target.value)}
        required
      />
      <button type="submit">Join Classroom</button>
    </form>
  );
}

export default JoinClassroom;
