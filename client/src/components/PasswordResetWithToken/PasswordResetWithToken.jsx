import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './PasswordResetWithToken.css';

// Component for resetting the password using a token
function PasswordResetWithToken() {
  // Get token from URL parameters
  const { token } = useParams();
  
  // Initialize navigation and location hooks
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract email from the URL query parameters
  const email = new URLSearchParams(location.search).get('email');

  // State to store new password and confirmation password
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Verify the token when the component mounts
  useEffect(() => {
    const verifyToken = async () => {
      try {
        await axios.get(`${process.env.REACT_APP_API_URL}/api/users/verify-token/${token}`);
      } catch (error) {
        toast.error("Invalid or expired token.");
        navigate('/login');
      }
    };

    verifyToken();
  }, [token, navigate]);

  // Handle form submission for resetting the password
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/users/reset-password`, {
        newPassword,
        token
      });
      toast.success("Your password has been reset successfully. Please log in.");
      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.error || "An unexpected error occurred."
      );
    }
  };

  return (
    <div className="password-reset-container">
      <h1>Reset Password for {email}</h1>
      <form onSubmit={handleSubmit} className="password-reset-form">
        <div className="form-group">
          <label htmlFor="newPassword">New Password</label>
          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            placeholder="Enter new password"
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Confirm new password"
          />
        </div>
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
}

export default PasswordResetWithToken;
