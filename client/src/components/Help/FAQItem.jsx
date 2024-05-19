import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";
import "./FAQItem.css";

// Component for an individual FAQ item
const FAQItem = ({ question, answer }) => {
  // State to track if the FAQ item is open or closed
  const [isOpen, setIsOpen] = useState(false);

  // Toggle function to open/close the FAQ item
  const toggle = () => setIsOpen(!isOpen);

  return (
    <div className="faq-item">
      {/* Button to toggle FAQ item */}
      <button className="faq-question" onClick={toggle}>
        <span className="question-content">
          <FontAwesomeIcon icon={faQuestionCircle} className="question-icon" />
          {question}
        </span>
        {/* Icon changes based on the open/closed state */}
        <FontAwesomeIcon
          icon={isOpen ? faChevronUp : faChevronDown}
          className="dropdown-icon"
        />
      </button>
      {/* Conditionally render the answer based on isOpen state */}
      {isOpen && <p className="faq-answer">{answer}</p>}
    </div>
  );
};

export default FAQItem;
