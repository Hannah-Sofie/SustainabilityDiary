import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faLockOpen } from "@fortawesome/free-solid-svg-icons";
import "./NewReflectionEntry.css";

function EditReflectionEntry() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState({ title: "", body: "", isPublic: false });

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/reflections/${id}`,
          { withCredentials: true }
        );
        setEntry(data);
      } catch (error) {
        console.error("Failed to fetch entry:", error);
        toast.error("Failed to load the entry.");
      }
    };
    fetchEntry();
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
    const { name, value } = e.target;
    setEntry({ ...entry, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/reflections/${id}`,
        entry,
        { withCredentials: true }
      );
      toast.success("Entry updated successfully!");
      navigate("/reflections");
    } catch (error) {
      console.error("Failed to update entry:", error);
      toast.error("Failed to update entry.");
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
