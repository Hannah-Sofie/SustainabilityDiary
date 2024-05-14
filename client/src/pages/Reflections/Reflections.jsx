import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Reflections.css";
import CustomButton from "../../components/CustomButton/CustomButton";
import ReflectionEntries from "../../components/Reflection/ReflectionEntries";
import ReflectionCount from "../../components/Reflection/ReflectionCount";

function Reflections() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/reflections`,
          { withCredentials: true },
        );
        setEntries(data); // Set fetched entries to state
      } catch (error) {
        console.error("Failed to fetch reflection entries:", error);
        // Handle error
      }
    };
    fetchEntries();
  }, []);

  return (
    <div>
      <section className="main-reflection">
        <div className="container-reflection">
          <div className="header-container-reflection">
            <h1>Reflections</h1>
            <CustomButton
              name="+ Create a new reflection"
              to="/new-reflection-entry"
              backgroundColor="var(--darker-purple)"
              color="var(--pure-white)"
              hoverBackgroundColor="transparent"
              hoverColor="var(--darker-purple)"
              hoverBorderColor="var(--darker-purple)"
            />
          </div>
          <ReflectionCount count={entries.length} />
          <ReflectionEntries entries={entries} />
        </div>
      </section>
    </div>
  );
}

export default Reflections;
