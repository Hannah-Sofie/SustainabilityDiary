import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Reflections.css";
import CustomButton from "../../components/CustomButton/CustomButton";
import ReflectionEntries from "../../components/Reflection/ReflectionEntries";
import { useAuth } from "../../context/AuthContext";

function Reflections() {
  const [entries, setEntries] = useState([]);
  const { userData } = useAuth();

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/reflections`,
          {
            headers: { Authorization: `Bearer ${userData.token}` },
            withCredentials: true,
          }
        );
        setEntries(data);
      } catch (error) {
        console.error("Failed to fetch reflection entries:", error);
        toast.error("Failed to fetch reflections. Please try again.");
      }
    };

    fetchEntries();
  }, [userData.token]);
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
          <ReflectionEntries entries={entries} />
        </div>
      </section>
    </div>
  );
}

export default Reflections;
