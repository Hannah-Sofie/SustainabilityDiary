import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLock,
  faLockOpen,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import "./NewReflectionEntry.css";

function EditReflectionEntry() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState({
    title: "",
    body: "",
    isPublic: false,
    photoName: "",
    selectedClassroom: "",
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [classrooms, setClassrooms] = useState([]);

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/reflections/${id}`,
          { withCredentials: true }
        );
        setEntry({
          ...data,
          selectedClassroom: data.classrooms.length ? data.classrooms[0] : "",
        });
        if (data.photo) {
          setPreviewImage(
            `${process.env.REACT_APP_API_URL}/uploads/reflections/${data.photo}`
          );
        }
      } catch (error) {
        console.error("Failed to fetch entry:", error);
        toast.error("Failed to load the entry.");
      }
    };

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

    fetchEntry();
    fetchClassrooms();
  }, [id]);

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
      // Update preview image
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setEntry((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure title and body have valid values
    if (!entry.title.trim()) {
      toast.error("Title is required.");
      return;
    }
    if (!entry.body.trim()) {
      toast.error("Body is required.");
      return;
    }

    // Convert `isPublic` to a boolean string
    const isPublic =
      entry.isPublic === true || entry.isPublic === "true" ? "true" : "false";

    // Create `FormData` and add fields
    const formData = new FormData();
    formData.append("title", entry.title);
    formData.append("body", entry.body);
    formData.append("isPublic", isPublic);

    // ** Add the conditional logic here **
    if (isPublic === "true" && entry.selectedClassroom) {
      formData.append("classroomId", entry.selectedClassroom);
    }

    // Include the uploaded photo if provided
    if (entry.photo) {
      formData.append("photo", entry.photo);
    }

    // Debugging step: Print out the form data entries
    console.log("Submitting form data:", [...formData.entries()]);

    // Perform the PUT request
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/reflections/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast.success("Entry updated successfully!");
      navigate("/reflections");
    } catch (error) {
      console.error("Failed to update entry:", error.response?.data);
      toast.error("Failed to update entry.");
    }
  };
  console.log("Title:", entry.title);
  console.log("Body:", entry.body);

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
        </div>
        <div className="file-upload">
          <label htmlFor="photo-upload" className="file-upload-label">
            <FontAwesomeIcon icon={faUpload} /> Upload or Change Photo
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
            onClick={() => navigate("/reflections")}
            className="cancel-button"
          >
            Cancel
          </button>
          <button type="submit">Save</button>
        </div>
      </form>
    </div>
  );
}

export default EditReflectionEntry;
