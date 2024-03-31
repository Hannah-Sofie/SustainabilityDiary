import React from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Layout.css";
import SidebarTeacher from "../Sidebar/SidebarTeacher";
import SidebarStudent from "../Sidebar/SidebarStudent";

const Layout = () => {
  const { userData } = useAuth();

  return (
    <div className="layout-container">
      {/* Render the appropriate sidebar based on the user's role */}
      {userData?.role === "teacher" ? <SidebarTeacher /> : <SidebarStudent />}

      <main className="main-content">
        <div className="main-top">
          <i className="fas fa-user-cog"></i>
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
