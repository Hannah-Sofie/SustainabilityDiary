import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./config/axiosConfig";
import { useAuth } from "./context/AuthContext";
import LoadingIndicator from "./components/LoadingIndicator/LoadingIndicator";

// Import layout, protected route components, and other components
import Layout from "./components/Layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import NewReflectionEntry from "./components/Reflection/NewReflectionEntry";
import ReflectionEntries from "./components/Reflection/ReflectionEntries";
import EditReflectionEntry from "./components/Reflection/EditReflectionEntry";
import CreateClassroom from "./components/Classroom/CreateClassroom";
import ClassroomDetail from "./components/Classroom/ClassroomDetail";
import PasswordResetWithToken from "./components/PasswordResetWithToken/PasswordResetWithToken";

// Lazy load pages
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
const Home = lazy(() => import("./pages/Home/Home"));
const Login = lazy(() => import("./pages/Login/Login"));
const Register = lazy(() => import("./pages/Register/Register"));
const NotFound = lazy(() => import("./pages/NotFound/NotFound"));
const Reflections = lazy(() => import("./pages/Reflections/Reflections"));
const Classroom = lazy(() => import("./pages/Classroom/Classroom"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword/ResetPassword"));
const Students = lazy(() => import("./pages/Students/Students"));
const Profile = lazy(() => import("./pages/Profile/Profile"));
const Sustainability = lazy(() => import("./pages/Sustainability/Sustainability"));
const Achievements = lazy(() => import("./pages/Achievements/Achievements"));
const Feedback = lazy(() => import("./pages/Feedback/Feedback"));
const Help = lazy(() => import("./pages/Help/Help"));

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
          <Route path="/password-reset-with-token/:token" element={<PasswordResetWithToken />} />
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
            <Route
              path="/sustainability"
              element={
                <ProtectedRoute>
                  <Sustainability />
                </ProtectedRoute>
              }
            />
            <Route
              path="/feedback"
              element={
                <ProtectedRoute>
                  <Feedback />
                </ProtectedRoute>
              }
            />
            <Route
              path="/achievements"
              element={
                <ProtectedRoute>
                  <Achievements />
                </ProtectedRoute>
              }
            />
            <Route
              path="/help"
              element={
                <ProtectedRoute>
                  <Help />
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
