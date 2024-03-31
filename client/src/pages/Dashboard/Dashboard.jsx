import React from "react";
import { useAuth } from "../../context/AuthContext";
import DashboardTeacher from "../../components/Dashboard/DashboardTeacher";
import DashboardStudent from "../../components/Dashboard/DashboardStudent";

function Dashboard() {
  const { userData } = useAuth();

  // Determine which dashboard to render based on the user's role
  return (
    <div>
      {userData?.role === "teacher" ? (
        <DashboardTeacher />
      ) : (
        <DashboardStudent />
      )}
    </div>
  );
}

export default Dashboard;
