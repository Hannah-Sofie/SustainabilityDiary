import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ReflectionModal from "./ReflectionModal";
import "./PublicReflections.css";

const PublicReflections = () => {
  const [publicEntries, setPublicEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);

  useEffect(() => {
    const fetchPublicEntries = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/reflections/public`,
          { withCredentials: true }
        );
        setPublicEntries(data);
      } catch (error) {
        console.error("Failed to fetch public entries:", error);
        toast.error("Failed to fetch public entries.");
      }
    };
    fetchPublicEntries();
  }, []);

  const openModal = (entry) => {
    setSelectedEntry(entry);
  };

  const closeModal = () => {
    setSelectedEntry(null);
  };

  return (
    <div className="public-entries">
      {publicEntries.map((entry) => (
        <div
          key={entry._id}
          className="public-entry"
          onClick={() => openModal(entry)}
        >
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
