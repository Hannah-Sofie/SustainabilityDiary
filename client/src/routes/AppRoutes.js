import React, { lazy } from "react";
import { Route } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import ProtectedRoute from "../components/ProtectedRoute";

// Lazy load pages
const Dashboard = lazy(() => import("../pages/Dashboard/Dashboard"));
const Home = lazy(() => import("../pages/Home/Home"));
const Login = lazy(() => import("../pages/Login/Login"));
const Register = lazy(() => import("../pages/Register/Register"));
const NotFound = lazy(() => import("../pages/NotFound/NotFound"));
const Reflections = lazy(() => import("../pages/Reflections/Reflections"));
const Classroom = lazy(() => import("../pages/Classroom/Classroom"));
const ForgotPassword = lazy(() =>
  import("../pages/ForgotPassword/ForgotPassword")
);
const ResetPassword = lazy(() =>
  import("../pages/ResetPassword/ResetPassword")
);
const Students = lazy(() => import("../pages/Students/Students"));
const Profile = lazy(() => import("../pages/Profile/Profile"));
const Sustainability = lazy(() =>
  import("../pages/Sustainability/Sustainability")
);
const Achievements = lazy(() => import("../pages/Achievements/Achievements"));
const Feedback = lazy(() => import("../pages/Feedback/Feedback"));
const Help = lazy(() => import("../pages/Help/Help"));
const NewReflectionEntry = lazy(() =>
  import("../components/Reflection/NewReflectionEntry")
);
const ReflectionEntries = lazy(() =>
  import("../components/Reflection/ReflectionEntries")
);
const EditReflectionEntry = lazy(() =>
  import("../components/Reflection/EditReflectionEntry")
);
const CreateClassroom = lazy(() =>
  import("../components/Classroom/CreateClassroom")
);
const ClassroomDetail = lazy(() =>
  import("../components/Classroom/ClassroomDetail")
);

const AppRoutes = (
  <>
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
  </>
);

export default AppRoutes;
