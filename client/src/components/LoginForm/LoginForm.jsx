import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import "./LoginForm.css";
import LoginImage from "../../assets/img/login-img.png";
import CustomButton from "../CustomButton/CustomButton";

// Login component for user authentication
function Login() {
  // State to store user credentials
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  
  // Auth context to check if user is authenticated and perform login
  const { isAuthenticated, login } = useAuth();
  
  // Hook to navigate programmatically
  const navigate = useNavigate();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  // Update state when form inputs change
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  // Handle form submission and perform login
  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(credentials);
    if (success) {
      navigate("/dashboard");
    } else {
      console.log("Login failed, not navigating");
    }
  };

  return (
    <div>
      <div className="main-login">
        {/* Button to go back to the home page */}
        <div className="home-button">
          <CustomButton
            name="⬅ Back to home"
            to="/"
            backgroundColor="var(--darker-purple)"
            color="var(--pure-white)"
            hoverBackgroundColor="transparent"
            hoverColor="var(--darker-purple)"
            hoverBorderColor="var(--darker-purple)"
          />
        </div>

        <div className="container-login">
          <div className="login">
            <h1>Login</h1>
            <hr />
            <p>Explore the World!</p>
            
            {/* Login form */}
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={credentials.email}
                  onChange={handleChange}
                  placeholder="username@stud.ntnu.no"
                  required
                />
              </div>
              <div>
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
              </div>
              <p className="forgot-password">
                <Link to="/forgot-password">Forgot password?</Link>
              </p>
              <button type="submit" id="login-button">
                Login
              </button>
              <p className="no-account">
                Don't have an account yet? <br />
                <Link to="/register">Register here</Link>
              </p>
            </form>
          </div>
          <div className="login-pic">
            <img src={LoginImage} alt="Login" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
