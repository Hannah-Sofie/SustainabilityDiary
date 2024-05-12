import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./SustainabilityTeacher.css";

function SustainabilityTeacher() {
  const [formData, setFormData] = useState({
    title: "",
    link: "",
  });

  const [resources, setResources] = useState([]);

  // Fetch all resources for student view
  const fetchResources = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/resources`
      );
      setResources(data);
    } catch (error) {
      console.error("Failed to fetch resources:", error);
      toast.error("Error fetching resources");
    }
  };

  // Initial fetch for resources
  useEffect(() => {
    fetchResources();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.link) {
      toast.error("Please fill out all fields.");
      return;
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/resources`,
        formData
      );
      toast.success("Resource added successfully!");

      // Clear form and refetch resources
      setFormData({ title: "", link: "" });
      fetchResources();
    } catch (error) {
      console.error("Failed to add resource:", error);
      toast.error("An error occurred while adding the resource.");
    }
  };

  return (
    <div className="teacher-sustainability-page">
      <header className="sustainability-header">
        <h1>Teacher Sustainability Hub</h1>
        <p>Add new sustainability resources for students and preview below.</p>
      </header>
      <form className="resource-form" onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Resource Title"
          />
        </label>
        <label>
          Link:
          <input
            type="url"
            name="link"
            value={formData.link}
            onChange={handleChange}
            placeholder="https://example.com"
          />
        </label>
        <button type="submit">Add Resource</button>
      </form>

      {/* Student View */}
      <div className="student-sustainability-preview">
        <h2>Student View</h2>
        <ul>
          {resources.map((resource, index) => (
            <li key={index}>
              <a href={resource.link} target="_blank" rel="noopener noreferrer">
                {resource.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SustainabilityTeacher;
