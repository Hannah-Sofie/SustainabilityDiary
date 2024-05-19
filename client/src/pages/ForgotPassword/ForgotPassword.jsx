import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "./ForgotPassword.css";
import CustomButton from "../../components/CustomButton/CustomButton";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/request-reset-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      toast.success("Password reset code sent to your email.");
    } catch (error) {
      toast.error(error.message || "An unexpected error occurred.");
    }
  };

  return (
    <div>
      <div className="forgot-password-container">
        <h1>Forgot Password</h1>
        <form onSubmit={handleSubmit} className="forgot-password-form">
          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
            />
          </div>
          <button type="submit">Send Reset Code</button>
          <p>
            Remembered your password? <Link to="/login">Log in</Link>
          </p>
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

export default ForgotPassword;
