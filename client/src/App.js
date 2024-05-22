import React, { Suspense } from "react";
import { Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./config/axiosConfig";
import { useAuth } from "./context/AuthContext";
import LoadingIndicator from "./components/LoadingIndicator/LoadingIndicator";

import AppRoutes from "./routes/AppRoutes";

function App() {
  const { loading } = useAuth();

  if (loading) {
    // Show a loading indicator while checking auth status
    return <LoadingIndicator />;
  }

  return (
    <Suspense fallback={<LoadingIndicator />}>
      <Routes>{AppRoutes}</Routes>
      <ToastContainer />
    </Suspense>
  );
}

export default App;
