import React, { useState, useEffect } from "react";
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
  // State to hold the reflection entry details
  const [entry, setEntry] = useState({
    title: "",
    body: "",
    isPublic: false,
    photo: null,
    photoName: "",
    selectedClassroom: "",
    isAnonymous: false,
    requestFeedback: false,
  });

  // State for previewing the uploaded image
  const [previewImage, setPreviewImage] = useState(null);

  // State for storing classrooms fetched from the server
  const [classrooms, setClassrooms] = useState([]);

  // Hook for navigation
  const navigate = useNavigate();

  // Fetch classrooms on component mount
  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/classrooms`,
          { withCredentials: true }
        );
        setClassrooms(response.data);
      } catch (error) {
        console.error("Failed to fetch classrooms:", error);
        toast.error("Failed to fetch classrooms.");
      }
    };

    fetchClassrooms();
  }, []);

  // Toggle public/private status of the entry
  const togglePublic = () => {
    setEntry((prev) => ({
      ...prev,
      isPublic: !prev.isPublic,
    }));
    toast.info(
      `Entry will be set to ${entry.isPublic ? "private" : "public"}.`
    );
  };

  // Handle changes in form inputs
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo" && files.length > 0) {
      const file = files[0];
      setEntry((prev) => ({
        ...prev,
        photo: file,
        photoName: file.name,
      }));
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setEntry((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", entry.title);
    formData.append("body", entry.body);
    formData.append("isPublic", entry.isPublic);
    formData.append("isAnonymous", entry.isAnonymous);
    formData.append("requestFeedback", entry.requestFeedback);

    if (entry.isPublic) {
      formData.append("classroomId", entry.selectedClassroom);
    }
    if (entry.photo) {
      formData.append("photo", entry.photo);
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/reflections/create`,
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

  // Handle cancel action
  const handleCancel = () => {
    if (
      window.confirm(
        "Are you sure you want to cancel? Any unsaved changes will be lost."
      )
    ) {
      navigate("/reflections");
    }
  };

  return (
    <div className="container-new-entry">
      <h2>New reflection entry</h2>
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
        <div>
          <label>Public to Classroom:</label>
          <select
            name="selectedClassroom"
            disabled={!entry.isPublic}
            value={entry.selectedClassroom}
            onChange={handleChange}
            required={entry.isPublic}
          >
            <option value="">Select Classroom</option>
            {classrooms.map((classroom) => (
              <option key={classroom._id} value={classroom._id}>
                {classroom.title}
              </option>
            ))}
          </select>
          {entry.selectedClassroom && (
            <label id="anonymous-label" className="anonymous-option">
              <input
                type="checkbox"
                name="isAnonymous"
                checked={entry.isAnonymous}
                onChange={(e) =>
                  setEntry((prev) => ({
                    ...prev,
                    isAnonymous: e.target.checked,
                  }))
                }
              />
              Post anonymously
            </label>
          )}
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
            <>
              <div className="file-name">{entry.photoName}</div>
              {previewImage && (
                <div className="reflection-photo-preview">
                  <img
                    src={previewImage}
                    alt="Preview of uploaded reflectionphoto"
                  />
                </div>
              )}
            </>
          )}
        </div>

        <div
          className={`feedback-request ${
            entry.requestFeedback ? "disabled" : ""
          }`}
        >
          <p className="feedback-info">
            Once requested, feedback cannot be unrequested.
          </p>
          <label className="custom-checkbox">
            <input
              type="checkbox"
              name="requestFeedback"
              checked={entry.requestFeedback}
              onChange={(e) =>
                setEntry((prev) => ({
                  ...prev,
                  requestFeedback: e.target.checked,
                }))
              }
              disabled={entry.requestFeedback}
            />
            <span className="checkmark"></span>
            Request feedback from teacher
          </label>
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
