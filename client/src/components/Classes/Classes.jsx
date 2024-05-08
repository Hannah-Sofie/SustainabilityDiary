import { useState } from "react";
import { Link } from "react-router-dom";
import "./Classes.css";
import DefaultImage from "../../assets/img/default-classroom.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

// Replace with your environment variable or direct API URL if not using env variables.
const baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function Classes({ classrooms }) {
  // Add a search state
  const [search, setSearch] = useState("");

  // State to filter the classrooms out based on type we choose
  const [filter, setFilter] = useState("All");

  // Add a search handler
  const handleSearch = (event) => {
    setSearch(event.target.value.toLowerCase());
  };

  const handleFilterChange = (filterType) => {
    setFilter(filterType);
  };

  // Filter the classrooms based on the search input, search on the classroom title
  // Ensure classrooms is an array before filtering to avoid errors in dashboard
  const filteredClassrooms = Array.isArray(classrooms)
    ? classrooms.filter((classroom) => {
        const matchesSearch = classroom.title.toLowerCase().includes(search);

        if (filter === "All") {
          return matchesSearch;
        } else if (filter === "Active") {
          return matchesSearch && classroom.classStatus === true;
        } else if (filter === "Finished") {
          return matchesSearch && classroom.classStatus === false;
        }
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

export default Classes;
