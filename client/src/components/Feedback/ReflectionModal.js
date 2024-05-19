import React, { useState, useEffect } from "react";
import axios from "axios";
import DefaultImage from "../../assets/img/default-image.jpg";
import profileImage from "../../assets/img/profile-silhouette.png";
import "react-toastify/dist/ReactToastify.css";
import "./ReflectionModal.css";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

function ReflectionModal({ entry, onClose, onFeedbackSubmit }) {
  const [feedbacks, setFeedbacks] = useState([]); // State to store feedbacks for the reflection
  const { userData } = useAuth(); // Access user data from the authentication context

  useEffect(() => {
    // Fetch feedbacks for the given reflection when the component mounts or entry._id changes
    const fetchFeedbacks = async () => {
      try {
        const res = await axios.get(`/api/feedback/reflection/${entry._id}`);
        setFeedbacks(res.data); // Set the fetched feedbacks in state
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
        toast.error("Error fetching feedbacks."); // Display error toast
      }
    };

    fetchFeedbacks();
  }, [entry._id]);

  if (!entry) return null; // Return null if no entry is provided

  // Determine the image URL for the reflection
  const imageUrl = entry.photo
    ? `${process.env.REACT_APP_API_URL}/uploads/reflections/${entry.photo}`
    : DefaultImage;

  // Handle feedback submission
  const handleFeedbackSubmit = async (event) => {
    event.preventDefault();
    const feedbackField = document.getElementById("feedback");
    const feedback = feedbackField.value;

    if (!userData || !userData.name) {
      toast.error("User name is not available.");
      return;
    }

    const newFeedback = {
      reflectionId: entry._id,
      content: feedback,
    };

    // Optimistic UI update
    setFeedbacks((prevFeedbacks) => [
      ...prevFeedbacks,
      {
        ...newFeedback,
        writerName: userData.name,
        writer: userData._id,
      },
    ]);

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/feedback/give-feedback`,
        newFeedback
      );
      toast.success("Feedback submitted successfully.");
      feedbackField.value = ""; // Clear the comment field
      onFeedbackSubmit(entry._id); // Update feedback status in the parent component
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Error submitting feedback.");
      // Rollback optimistic UI update in case of error
      setFeedbacks((prevFeedbacks) =>
        prevFeedbacks.filter((fb) => fb.content !== feedback)
      );
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>{entry.title}</h2>
        {entry.photo && <img src={imageUrl} alt={entry.title} />}
        <p>{entry.body}</p>
        <div className="modal_splitline"></div>
        <div id="feedback-container">
          {feedbacks.map((feedback) => (
            <div key={feedback._id || feedback.content}>
              <p>{feedback.content}</p>
              <p className="feedback-container_author">
                Written by: {feedback.writerName}
              </p>
            </div>
          ))}
        </div>
        {userData && userData.role === "teacher" && (
          <form id="feedback-form" onSubmit={handleFeedbackSubmit}>
            <div>
              <img src={profileImage} alt="Profile" />
              <label htmlFor="feedback">Give Feedback:</label>
            </div>
            <textarea id="feedback" name="feedback"></textarea>
            <button type="submit">Submit Feedback</button>
          </form>
        )}
        <button onClick={onClose} className="button-cancel">
          Close
        </button>
      </div>
    </div>
  );
}

export default ReflectionModal;
