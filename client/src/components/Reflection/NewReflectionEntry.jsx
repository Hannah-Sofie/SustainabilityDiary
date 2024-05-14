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
  const [entry, setEntry] = useState({
    title: "",
    body: "",
    isPublic: false,
    photo: null,
    photoName: "",
    selectedClassroom: "",
    isAnonymous: false, // Added isAnonymous field
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [classrooms, setClassrooms] = useState([]);
  const navigate = useNavigate();

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
    if (name === "photo" && files.length > 0) {
      const file = files[0];
      setEntry((prev) => ({
        ...prev,
        photo: file,
        photoName: file.name,
      }));
      // Create a local URL for preview
      setPreviewImage(URL.createObjectURL(file));
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
    formData.append("isAnonymous", entry.isAnonymous); // Append isAnonymous field

    if (entry.isPublic) {
      formData.append("classroomId", entry.selectedClassroom);
    }
    if (entry.photo) {
      formData.append("photo", entry.photo);
    }
    // log data sent during form submission
    console.log("Data sent:", [...formData.entries()]);

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
