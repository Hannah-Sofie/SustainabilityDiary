import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLock,
  faLockOpen,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import "./NewReflectionEntry.css";

function NewReflectionEntry() {
  const [entry, setEntry] = useState({
    title: "",
    body: "",
    isPublic: false,
    photo: null,
    photoName: "",
  });
  const navigate = useNavigate();

  const togglePublic = () => {
    setEntry((prev) => ({
      ...prev,
      isPublic: !prev.isPublic,
    }));
    toast.info(
      `Entry will be set to ${entry.isPublic ? "private" : "public"}.`
    );
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setEntry((prev) => ({
        ...prev,
        photo: files[0],
        photoName: files[0].name,
      }));
    } else {
      setEntry((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", entry.title);
    formData.append("body", entry.body);
    formData.append("isPublic", entry.isPublic);
    if (entry.photo) formData.append("photo", entry.photo);

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/reflections/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            withCredentials: true,
          },
        }
      );
      toast.success("Reflection entry created successfully!");
      navigate("/reflections");
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
        <div className="privacy">
          <button
            type="button"
            onClick={togglePublic}
            className="privacy-toggle"
          >
            <FontAwesomeIcon icon={entry.isPublic ? faLockOpen : faLock} />
            {entry.isPublic ? " Public" : " Private"}
          </button>
        </div>
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
        <div className="file-upload">
          <label htmlFor="photo-upload" className="file-upload-label">
            <FontAwesomeIcon icon={faUpload} /> Upload Photo
          </label>
          <input
            id="photo-upload"
            type="file"
            name="photo"
            onChange={handleChange}
            accept="image/*"
            style={{ display: "none" }}
          />
          {entry.photoName && (
            <div className="file-name">{entry.photoName}</div>
          )}
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
