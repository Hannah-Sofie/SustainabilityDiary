import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";
import "./Help.css";

// A single FAQ item
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

// The FAQ list component
function Help() {
  const faqs = [
    {
      question: "How do I write a reflection?",
      answer: "Answer here",
    },
    {
      question: "How do I make my reflection private?",
      answer: "Answer here",
    },
    {
      question: "How do I make my reflection public only to the teacher?",
      answer: "Answer here",
    },
    {
      question: "How do I join a classroom?",
      answer: "Answer here",
    },
    {
      question: "How can I change my name?",
      answer: "Answer here",
    },
    {
      question: "How can I change my email address?",
      answer: "Answer here",
    },
    {
      question: "How do I reset my password?",
      answer: "Answer here",
    },
  ];

  return (
    <div className="help-container">
      <div className="site-purpose">
        <h1>Welcome to the Sustainability Diary!</h1>
        <p>
          This website is designed to support the integration of sustainability
          into design education. It serves as an interactive platform where
          students and educators can document, reflect, and engage with
          sustainability practices within their coursework and beyond. The
          purpose is to deepen the understanding of sustainability impacts and
          solutions through active learning and reflection.
        </p>
      </div>
      <div className="faq-container">
        <h2>Frequently Asked Questions</h2>
        {faqs.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </div>
  );
}

export default Help;
