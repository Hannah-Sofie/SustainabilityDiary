import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReflectionModal from "../Reflection/ReflectionModal";

function FeedbackWriterContent({ user }) {
  const [content, setContent] = useState([]);
  const [selectedReflection, setSelectedReflection] = useState(null);
  const [loadingReflection, setLoadingReflection] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (user && user._id) {
        try {
          let res;
          if (user.role === 'student') {
            res = await axios.get(`/api/feedback/student/${user._id}`);
          } else {
            res = await axios.get(`/api/feedback/writer/${user._id}`);
          }
          console.log('Response data:', res.data);
          setContent(res.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      } else {
        console.log('User or user._id is undefined');
      }
    };

    fetchData();
  }, [user, user?._id]);

  const handleCardClick = async (entry) => {
    console.log('Selected entry:', entry);
    setLoadingReflection(true);
    try {
      const response = await axios.get(`/api/reflections/${entry.reflectionId}`);
      setSelectedReflection(response.data);
    } catch (error) {
      console.error('Error fetching reflection:', error);
    } finally {
      setLoadingReflection(false);
    }
  };

  return (
    <div>
      <h1>Feedbacks</h1>
      {content.map((entry) => (
        <div
          key={entry._id}
          className="reflection_card"
          onClick={() => handleCardClick(entry)}
        >
          <p>{entry.content}</p>
          <p>Written by: {entry.writerName}</p>
        </div>
      ))}
      {loadingReflection && <p>Loading reflection details...</p>}
      {selectedReflection && (
        <ReflectionModal
          entry={selectedReflection}
          onClose={() => setSelectedReflection(null)}
        />
      )}
    </div>
  );
}

export default FeedbackWriterContent;
