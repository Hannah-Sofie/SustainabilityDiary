import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import "./Register.css";
import RegisterImage from "../../assets/img/register-img.png";
import CustomButton from "../../components/CustomButton/CustomButton";

function Register() {
  // State variables to manage form data and loading state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/register`,
        formData
      );
      setIsLoading(false);
      toast.success(data.message || "Registration successful! Please log in.");
      navigate("/login");
    } catch (error) {
      setIsLoading(false);
      const errorMessage =
        error.response?.data?.error ||
        "An unexpected error occurred. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div>
      <div className="main-register">
        {/* Home button to navigate back to the homepage */}
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
          {/* Registration image */}
          <div className="register-pic">
            <img src={RegisterImage} alt="Register" />
          </div>
          {/* Registration form */}
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
