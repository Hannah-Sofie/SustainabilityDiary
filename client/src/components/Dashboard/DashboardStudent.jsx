import React, { useEffect, useState } from "react";
import axios from "axios";
import Greeting from "../Greetings/Greetings";
import SingleReflectionEntry from "../Reflection/SingleReflectionEntry";
import "./Dashboard.css";
import Classes from "../Classes/Classes";

function DashboardStudent() {
  const [latestReflection, setLatestReflection] = useState(null);

  useEffect(() => {
    const fetchReflections = async () => {
      try {
        // Replace with your actual API URL
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/reflections`,
          { withCredentials: true }
        );
        // Sort reflections by createdAt or updatedAt in descending order to get the latest reflection first
        const sortedReflections = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        if (sortedReflections.length > 0) {
          setLatestReflection(sortedReflections[0]);
        }
      } catch (error) {
        console.error("Error fetching reflections:", error);
        // Handle error (e.g., show an error message)
      }
    };

    fetchReflections();
  }, []);

  return (
    <div>
      <Greeting />
      <div className="active-classes">
        <h2>Your classrooms</h2>
        <Classes />
      </div>
      <div className="latest-reflection">
        <h2>Latest reflection</h2>
        {/* Display the latest reflection using SingleReflectionEntry component */}
        {latestReflection ? (
          <SingleReflectionEntry entry={latestReflection} />
        ) : (
          <p>No reflections found.</p> // Fallback content if no reflections are found
        )}
      </div>
    </div>
  );
}

export default DashboardStudent;
