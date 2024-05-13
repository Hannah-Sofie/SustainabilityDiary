import React from "react";
import FeedbackWriterContent from '../../components/feedback/feedback';

function Feedback({ user }) {
  return (
    <div>
      <h1>Feedback</h1>
      <FeedbackWriterContent user={user} />
    </div>
  );
}

export default Feedback;