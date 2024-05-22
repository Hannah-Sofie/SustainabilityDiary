import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// Create a context for authentication
const AuthContext = createContext();

// AuthProvider component to provide authentication state and functions
export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null); // State to store user data
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State to track if the user is authenticated
  const [loading, setLoading] = useState(true); // State to track loading status

  // Effect to check authentication status when the component mounts
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Log checking authentication status
        console.log("Checking authentication status...");

        // Make a request to check authentication status
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/users/status`,
          { withCredentials: true }
        );

        // Set user data and authentication status based on response
        if (response.data.isAuthenticated) {
          const role = response.data.user.email.endsWith("@ntnu.no")
            ? "teacher"
            : "student";
          setUserData({ ...response.data.user, role });
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setUserData(null);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        setIsAuthenticated(false);
        setUserData(null);
      } finally {
        setLoading(false); // Set loading to false after the check is complete
      }
    };

    checkAuthStatus();
  }, []);

  // Function to handle user login
  const login = async (credentials) => {
    try {
      // Make a request to log in the user
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/login`,
        credentials,
        { withCredentials: true }
      );

      // If login is successful, set user data and authentication status
      if (response.data.status === "success") {
        const role = response.data.user.email.endsWith("@ntnu.no")
          ? "teacher"
          : "student";
        setUserData({ ...response.data.user, role });
        setIsAuthenticated(true);
        return true;
      } else {
        toast.error(
          response.data.message ||
            "Login failed: Incorrect username or password."
        );
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(
        error.response?.data?.message ||
          "Login failed: Incorrect username or password."
      );
      return false;
    }
  };

  // Function to handle user logout
  const logout = async () => {
    try {
      // Make a request to log out the user
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/logout`,
        {},
        { withCredentials: true }
      );
      setUserData(null);
      setIsAuthenticated(false);
      toast.success("Logged out successfully.");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userData,
        setUserData,
        isAuthenticated,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);
