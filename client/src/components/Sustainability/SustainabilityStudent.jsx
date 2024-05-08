import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SustainabilityStudent.css";

function SustainabilityStudent() {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/resources`
        );
        setResources(data);
      } catch (error) {
        console.error("Failed to fetch resources:", error);
      }
    };
    fetchResources();
  }, []);

  return (
    <div className="student-sustainability-page">
      <header className="sustainability-header">
        <h1>Student Sustainability Hub</h1>
        <p>Find helpful sustainability resources here.</p>
      </header>
      <section className="resources">
        <h2>Available Resources</h2>
        <ul>
          {resources.map((resource, index) => (
            <li key={index}>
              <a href={resource.link} target="_blank" rel="noopener noreferrer">
                {resource.title}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default SustainabilityStudent;
