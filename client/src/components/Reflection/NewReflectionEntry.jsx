import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./NewReflectionEntry.css";

function NewReflectionEntry() {
  const [entry, setEntry] = useState({ title: "", body: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setEntry({ ...entry, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/reflections/create`,
        entry,
        { withCredentials: true }
      );
      toast.success("Reflection entry created successfully!");
      navigate("/reflections"); // Redirect to the reflections list
    } catch (error) {
      console.error("Failed to create reflection entry:", error);
      toast.error("Failed to create reflection entry.");
    }
  };

  const handleCancel = () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to cancel? Any unsaved changes will be lost."
    );
    if (isConfirmed) {
      navigate("/reflections"); // Redirect to the reflections list
    }
  };

  return (
    <div className="container-new-entry">
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={entry.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Body:</label>
          <textarea
            name="body"
            value={entry.body}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-actions">
          <button
            type="button"
            onClick={handleCancel}
            className="cancel-button"
          >
            Cancel
          </button>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default NewReflectionEntry;
