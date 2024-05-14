import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";
import "./FAQItem.css";

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div className="faq-item">
      <button className="faq-question" onClick={toggle}>
        <span className="question-content">
          <FontAwesomeIcon icon={faQuestionCircle} className="question-icon" />
          {question}
        </span>
        <FontAwesomeIcon
          icon={isOpen ? faChevronUp : faChevronDown}
          className="dropdown-icon"
        />
      </button>
      {isOpen && <p className="faq-answer">{answer}</p>}
    </div>
  );
};

export default FAQItem;
