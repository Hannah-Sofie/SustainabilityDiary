import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./config/axiosConfig";
import "./App.css";

// Import layout, protected route components, and other components
import Layout from "./components/Layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// Lazy load pages
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
const Home = lazy(() => import("./pages/Home/Home"));
const Login = lazy(() => import("./pages/Login/Login"));
const Register = lazy(() => import("./pages/Register/Register"));
const NotFound = lazy(() => import("./pages/NotFound/NotFound"));
const Reflections = lazy(() => import("./pages/Reflections/Reflections"));
const Classroom = lazy(() => import("./pages/Classroom/Classroom"));
const ForgotPassword = lazy(() =>
  import("./pages/ForgotPassword/ForgotPassword")
);
const ResetPassword = lazy(() => import("./pages/ResetPassword/ResetPassword"));
const Students = lazy(() => import("./pages/Students/Students"));

function App() {
  return (
    <UserProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Routes without Layout */}
          <Route path="/" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="*" element={<NotFound />} />

          {/* Nested routes within Layout for other pages */}
          <Route path="/" element={<Layout />}>
            <Route
              path="dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="reflections" element={<Reflections />} />
            <Route path="classroom" element={<Classroom />} />
            <Route path="students" element={<Students />} />
          </Route>
        </Routes>
        <ToastContainer />
      </Suspense>
    </UserProvider>
  );
}

export default App;
