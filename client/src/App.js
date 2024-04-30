import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./config/axiosConfig.js";
import { useAuth } from "./context/AuthContext.js";
import LoadingIndicator from "./components/LoadingIndicator/LoadingIndicator.jsx";

// Import layout, protected route components, and other components
import Layout from "./components/Layout/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import NewReflectionEntry from "./components/Reflection/NewReflectionEntry.jsx";
import ReflectionEntries from "./components/Reflection/ReflectionEntries.jsx";
import EditReflectionEntry from "./components/Reflection/EditReflectionEntry.jsx";
import CreateClassroom from "./components/Classroom/CreateClassroom.js";
import ClassroomDetail from "./components/Classroom/ClassroomDetail.js";

// Lazy load pages
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard.jsx"));
const Home = lazy(() => import("./pages/Home/Home.jsx"));
const Login = lazy(() => import("./pages/Login/Login.jsx"));
const Register = lazy(() => import("./pages/Register/Register.jsx"));
const NotFound = lazy(() => import("./pages/NotFound/NotFound.jsx"));
const Reflections = lazy(() => import("./pages/Reflections/Reflections.jsx"));
const Classroom = lazy(() => import("./pages/Classroom/Classroom.jsx"));
const ForgotPassword = lazy(() =>
  import("./pages/ForgotPassword/ForgotPassword.jsx")
);
const ResetPassword = lazy(() => import("./pages/ResetPassword/ResetPassword.jsx"));
const Students = lazy(() => import("./pages/Students/Students.jsx"));
const Profile = lazy(() => import("./pages/Profile/Profile.jsx"));

function App() {
  const { loading } = useAuth();

  if (loading) {
    // Show a loading indicator while checking auth status
    return <LoadingIndicator />;
  }
  return (
    <UserProvider>
      <Suspense fallback={<LoadingIndicator />}>
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
            <Route
              path="reflections"
              element={
                <ProtectedRoute>
                  <Reflections />
                </ProtectedRoute>
              }
            />
            <Route
              path="classroom"
              element={
                <ProtectedRoute>
                  <Classroom />
                </ProtectedRoute>
              }
            />
            <Route
              path="students"
              element={
                <ProtectedRoute>
                  <Students />
                </ProtectedRoute>
              }
            />
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="new-reflection-entry"
              element={
                <ProtectedRoute>
                  <NewReflectionEntry />
                </ProtectedRoute>
              }
            />
            <Route
              path="reflection-entries"
              element={
                <ProtectedRoute>
                  <ReflectionEntries />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-reflection/:id"
              element={
                <ProtectedRoute>
                  <EditReflectionEntry />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-classroom"
              element={
                <ProtectedRoute>
                  <CreateClassroom />
                </ProtectedRoute>
              }
            />
            <Route
              path="/classroom/:id"
              element={
                <ProtectedRoute>
                  <ClassroomDetail />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>

        <ToastContainer />
      </Suspense>
    </UserProvider>
  );
}

export default App;
