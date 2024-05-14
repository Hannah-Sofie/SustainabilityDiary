import { useState } from "react";
import { Link } from "react-router-dom";
import "./FavouriteClasses.css";
import DefaultImage from "../../assets/img/default-classroom.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faStar } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

// Replace with your environment variable or direct API URL if not using env variables.
const baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function FavouriteClasses({ classrooms, setClassrooms }) {
  // Add a search state
  const [search, setSearch] = useState("");

  // Add a search handler
  const handleSearch = (event) => {
    setSearch(event.target.value.toLowerCase());
  };

  const { userData } = useAuth();

  // Filter the classrooms based on the search input, search on the classroom title
  // Ensure classrooms is an array before filtering to avoid errors in dashboard
  const filteredClassrooms = Array.isArray(classrooms)
    ? classrooms.filter((classroom) => {
        const matchesSearch = classroom.title.toLowerCase().includes(search);
        return matchesSearch && classroom.favourites.includes(userData._id);
      })
    : [];

  const handleFavourite = async (id) => {
    try {
      const response = await axios.post(`/api/classrooms/fave/${id}`);
      const updatedClassroom = response.data;
      const updatedClassrooms = classrooms.map((classroom) =>
        classroom._id === id ? updatedClassroom : classroom
      );
      setClassrooms(updatedClassrooms); // Update the classrooms state
    } catch (error) {
      console.error("Error favoriting classroom:", error);
    }
  };

  const handleUnfavourite = async (id) => {
    try {
      const response = await axios.post(`/api/classrooms/unfave/${id}`);
      const updatedClassroom = response.data;
      const updatedClassrooms = classrooms.map((classroom) =>
        classroom._id === id ? updatedClassroom : classroom
      );
      setClassrooms(updatedClassrooms); // Update the classrooms state
    } catch (error) {
      console.error("Error unfavoriting classroom:", error);
    }
  };

  return (
    <div className="main-class-dashboard">
      <section className="container-class">
        <div className="class-box">
          <div className="classesHeader">
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

          {filteredClassrooms.length === 0 ? (
            <div className="no-classrooms-dashboard">
              You haven't favorited any classrooms yet.
            </div>
          ) : (
            <div className="class">
              {/*Map over the filtered classrooms*/}
              {filteredClassrooms.map((classroom, index) => {
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
                    {userData && (
                      <FontAwesomeIcon
                        icon={faStar}
                        className={`star-icon ${
                          classroom.favourites.includes(userData._id)
                            ? "favorite"
                            : ""
                        }`}
                        onClick={() =>
                          classroom.favourites.includes(userData._id)
                            ? handleUnfavourite(classroom._id)
                            : handleFavourite(classroom._id)
                        }
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default FavouriteClasses;
