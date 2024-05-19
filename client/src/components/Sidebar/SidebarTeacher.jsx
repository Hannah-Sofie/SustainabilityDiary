import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";
import Logo from "../../assets/img/logo.png";

function Sidebar() {
  const { logout } = useAuth(); // Destructure the logout function from the auth context
  const navigate = useNavigate(); // Initialize navigate function for navigation
  const [isCollapsed, setIsCollapsed] = useState(false); // State to manage sidebar collapse/expand state

  // Function to handle user logout
  const handleLogout = async () => {
    await logout(); // Call the logout function from the auth context
    navigate("/login"); // Navigate to the login page after logout
  };

  // Function to toggle the sidebar collapse/expand state
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed); // Toggle the state between true and false
  };

  return (
    <div>
      {/* Sidebar container with dynamic classes based on collapse state */}
      <div className={`container-sidebar ${isCollapsed ? "collapsed" : ""}`}>
        {/* Button to toggle the sidebar */}
        <button onClick={toggleSidebar} className="toggle-sidebar">
          <i
            className={`fas ${
              isCollapsed ? "fa-chevron-right" : "fa-chevron-left"
            }`}
          ></i>
        </button>
        
        {/* Navigation items */}
        <nav>
          <ul>
            {/* Logo item linking to the dashboard */}
            <li className="logo-item">
              <Link to="/dashboard" className="logo">
                <img src={Logo} alt="Logo" />
                <span className="nav-item">SB Diary</span>
              </Link>
            </li>

            {/* Dashboard navigation item */}
            <li className="nav-link-item">
              <Link to="/dashboard">
                <i className="fas fa-home"></i>
                <span className="nav-item">Dashboard</span>
              </Link>
            </li>

            {/* Students navigation item */}
            <li className="nav-link-item">
              <Link to="/students">
                <i className="fas fa-users"></i>
                <span className="nav-item">Students</span>
              </Link>
            </li>

            {/* Feedback navigation item */}
            <li className="nav-link-item">
              <Link to="/feedback">
                <i className="fas fa-comment"></i>
                <span className="nav-item">Feedback</span>
              </Link>
            </li>

            {/* Classroom navigation item */}
            <li className="nav-link-item">
              <Link to="/classroom">
                <i className="fas fa-chalkboard"></i>
                <span className="nav-item">Classroom</span>
              </Link>
            </li>

            {/* Sustainability navigation item */}
            <li className="nav-link-item">
              <Link to="/sustainability">
                <i className="fas fa-leaf"></i>
                <span className="nav-item">Sustainability</span>
              </Link>
            </li>

            {/* Profile navigation item */}
            <li className="nav-link-item">
              <Link to="/profile">
                <i className="fas fa-user"></i>
                <span className="nav-item">Profile</span>
              </Link>
            </li>

            {/* Help navigation item */}
            <li className="nav-link-item">
              <Link to="/help">
                <i className="fas fa-question-circle"></i>
                <span className="nav-item">Help</span>
              </Link>
            </li>

            {/* Logout button */}
            <li className="logout-item">
              <button
                onClick={handleLogout}
                id="logout-button"
                className="logout"
              >
                <i className="fas fa-sign-out-alt"></i>
                <span className="nav-item">Log out</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;
