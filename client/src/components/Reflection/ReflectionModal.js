import React from "react";
import DefaultImage from "../../assets/img/default-image.jpg";
import "./ReflectionModal.css";

function ReflectionModal({ entry, onClose }) {
  if (!entry) return null;

  const imageUrl = entry.photo
    ? `${process.env.REACT_APP_API_URL}/uploads/${entry.photo}`
    : DefaultImage;
  console.log(
    `Image URL: ${process.env.REACT_APP_API_URL}/uploads/${entry.photo}`
  );
  console.log("Entry object:", entry);

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>{entry.title}</h2>
        {entry.photo && <img src={imageUrl} alt={entry.title} />}
        <p>{entry.body}</p>
        <button onClick={onClose} className="button-cancel">
          Close
        </button>
      </div>
    </div>
  );
}

export default ReflectionModal;
