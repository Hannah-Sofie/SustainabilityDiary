import React, { useEffect, useState } from 'react';
import axios from 'axios';

function FeedbackWriterContent({ user }) {
  const [content, setContent] = useState([]);

  useEffect(() => {
  const fetchData = async () => {
    if (user && user._id) {
      if (user.role === 'student') {
        console.log('User is student');
        return;
      }

      try {
        const res = await axios.get(`/api/feedback/writer/${user._id}`);
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
  console.log('Content:', content); 

  return (
    <div>
      {content.map((item, index) => (
        <div key={index}>
          <p>{item.content}</p>
        </div>
      ))}
    </div>
  );
}

export default FeedbackWriterContent;