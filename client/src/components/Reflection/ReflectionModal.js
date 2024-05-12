import React, { useEffect, useState } from "react";
import axios from 'axios';
import DefaultImage from "../../assets/img/default-image.jpg";
import profileImage from "../../assets/img/profile-silhouette.png";
import "./ReflectionModal.css";

function ReflectionModal({ entry, onClose, user }) {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await axios.get(`/api/feedback/${entry._id}`);
        setFeedbacks(res.data);
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
      }
    };

    fetchFeedbacks();
  }, [entry._id]);

  if (!entry) return null;

  const imageUrl = entry.photo
    ? `${process.env.REACT_APP_API_URL}/uploads/${entry.photo}`
    : DefaultImage;

  const handleFeedbackSubmit = async (event) => {
    event.preventDefault();
    const feedback = document.getElementById('feedback').value;
    if (!user || !user.name) {
      alert('User name is not available');
      return;
    }
    try {
      await axios.post('/api/feedback', {
        reflectionId: entry._id,
        writer: user._id,
        writerName: user.name,
        content: feedback
      });
      alert('Feedback submitted successfully');
      
    } catch (error) {
      console.error('Error submitting feedback:', error);
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
            <div key={feedback._id}>
              <p>{feedback.content}</p>
              <p className="feedback-container_author">Written by: {feedback.writerName}</p>
            </div>
          ))}
        </div>
        {user.role === 'teacher' && (
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