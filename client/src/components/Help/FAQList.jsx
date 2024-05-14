import React from "react";
import FAQItem from "./FAQItem";
import "./FAQList.css";

const FAQList = ({ faqs }) => {
  return (
    <div className="faq-container">
      <h2>Frequently Asked Questions</h2>
      {faqs.map((faq, index) => (
        <FAQItem key={index} question={faq.question} answer={faq.answer} />
      ))}
    </div>
  );
};

export default FAQList;
