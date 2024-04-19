import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./CreateClassroom.css";

function CreateClassroom({ closeModal, onNewClassroom }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    learningGoals: "",
  });
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "photo") {
      setFile(e.target.files[0]);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("learningGoals", formData.learningGoals);
    if (file) {
      data.append("photo", file);
    }

    try {
      const response = await axios.post("/api/classrooms/create", data);
      toast.success("Classroom created successfully!");
      onNewClassroom(response.data); // Ensure response.data is what you expect
      closeModal();
    } catch (error) {
      toast.error("Failed to create classroom: " + error.response.data.message); // Assuming error response has a data property with a message
      console.error("Create Classroom Error:", error.response.data); // Detailed log of the response error
    }
  };

  return (
    <div className="createclassroom-modal">
      <div className="modal-content">
        <span className="close" onClick={closeModal}>
          &times;
        </span>
        <h2>Create Classroom</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
          />
          <textarea
            name="learningGoals"
            placeholder="Learning Goals"
            value={formData.learningGoals}
            onChange={handleChange}
            required
          />
          <input type="file" name="photo" onChange={handleChange} />
          <button type="submit">Create Classroom</button>
        </form>
      </div>
    </div>
  );
}

export default CreateClassroom;
