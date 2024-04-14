import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import "./EditProfile.css";

function Profile() {
  const { userData } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    setUserInfo({ name: userData?.name, email: userData?.email });
  }, [userData]);

  const handleChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/update`, userInfo);
      toast.success("Profile updated successfully!");
      setEditMode(false);
    } catch (error) {
      toast.error("Failed to update profile.");
      console.error(error);
    }
  };

  return (
    <div>
      <div className="profile-container">
        {editMode ? (
          <form onSubmit={handleSubmit}>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={userInfo.name}
              onChange={handleChange}
            />

            <label>Email:</label>
            <input type="email" name="email" value={userInfo.email} disabled />

            <label>New Password (leave blank to keep the same):</label>
            <input
              type="password"
              name="password"
              value={userInfo.password}
              onChange={handleChange}
            />

            <button type="submit" className="save-changes">
              Save changes
            </button>
            <button onClick={() => setEditMode(false)} className="cancel">
              Cancel
            </button>
          </form>
        ) : (
          <div className="profile-view">
            <p>
              <span>Name:</span> {userInfo.name}
            </p>
            <p>
              <span>Email:</span> {userInfo.email}
            </p>
            <p>
              <span>Role:</span> {userData?.role}
            </p>
            <button onClick={() => setEditMode(true)} className="edit-profile">
              Edit profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
