import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./EditClassroom.css";

function EditClassroom({ classroom, onClose, onClassroomUpdated }) {
  const [formData, setFormData] = useState({
    title: classroom.title,
    description: classroom.description,
    learningGoals: classroom.learningGoals,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (event) => {
    setFormData({ ...formData, photo: event.target.files[0] });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      const response = await axios.put(
        `/api/classrooms/${classroom._id}`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      onClassroomUpdated(response.data);
      toast.success("Classroom updated successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to update classroom: " + error.response.data.message);
    }
  };

  return (
    <div className="edit-classroom-modal">
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <label>Description:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <label>Learning Goals:</label>
        <textarea
          name="learningGoals"
          value={formData.learningGoals}
          onChange={handleChange}
          required
        />
        <label>Photo header:</label>
        <input type="file" name="photo" onChange={handleFileChange} />
        <button type="submit">Update Classroom</button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default EditClassroom;
