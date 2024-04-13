import React from "react";
import "./ReflectionModal.css";

function ReflectionModal({ entry, onClose }) {
  if (!entry) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>{entry.title}</h2>
        <p>{entry.body}</p>
        <button onClick={onClose} className="button-cancel">
          Close
        </button>
      </div>
    </div>
  );
}

export default ReflectionModal;
