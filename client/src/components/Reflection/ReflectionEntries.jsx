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
import "./ReflectionSearchbar.css";
import ReflectionCount from "./ReflectionCount";
import ReflectionModal from "../Feedback/ReflectionModal";

function ReflectionEntries() {
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [privacyFilter, setPrivacyFilter] = useState("");
  const navigate = useNavigate();

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

  const handleSearch = (event) => {
    setSearch(event.target.value.toLowerCase());
  };

  const handleEdit = (id, event) => {
    event.stopPropagation();
    navigate(`/edit-reflection/${id}`);
  };

  const deleteEntry = async (id, event) => {
    event.stopPropagation();
    if (window.confirm("Are you sure you want to delete this reflection?")) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_API_URL}/api/reflections/${id}`,
          { withCredentials: true }
        );
        const updatedEntries = entries.filter((entry) => entry._id !== id);
        setEntries(updatedEntries);
        toast.success("Reflection deleted successfully!");
      } catch (error) {
        console.error("Failed to delete reflection:", error);
        toast.error("Failed to delete reflection");
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

  const sortedAndFilteredEntries = entries
    .filter((entry) => {
      return (
        (entry.title.toLowerCase().includes(search) ||
          entry.body.toLowerCase().includes(search)) &&
        (privacyFilter ? entry.isPublic.toString() === privacyFilter : true)
      );
    })
    .sort((a, b) => {
      switch (sortOrder) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "recentlyUpdated":
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        case "leastUpdated":
          return new Date(a.updatedAt) - new Date(b.updatedAt);
        case "titleAZ":
          return a.title.localeCompare(b.title);
        case "titleZA":
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

  return (
    <div className="reflection-search-bar">
      <div className="search_bar">
        <input
          type="search"
          placeholder="Search reflections here..."
          value={search}
          onChange={handleSearch}
        />
        <select onChange={(e) => setSortOrder(e.target.value)}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="recentlyUpdated">Most Recently Updated</option>
          <option value="leastUpdated">Least Recently Updated</option>
          <option value="titleAZ">Title A-Z</option>
          <option value="titleZA">Title Z-A</option>
        </select>
        <select onChange={(e) => setPrivacyFilter(e.target.value)}>
          <option value="">All</option>
          <option value="true">Public</option>
          <option value="false">Private</option>
        </select>
      </div>
      <ReflectionCount count={entries.length} />
      <div className="filtered-entries">
        {sortedAndFilteredEntries.length > 0 ? (
          sortedAndFilteredEntries.map((entry) => (
            <div
              key={entry._id}
              className="reflection_card"
              onClick={() => setSelectedEntry(entry)}
            >
              <div className="reflection_details">
                <div className="img">
                  <img
                    src={
                      entry.photo
                        ? `${process.env.REACT_APP_API_URL}/uploads/reflections/${entry.photo}`
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
          ))
        ) : (
          <p>No reflections match your search criteria.</p>
        )}
      </div>
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
