import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencilAlt,
  faTrash,
  faLock,
  faLockOpen,
} from "@fortawesome/free-solid-svg-icons";
import DefaultImage from "../../assets/img/default-image.jpg";
import "./ReflectionEntries.css";
import ReflectionModal from "./ReflectionModal";

function ReflectionEntries() {
  const [entries, setEntries] = useState([]);
  const navigate = useNavigate();
  const [selectedEntry, setSelectedEntry] = useState(null);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/reflections`,
        { withCredentials: true }
      );
      setEntries(data);
    } catch (error) {
      console.error("Failed to fetch reflection entries:", error);
      toast.error("Failed to fetch reflection entries");
    }
  };

  const handleEdit = (id, event) => {
    event.stopPropagation(); // Prevent modal from opening
    navigate(`/edit-reflection/${id}`);
  };

  const deleteEntry = async (id, event) => {
    event.stopPropagation(); // Prevent modal from opening
    if (window.confirm("Are you sure you want to delete this entry?")) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_API_URL}/api/reflections/${id}`,
          { withCredentials: true }
        );
        const updatedEntries = entries.filter((entry) => entry._id !== id);
        setEntries(updatedEntries);
        toast.success("Entry deleted successfully!");
      } catch (error) {
        console.error("Failed to delete entry:", error);
        toast.error("Failed to delete entry");
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  const truncateText = (text, maxLength) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <div className="reflection-entries">
      {entries.map((entry) => (
        <div
          className="reflection_card"
          key={entry._id}
          onClick={() => setSelectedEntry(entry)}
        >
          <div className="reflection_details">
            <div className="img">
              <img
                src={
                  entry.photo
                    ? `${process.env.REACT_APP_API_URL}/uploads/${entry.photo}`
                    : DefaultImage
                }
                alt="Reflection"
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="text">
              <h3>{entry.title}</h3>
              <p>{truncateText(entry.body, 50)}</p>
            </div>
          </div>
          <div className="reflection_date">
            <p>
              <span>Created at:</span> {formatDate(entry.createdAt)}
            </p>
            <p>
              <span>Updated at:</span> {formatDate(entry.updatedAt)}
            </p>
          </div>
          <div className="action-buttons">
            <FontAwesomeIcon
              icon={entry.isPublic ? faLockOpen : faLock}
              className="privacy-icon"
            />
            <button
              onClick={(e) => handleEdit(entry._id, e)}
              className="edit-button"
            >
              <FontAwesomeIcon icon={faPencilAlt} />
            </button>
            <button
              onClick={(e) => deleteEntry(entry._id, e)}
              className="delete-button"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        </div>
      ))}
      {selectedEntry && (
        <ReflectionModal
          entry={selectedEntry}
          onClose={() => setSelectedEntry(null)}
        />
      )}
    </div>
  );
}

export default ReflectionEntries;
