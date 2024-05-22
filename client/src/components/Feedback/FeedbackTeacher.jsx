import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ReflectionModal from "../Feedback/ReflectionModal";
import "./Feedback.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import DefaultImage from "../../assets/img/default-image.jpg";
import { useAuth } from "../../context/AuthContext";

function FeedbackTeacher() {
  const { userData } = useAuth(); // Access user data from the authentication context
  const [reflections, setReflections] = useState([]); // State to store reflections
  const [selectedReflection, setSelectedReflection] = useState(null); // State to store the selected reflection
  const [loadingReflection, setLoadingReflection] = useState(false); // State to handle loading state
  const [search, setSearch] = useState(""); // State to store search input
  const [filter, setFilter] = useState("All"); // State to store filter type

  // Fetch reflections data from the API
  const fetchData = useCallback(async () => {
    if (userData && userData._id) {
      try {
        const res = await axios.get(`/api/feedback/requested-feedback`, {
          withCredentials: true,
        });
        setReflections(res.data); // Set reflections state with fetched data
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch reflections."); // Display error toast
      }
    } else {
      console.log("User or user._id is undefined");
    }
  }, [userData]);

  // Fetch data when the component mounts or when userData changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle card click to view reflection details
  const handleCardClick = (reflection) => {
    setLoadingReflection(true);
    try {
      setSelectedReflection(reflection); // Set the selected reflection
    } catch (error) {
      console.error("Error fetching reflection:", error);
      toast.error("Failed to fetch reflection.");
    } finally {
      setLoadingReflection(false);
    }
  };

  // Handle search input change
  const handleSearch = (event) => {
    setSearch(event.target.value.toLowerCase());
  };

  // Handle filter change
  const handleFilterChange = (filterType) => {
    setFilter(filterType);
  };

  // Update reflections state when feedback is submitted
  const handleFeedbackSubmit = (reflectionId) => {
    setReflections((prevReflections) =>
      prevReflections.map((reflection) =>
        reflection._id === reflectionId
          ? { ...reflection, feedbackGiven: true }
          : reflection
      )
    );
  };

  // Filter and search reflections based on search input and filter type
  const filteredAndSearchedReflections = reflections.filter((reflection) => {
    const matchesSearch = reflection.title.toLowerCase().includes(search);

    if (filter === "All") {
      return matchesSearch;
    } else if (filter === "Given") {
      return matchesSearch && reflection.feedbackGiven;
    } else if (filter === "NotGiven") {
      return matchesSearch && !reflection.feedbackGiven;
    } else {
      return false;
    }
  });

  return (
    <div className="feedbacks">
      <div className="feedback-container">
        <h1>Feedbacks</h1>
        <div className="classesHeader">
          <ul className="class-filter">
            <li
              className={filter === "All" ? "active" : ""}
              onClick={() => handleFilterChange("All")}
            >
              All Reflections
            </li>
            <li
              className={filter === "Given" ? "active" : ""}
              onClick={() => handleFilterChange("Given")}
            >
              Given Feedback
            </li>
            <li
              className={filter === "NotGiven" ? "active" : ""}
              onClick={() => handleFilterChange("NotGiven")}
            >
              Not Given Feedback
            </li>
          </ul>

          <div className="inputSearch">
            <FontAwesomeIcon icon={faSearch} className="fa-search-icon" />
            <input
              placeholder="Search Reflections"
              onChange={handleSearch}
              value={search}
            />
          </div>
        </div>
        <div className="feedback-entries">
          {filteredAndSearchedReflections.length === 0 ? (
            <p>No feedback available.</p>
          ) : (
            filteredAndSearchedReflections.map((reflection) => (
              <div key={reflection._id} className="feedback-entry">
                <div
                  className="reflection-card"
                  onClick={() => handleCardClick(reflection)}
                >
                  <div className="entry-image">
                    <img
                      src={
                        reflection.photo
                          ? `${process.env.REACT_APP_API_URL}/uploads/reflections/${reflection.photo}`
                          : DefaultImage
                      }
                      alt={reflection.title}
                    />
                  </div>
                  <h3>{reflection.title}</h3>
                  <p>
                    Student:{" "}
                    {reflection.userId ? reflection.userId.name : "Unknown"}
                  </p>
                </div>
              </div>
            ))
          )}
          {loadingReflection && <p>Loading reflection details...</p>}
          {selectedReflection && (
            <ReflectionModal
              entry={selectedReflection}
              onClose={() => setSelectedReflection(null)}
              onFeedbackSubmit={handleFeedbackSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default FeedbackTeacher;
