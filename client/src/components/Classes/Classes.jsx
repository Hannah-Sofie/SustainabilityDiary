import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Classes.css";
import DefaultImage from "../../assets/img/default-classroom.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faStar } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

// Replace with your environment variable or direct API URL if not using env variables.
const baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function Classes({ classrooms: initialClassrooms }) {
  // Add a search state
  const [search, setSearch] = useState("");
  // State to filter the classrooms out based on type we choose
  const [filter, setFilter] = useState("All");
  const [filteredClassrooms, setFilteredClassrooms] = useState(
    initialClassrooms || []
  );

  const { userData } = useAuth();

  useEffect(() => {
    setFilteredClassrooms(initialClassrooms);
  }, [initialClassrooms]);

  // Add a search handler
  const handleSearch = (event) => {
    setSearch(event.target.value.toLowerCase());
  };

  const handleFilterChange = (filterType) => {
    setFilter(filterType);
  };

  const handleFavourite = async (id) => {
    try {
      const response = await axios.post(
        `${baseURL}/api/classrooms/fave/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${userData.token}` },
        }
      );
      // Update the classroom's favourites list locally
      updateClassroomFavourites(response.data);
    } catch (error) {
      console.error("Error favoriting classroom:", error);
    }
  };

  const handleUnfavourite = async (id) => {
    try {
      const response = await axios.post(
        `${baseURL}/api/classrooms/unfave/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${userData.token}` },
        }
      );
      // Update the classroom's favourites list locally
      updateClassroomFavourites(response.data);
    } catch (error) {
      console.error("Error unfavoriting classroom:", error);
    }
  };

  const updateClassroomFavourites = (updatedClassroom) => {
    setFilteredClassrooms((prevClassrooms) =>
      prevClassrooms.map((classroom) =>
        classroom._id === updatedClassroom._id ? updatedClassroom : classroom
      )
    );
  };

  // Filter the classrooms based on the search input, search on the classroom title
  // Ensure classrooms is an array before filtering to avoid errors in dashboard
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

            {/* Add a search input */}
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
            {/*Map over the filtered classrooms*/}
            {filteredAndSearchedClassrooms.map((classroom, index) => {
              // Use the baseURL with the classroom's `iconPhotoUrl`
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
