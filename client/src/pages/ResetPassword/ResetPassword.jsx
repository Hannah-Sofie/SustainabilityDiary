// src/pages/ResetPassword/ResetPassword.jsx

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./ResetPassword.css";
import CustomButton from "../../components/CustomButton/CustomButton";

function ResetPassword() {
  const [formData, setFormData] = useState({
    code: "",
    email: "",
    newPassword: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/reset-password`,
        formData
      );
      toast.success("Password reset successfully. Please log in.");
      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.error || "An unexpected error occurred."
      );
    }
  };

  return (
    <div>
      <div className="reset-password-container">
        <h1>Reset Password</h1>
        <form onSubmit={handleSubmit} className="reset-password-form">
          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              required
            />
          </div>
          <div>
            <label htmlFor="code">Reset Code</label>
            <input
              id="code"
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="Enter the reset code you received"
              required
            />
          </div>
          <div>
            <label htmlFor="newPassword">New Password</label>
            <input
              id="newPassword"
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter your new password"
              required
            />
          </div>
          <button type="submit">Reset Password</button>
        </form>
        <div className="home-button">
          <CustomButton
            name="⬅ Back to home"
            to="/"
            backgroundColor="var(--darker-purple)"
            color="var(--white)"
            hoverBackgroundColor="transparent"
            hoverColor="var(--darker-purple)"
            hoverBorderColor="var(--darker-purple)"
          />
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
