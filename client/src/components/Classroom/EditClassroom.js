import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import "./EditClassroom.css";

function EditClassroom({ classroom, onClose, onClassroomUpdated }) {
  const [formData, setFormData] = useState({
    title: classroom.title,
    description: classroom.description,
    learningGoals: classroom.learningGoals,
    photo: classroom.headerPhotoUrl || null,
    active: classroom.classStatus,
  });

  const [previewImage, setPreviewImage] = useState(
    classroom.headerPhotoUrl || null,
  );

  const handleToggle = (event) => {
    setFormData({ ...formData, active: event.target.checked });
    console.log("Checkbox active:", event.target.checked);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFormData({ ...formData, photo: file });
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key !== "active") {
        data.append(key, formData[key]);
      }
    });
    data.append("active", formData.active); // Append boolean directly

    try {
      const response = await axios.put(
        `/api/classrooms/${classroom._id}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      onClassroomUpdated(response.data);
      toast.success("Classroom updated successfully!");
      onClose();
    } catch (error) {
      toast.error(
        "Failed to update classroom: " +
          (error.response?.data?.message || error.message),
      );
    }
  };

  console.log("Submitting with formData:", formData);

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
        <div className="file-upload">
          <label htmlFor="classroom-photo-upload" className="file-upload-label">
            <FontAwesomeIcon icon={faUpload} /> Upload new header photo
          </label>
          <input
            id="classroom-photo-upload"
            type="file"
            name="photo"
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: "none" }}
          />
          <div className="switchWrapper">
            <label>Toggle switch off to mark classroom as finished</label>
            <div className="toggle-switch">
              <label>
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={handleToggle}
                  style={{ marginLeft: "10px" }}
                />
                <span className="slider round"></span>{" "}
              </label>
            </div>
          </div>
          {previewImage && (
            <div className="photo-preview-container">
              <img
                src={previewImage}
                alt="Preview of updated classroom header"
                className="photo-preview"
              />
            </div>
          )}
        </div>
        <button type="submit">Update Classroom</button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default EditClassroom;
