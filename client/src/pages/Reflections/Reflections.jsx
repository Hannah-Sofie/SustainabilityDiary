import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./Reflections.css";
import CustomButton from "../../components/CustomButton/CustomButton";
import ReflectionEntries from "../../components/Reflection/ReflectionEntries";
import ReflectionSearchbar from "../../components/Reflection/ReflectionSearchbar";
import ReflectionCount from "../../components/Reflection/ReflectionCount";
import { useAuth } from "../../context/AuthContext";

function Reflections() {
  const [entries, setEntries] = useState([]);
  const { userData } = useAuth();

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/reflections`,
        { headers: { Authorization: `Bearer ${userData.token}` } }
      );
      setEntries(data);
      checkForAchievements(data.length);
    } catch (error) {
      console.error("Failed to fetch reflection entries:", error);
      toast.error("Failed to fetch reflections. Please try again.");
    }
  };

  const checkForAchievements = useCallback(async (count) => {
    // Trigger an achievement every 3 reflections
    if (count % 3 === 0) {
      try {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/achievements`, {
          name: "Reflection Enthusiast",
          description: `Congratulations on creating ${count} reflections!`
        }, {
          headers: { Authorization: `Bearer ${userData.token}` }
        });
        toast.success("Achievement unlocked: Reflection Enthusiast!");
      } catch (error) {
        console.error("Failed to post achievement:", error);
        toast.error("Could not unlock achievement.");
      }
    }
  }, [userData.token]);

  return (
    <div>
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} 
        newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <section className="main-reflection">
        <div className="container-reflection">
          <div className="new-reflection">
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
          <h1>Reflections</h1>
          <ReflectionSearchbar />
          <ReflectionCount count={entries.length} />
          <ReflectionEntries entries={entries} />
        </div>
      </section>
    </div>
  );
}

export default Reflections;
