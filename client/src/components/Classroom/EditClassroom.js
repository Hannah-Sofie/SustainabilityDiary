import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import "./EditClassroom.css";

function EditClassroom({ classroom, onClose, onClassroomUpdated }) {
  const [formData, setFormData] = useState({
    title: classroom.title,
    description: classroom.description,
    learningGoals: classroom.learningGoals,
    active: classroom.classStatus,
    photo: classroom.headerPhotoUrl || null,
  });

  const [previewImage, setPreviewImage] = useState(
    classroom.headerPhotoUrl
      ? `${process.env.REACT_APP_API_URL}${classroom.headerPhotoUrl}`
      : null
  );

  // Handle file selection for photo preview
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFormData({ ...formData, photo: file });
    setPreviewImage(URL.createObjectURL(file));
  };

  // Handle removing the photo
  const handleRemovePhoto = () => {
    setFormData({ ...formData, photo: null });
    setPreviewImage(null);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("learningGoals", formData.learningGoals);
    data.append("classStatus", formData.active);

    if (formData.photo) {
      data.append("photo", formData.photo);
    }

    try {
      const response = await axios.put(
        `/api/classrooms/${classroom._id}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      onClassroomUpdated(response.data);
      toast.success("Classroom updated successfully!");
      onClose();
    } catch (error) {
      toast.error(
        "Failed to update classroom: " +
          (error.response?.data?.message || error.message)
      );
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
        <div className="file-upload">
          <label htmlFor="classroom-photo-upload" className="file-upload-label">
            <FontAwesomeIcon icon={faUpload} /> Upload or Change Photo
          </label>
          <input
            id="classroom-photo-upload"
            type="file"
            name="photo"
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: "none" }}
          />
          {previewImage && (
            <div className="photo-preview-container">
              <img
                src={previewImage}
                alt="Preview of classroom header photo"
                className="photo-preview"
              />
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="remove-photo-button"
              >
                <FontAwesomeIcon icon={faTrashAlt} /> Remove Photo
              </button>
            </div>
          )}
        </div>
        <button type="submit" className="update-classroom-button">
          Update Classroom
        </button>
        <button type="button" className="cancel-button" onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default EditClassroom;
