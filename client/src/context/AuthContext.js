import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/status`,
          {
            withCredentials: true,
          }
        );
        if (response.data.isAuthenticated) {
          // Determine role based on email domain
          const role = response.data.user.email.endsWith("@ntnu.no")
            ? "teacher"
            : "student";
          // Include role in userData
          setUserData({ ...response.data.user, role });
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setUserData(null);
        }
      } catch (error) {
        setIsAuthenticated(false);
        setUserData(null);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/login`,
        credentials,
        { withCredentials: true }
      );
      if (response.data.status === "success") {
        // Determine role based on email domain
        const role = response.data.user.email.endsWith("@ntnu.no")
          ? "teacher"
          : "student";
        // Include role in userData
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

  const logout = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/logout`,
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
    <AuthContext.Provider value={{ userData, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
