import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import DefaultImage from "../../assets/img/default-profilepic.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import "./EditProfile.css";

function Profile() {
  const { userData, setUserData } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [photo, setPhoto] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    // Update user info with existing data
    setUserInfo({ name: userData?.name, email: userData?.email });
    // Set previewImage to null initially since no new photo is being uploaded
    setPreviewImage(null);
  }, [userData]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);

    // Update the preview image only if a file is selected
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setPreviewImage(null);
    }
  };

  const handleChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a FormData object to handle file uploads
    const formData = new FormData();
    formData.append("name", userInfo.name);
    formData.append("password", userInfo.password);

    // Add the photo file if one is selected
    if (photo) {
      formData.append("photo", photo);
    }

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/users/update`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === "success") {
        toast.success("Profile updated successfully!");

        // Update user data context to reflect new information
        setUserData(response.data.user);

        setEditMode(false);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error(
        "Failed to update profile: " +
          (error.response?.data?.message || error.message)
      );
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

            <div className="file-upload">
              <label
                htmlFor="profile-photo-upload"
                className="file-upload-label"
              >
                <FontAwesomeIcon icon={faUpload} /> Upload new profile photo
              </label>
              <input
                id="profile-photo-upload"
                type="file"
                name="photo"
                onChange={handlePhotoChange}
                accept="image/*"
                style={{ display: "none" }}
              />

              {previewImage && (
                <img
                  src={previewImage}
                  alt="Profile Preview"
                  className="profile-photo-preview"
                />
              )}
            </div>

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
              {userData?.photo ? (
                <img
                  src={`${process.env.REACT_APP_API_URL}/uploads/profilepics/${userData.photo}`}
                  alt="Profile"
                  className="profile-photo"
                />
              ) : (
                <img
                  src={DefaultImage}
                  alt="Default profile"
                  className="profile-photo"
                />
              )}
            </p>

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
