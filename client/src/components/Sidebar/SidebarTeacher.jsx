import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";
import Logo from "./img/logo.png";

function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
  return (
    <div>
      <div className="container-sidebar">
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
              <Link to="/classroom">
                <i className="fas fa-tasks"></i>
                <span className="nav-item">Classroom</span>
              </Link>
            </li>
            <li className="nav-link-item">
              <Link to="/profile">
                <i className="fas fa-user"></i>
                <span className="nav-item">Profile</span>
              </Link>
            </li>
            <li className="nav-link-item">
              <Link href="/help">
                <i className="fas fa-question-circle"></i>
                <span className="nav-item">Help</span>
              </Link>
            </li>
            <li className="logout-item">
              <button onClick={handleLogout} className="logout">
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
