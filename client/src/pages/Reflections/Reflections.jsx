import React, { useEffect, useState } from "react";
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
    const fetchEntries = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/reflections`,
          { headers: { Authorization: `Bearer ${userData.token}` } }
        );
        setEntries(data);
      } catch (error) {
        console.error("Failed to fetch reflection entries:", error);
        toast.error("Failed to fetch reflections. Please try again.");
      }
    };
  
    fetchEntries();
  }, [userData.token]); // Include all external variables that the function depends on
  
  
  const fetchEntries = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/reflections`,
        { headers: { Authorization: `Bearer ${userData.token}` } }
      );
      setEntries(data);
    } catch (error) {
      console.error("Failed to fetch reflection entries:", error);
      toast.error("Failed to fetch reflections. Please try again.");
    }
  };

  const createReflection = async (reflectionData) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/reflections/create`,
        reflectionData,
        { headers: { Authorization: `Bearer ${userData.token}` } }
      );
  
      // Handle achievement creation notification
      if (response.data.achievementCreated) {
        toast.success("New achievement unlocked: Reflection Enthusiast!");
      }
  
      // Additional logic to update UI as necessary
    } catch (error) {
      console.error("Error creating reflection:", error);
      toast.error("Failed to create reflection. Please try again.");
    }
  };
  
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
