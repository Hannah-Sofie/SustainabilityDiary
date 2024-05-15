import React from "react";
import { useAuth } from "../../context/AuthContext";
import HelpTeacher from "../../components/Help/HelpTeacher";
import HelpStudent from "../../components/Help/HelpStudent";

function Help() {
  const { userData } = useAuth();

  // Determine which dashboard to render based on the user's role
  return (
    <div>
      {userData?.role === "teacher" ? <HelpTeacher /> : <HelpStudent />}
    </div>
  );
}

export default Help;
