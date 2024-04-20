import React from "react";
import "./Modal.css";

function Modal({ children, isOpen, closeModal }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
        <button onClick={closeModal} className="modal-close-btn">
          Close
        </button>
      </div>
    </div>
  );
}

export default Modal;
