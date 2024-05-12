import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";
import Logo from "../../assets/img/logo.png";

function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div>
      <div className={`container-sidebar ${isCollapsed ? "collapsed" : ""}`}>
        <button onClick={toggleSidebar} className="toggle-sidebar">
          <i
            className={`fas ${
              isCollapsed ? "fa-chevron-right" : "fa-chevron-left"
            }`}
          ></i>
        </button>
        <nav>
          <ul>
            <li className="logo-item">
              <Link to="/dashboard" className="logo">
                <img src={Logo} alt="Logo" />
                <span className="nav-item">SB Diary</span>
              </Link>
            </li>

            <li className="nav-link-item">
              <Link to="/dashboard">
                <i className="fas fa-home"></i>
                <span className="nav-item">Dashboard</span>
              </Link>
            </li>

            <li className="nav-link-item">
              <Link to="/students">
                <i className="fas fa-users"></i>
                <span className="nav-item">Students</span>
              </Link>
            </li>
            <li className="nav-link-item">
              <Link to="/feedback">
                <i className="fas fa-comment"></i>
                <span className="nav-item">Feedback</span>
              </Link>
            </li>
            <li className="nav-link-item">
              <Link to="/classroom">
                <i className="fas fa-chalkboard"></i>
                <span className="nav-item">Classroom</span>
              </Link>
            </li>
            <li className="nav-link-item">
              <Link to="/sustainability">
                <i className="fas fa-leaf"></i>
                <span className="nav-item">Sustainability</span>
              </Link>
            </li>
            <li className="nav-link-item">
              <Link to="/profile">
                <i className="fas fa-user"></i>
                <span className="nav-item">Profile</span>
              </Link>
            </li>
            <li className="nav-link-item">
              <Link to="/help">
                <i className="fas fa-question-circle"></i>
                <span className="nav-item">Help</span>
              </Link>
            </li>
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
