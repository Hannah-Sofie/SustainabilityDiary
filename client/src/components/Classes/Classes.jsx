import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Classes.css";
import DefaultImage from "../../assets/img/default-classroom.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faStar } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

// Base URL for API requests
const baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function Classes({ classrooms: initialClassrooms }) {
  // State to manage search input
  const [search, setSearch] = useState("");
  // State to manage filter type
  const [filter, setFilter] = useState("All");
  // State to manage filtered classrooms
  const [filteredClassrooms, setFilteredClassrooms] = useState(initialClassrooms || []);
  const { userData } = useAuth();

  // Update filtered classrooms when initial classrooms change
  useEffect(() => {
    setFilteredClassrooms(initialClassrooms);
  }, [initialClassrooms]);

  // Handle search input change
  const handleSearch = (event) => {
    setSearch(event.target.value.toLowerCase());
  };

  // Handle filter type change
  const handleFilterChange = (filterType) => {
    setFilter(filterType);
  };

  // Handle favoriting a classroom
  const handleFavourite = async (id) => {
    try {
      const response = await axios.post(
        `${baseURL}/api/classrooms/fave/${id}`,
        {},
        { headers: { Authorization: `Bearer ${userData.token}` } }
      );
      updateClassroomFavourites(response.data);
    } catch (error) {
      console.error("Error favoriting classroom:", error);
    }
  };

  // Handle unfavoriting a classroom
  const handleUnfavourite = async (id) => {
    try {
      const response = await axios.post(
        `${baseURL}/api/classrooms/unfave/${id}`,
        {},
        { headers: { Authorization: `Bearer ${userData.token}` } }
      );
      updateClassroomFavourites(response.data);
    } catch (error) {
      console.error("Error unfavoriting classroom:", error);
    }
  };

  // Update the list of classrooms with new favorites
  const updateClassroomFavourites = (updatedClassroom) => {
    setFilteredClassrooms((prevClassrooms) =>
      prevClassrooms.map((classroom) =>
        classroom._id === updatedClassroom._id ? updatedClassroom : classroom
      )
    );
  };

  // Filter and search classrooms
  const filteredAndSearchedClassrooms = Array.isArray(filteredClassrooms)
    ? filteredClassrooms.filter((classroom) => {
        const matchesSearch = classroom.title.toLowerCase().includes(search);

        if (filter === "All") {
          return matchesSearch;
        } else if (filter === "Active") {
          return matchesSearch && classroom.classStatus === true;
        } else if (filter === "Finished") {
          return matchesSearch && classroom.classStatus === false;
        } else if (filter === "Favourites") {
          return matchesSearch && classroom.favourites.includes(userData._id);
        } else {
          return false;
        }
      })
    : [];

  // Display message if no classrooms are available
  if (!initialClassrooms || !initialClassrooms.length) {
    return (
      <div className="no-classrooms">
        No classrooms available or still loading...
      </div>
    );
  }

  return (
    <div className="main-class">
      <section className="container-class">
        <div className="class-box">
          <div className="classesHeader">
            {/* Filter options */}
            <ul className="class-filter">
              <li
                className={filter === "All" ? "active" : ""}
                onClick={() => handleFilterChange("All")}
              >
                All classes
              </li>
              <li
                className={filter === "Active" ? "active" : ""}
                onClick={() => handleFilterChange("Active")}
              >
                Active Classes
              </li>
              <li
                className={filter === "Finished" ? "active" : ""}
                onClick={() => handleFilterChange("Finished")}
              >
                Finished Classes
              </li>
              <li
                className={filter === "Favourites" ? "active" : ""}
                onClick={() => handleFilterChange("Favourites")}
              >
                Favourite Classes
              </li>
            </ul>

            {/* Search input */}
            <div className="inputSearch">
              <FontAwesomeIcon icon={faSearch} className="fa-search-icon" />
              <input
                placeholder="Search Classrooms"
                onChange={handleSearch}
                value={search}
              ></input>
            </div>
          </div>

          <div className="class">
            {/* Map over the filtered classrooms */}
            {filteredAndSearchedClassrooms.map((classroom, index) => {
              const iconUrl = classroom.iconPhotoUrl
                ? `${baseURL}${classroom.iconPhotoUrl}`
                : DefaultImage;

              return (
                <div key={index} className="box">
                  <img
                    src={iconUrl}
                    alt={classroom.title}
                    className="classroom-icon"
                  />
                  <h3>{classroom.title}</h3>
                  <p>{classroom.description}</p>
                  <Link
                    to={`/classroom/${classroom._id}`}
                    className="button-link"
                  >
                    Open
                  </Link>
                  {userData && !classroom.favourites.includes(userData._id) && (
                    <FontAwesomeIcon
                      icon={faStar}
                      className="star-icon"
                      onClick={() => handleFavourite(classroom._id)}
                    />
                  )}
                  {userData && classroom.favourites.includes(userData._id) && (
                    <FontAwesomeIcon
                      icon={faStar}
                      className="star-icon favorite"
                      onClick={() => handleUnfavourite(classroom._id)}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Classes;
