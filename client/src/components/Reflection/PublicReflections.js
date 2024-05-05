import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ReflectionModal from "./ReflectionModal";
import "./PublicReflections.css";
import DefaultImage from "../../assets/img/default-image.jpg";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const PublicReflections = ({ classroomId }) => {
  const [publicEntries, setPublicEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);

  useEffect(() => {
    const fetchPublicEntries = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/reflections/classroom/${classroomId}/public`,
          { withCredentials: true }
        );
        setPublicEntries(response.data);
      } catch (error) {
        console.error("Failed to fetch public entries:", error);
        toast.error("Failed to fetch public entries.");
      }
    };

    if (classroomId) {
      fetchPublicEntries();
    }
  }, [classroomId]);

  const openModal = (entry) => {
    setSelectedEntry(entry);
  };

  const closeModal = () => {
    setSelectedEntry(null);
  };

  const handleLike = (id) => {
    console.log("Liked:", id);
  };

  return (
    <div className="public-entries">
      {publicEntries.map((entry) => (
        <div
          key={entry._id}
          className="public-entry"
          onClick={() => openModal(entry)}
        >
          <FontAwesomeIcon
            icon={faHeart}
            className="like-icon"
            onClick={(e) => {
              e.stopPropagation();
              handleLike(entry._id);
            }}
          />
          <div className="entry-image">
            <img
              src={
                entry.photo
                  ? `${process.env.REACT_APP_API_URL}/uploads/${entry.photo}`
                  : DefaultImage
              }
              alt="Reflection"
            />
          </div>
          <h3>{entry.title}</h3>
          <p>{entry.body}</p>
          <p className="author">By: {entry.userId.name}</p>
        </div>
      ))}
      {selectedEntry && (
        <ReflectionModal entry={selectedEntry} onClose={closeModal} />
      )}
    </div>
  );
};

export default PublicReflections;
