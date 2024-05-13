import { useState } from "react";
import { Link } from "react-router-dom";
import "./FavouriteClasses.css";
import DefaultImage from "../../assets/img/default-classroom.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/AuthContext";

// Replace with your environment variable or direct API URL if not using env variables.
const baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function FavouriteClasses({ classrooms }) {
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

  if (!classrooms || !classrooms.length) {
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
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

export default FavouriteClasses;
