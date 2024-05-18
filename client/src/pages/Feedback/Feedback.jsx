import React from "react";
import { useAuth } from "../../context/AuthContext";
import FeedbackTeacher from "../../components/Feedback/FeedbackTeacher";
import FeedbackStudent from "../../components/Feedback/FeedbackStudent";

function Feedback() {
  const { userData } = useAuth();

  // Determine which dashboard to render based on the user's role
  return (
    <div>
      {userData?.role === "teacher" ? <FeedbackTeacher /> : <FeedbackStudent />}
    </div>
  );
}

export default Feedback;
