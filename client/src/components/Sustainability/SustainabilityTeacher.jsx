import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./SustainabilityTeacher.css";

function SustainabilityTeacher() {
  const [formData, setFormData] = useState({ title: "", link: "" });
  const [resources, setResources] = useState([]);
  const [editingId, setEditingId] = useState(null);

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
      const method = editingId ? "put" : "post";
      const url = `${process.env.REACT_APP_API_URL}/api/resources${
        editingId ? `/${editingId}` : ""
      }`;
      await axios[method](url, formData);
      toast.success(
        `Resource ${editingId ? "updated" : "added"} successfully!`
      );
      setFormData({ title: "", link: "" });
      setEditingId(null);
      fetchResources();
    } catch (error) {
      console.error("Failed to manage resource:", error);
      toast.error(
        `An error occurred while ${
          editingId ? "updating" : "adding"
        } the resource.`
      );
    }
  };

  const handleEdit = (resource) => {
    setEditingId(resource._id);
    setFormData({ title: resource.title, link: resource.link });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/resources/${id}`
      );
      toast.success("Resource deleted successfully!");
      fetchResources();
    } catch (error) {
      console.error("Failed to delete resource:", error);
      toast.error("Error deleting resource");
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
          <span>Title:</span>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Resource Title"
          />
        </label>
        <label>
          <span>Link:</span>
          <input
            type="url"
            name="link"
            value={formData.link}
            onChange={handleChange}
            placeholder="https://example.com"
          />
        </label>
        <button type="submit">{editingId ? "Update" : "Add"} Resource</button>
      </form>

      <div className="student-sustainability-preview">
        <h2>Student View</h2>
        <ul>
          {resources.map((resource, index) => (
            <li key={index}>
              <a href={resource.link} target="_blank" rel="noopener noreferrer">
                {resource.title}
              </a>
              <button
                className="sustainability-edit-button"
                onClick={() => handleEdit(resource)}
              >
                Edit
              </button>
              <button
                className="sustainability-delete-button"
                onClick={() => handleDelete(resource._id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SustainabilityTeacher;
