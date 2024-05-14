import React from "react";
import FAQList from "./FAQList";
import faqsStudent from "./faqsStudent";
import "./Help.css";

const Help = () => {
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
      <FAQList faqs={faqsStudent} />
    </div>
  );
};

export default Help;
