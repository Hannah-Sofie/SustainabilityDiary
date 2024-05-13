import React, { useEffect, useState } from 'react';
import axios from 'axios';

function FeedbackWriterContent({ user }) {
  const [content, setContent] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (user && user._id) {
        try {
          const res = await axios.get(`/api/feedback/writer/${user._id}`);
          setContent(res.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };

    fetchData();
  }, [user]);

  console.log(content);

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