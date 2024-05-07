import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        console.log("Checking authentication status...");
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/users/status`,
          { withCredentials: true }
        );
        console.log("Auth status response:", response);

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
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/login`,
        credentials,
        { withCredentials: true }
      );
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

  const logout = async () => {
    try {
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

export const useAuth = () => useContext(AuthContext);
