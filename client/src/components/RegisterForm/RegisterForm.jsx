import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import "./RegisterForm.css";
import RegisterImage from "./img/register-img.png";
import CustomButton from "../CustomButton/CustomButton";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false); // Notice we no longer manage error state here
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/register`,
        formData
      );
      setIsLoading(false);
      // Display success message with react-toastify
      toast.success(data.message || "Registration successful! Please log in.");
      navigate("/login");
    } catch (error) {
      setIsLoading(false);
      const errorMessage =
        error.response?.data?.error ||
        "An unexpected error occurred. Please try again.";
      // Display error message with react-toastify instead of setting an error state
      toast.error(errorMessage);
    }
  };

  return (
    <div>
      <div className="main-register">
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
        <div className="container-register">
          <div className="register-pic">
            <img src={RegisterImage} alt="Register" />
          </div>
          <div className="register">
            <h1>Sign Up</h1>
            <hr />
            <p>Join the community!</p>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="First name + Last name"
                  required
                />
              </div>
              <div>
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="username@stud.ntnu.no"
                  required
                />
              </div>
              <div>
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
              </div>
              <button type="submit" disabled={isLoading}>
                {isLoading ? "Registering..." : "Register"}
              </button>

              <p className="have-account">
                Already have an account?
                <br />
                <Link to="/login">Login here</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
