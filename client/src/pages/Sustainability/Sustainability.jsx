import React from "react";
import { useAuth } from "../../context/AuthContext";
import SustainabilityTeacher from "../../components/Sustainability/SustainabilityTeacher";
import SustainabilityStudent from "../../components/Sustainability/SustainabilityStudent";
function Sustainability() {
  const { userData } = useAuth();

  // Determine which dashboard to render based on the user's role
  return (
    <div>
      {userData?.role === "teacher" ? (
        <SustainabilityTeacher />
      ) : (
        <SustainabilityStudent />
      )}
    </div>
  );
}

export default Sustainability;
