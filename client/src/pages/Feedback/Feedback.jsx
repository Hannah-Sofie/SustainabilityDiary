import React from 'react';
import FeedbackWriterContent from '../../components/feedback/feedback';
import { useAuth } from '../../context/AuthContext'; 

function Feedback() {
  const { userData, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <div>No user data available</div>;
  }

  return <FeedbackWriterContent user={userData} />;
}

export default Feedback;