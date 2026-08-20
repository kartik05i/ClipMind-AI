import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

import Dashboard from "./pages/Dashboard";
import UploadVideo from "./pages/UploadVideo";
import ContentInsights from "./pages/ContentInsights";
import UsageReports from "./pages/UsageReports";
import MyVideos from "./pages/MyVideos";
import LearningHistory from "./pages/LearningHistory";
import Bookmarks from "./pages/Bookmarks";

import ProtectedRoute from "./components/ProtectedRoute";
import ManageVideos from "./pages/ManageVideos";
import LearningMaterials from "./pages/LearningMaterials";
import ClassroomAnalytics from "./pages/ClassroomAnalytics";
import ContentAnalytics from "./pages/ContentAnalytics";
import ManageUsers from "./pages/ManageUsers";
import AIProcessingJobs from "./pages/AIProcessingJobs";
import SystemAnalytics from "./pages/SystemAnalytics";
import PlatformSettings from "./pages/PlatformSettings";
import AuditLogs from "./pages/AuditLogs";
import Profile from "./pages/Profile";
import UploadHistory from "./pages/UploadHistory";

/* ================= TEMPORARY PAGES ================= */

function App() {
  return (
    <Routes>

      {/* ================= PUBLIC ROUTES ================= */}

      <Route path="/" element={<Home />} />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />


      {/* ================= ALL LOGGED-IN USERS ================= */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/content-insights"
        element={
          <ProtectedRoute>
            <ContentInsights />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />


      {/* ================= LEARNER ================= */}

      <Route
        path="/my-videos"
        element={
          <ProtectedRoute
            allowedRoles={[
              "Learner",
              "Educator",
              "Content Creator",
            ]}
          >
            <MyVideos />
          </ProtectedRoute>
        }
      />

      <Route
        path="/learning-history"
        element={
          <ProtectedRoute
            allowedRoles={["Learner"]}
          >
            <LearningHistory />
          </ProtectedRoute>
        }
      />

      <Route
        path="/bookmarks"
        element={
          <ProtectedRoute
            allowedRoles={["Learner"]}
          >
            <Bookmarks />
          </ProtectedRoute>
        }
      />


      {/* ================= EDUCATOR + CONTENT CREATOR ================= */}

      <Route
        path="/upload"
        element={
          <ProtectedRoute
            allowedRoles={[
              "Educator",
              "Content Creator",
            ]}
          >
            <UploadVideo />
          </ProtectedRoute>
        }
      />

      <Route
        path="/upload-history"
        element={
          <ProtectedRoute
            allowedRoles={[
              "Educator",
              "Content Creator",
            ]}
          >
            <UploadHistory />
          </ProtectedRoute>
        }
      />


      {/* ================= EDUCATOR ONLY ================= */}

      <Route
        path="/learning-materials"
        element={
          <ProtectedRoute
            allowedRoles={["Educator"]}
          >
            <LearningMaterials />
          </ProtectedRoute>
        }
      />

      <Route
        path="/classroom-analytics"
        element={
          <ProtectedRoute
            allowedRoles={["Educator"]}
          >
            <ClassroomAnalytics />
          </ProtectedRoute>
        }
      />


      {/* ================= CONTENT CREATOR ONLY ================= */}

      <Route
        path="/content-analytics"
        element={
          <ProtectedRoute
            allowedRoles={["Content Creator"]}
          >
            <ContentAnalytics />
          </ProtectedRoute>
        }
      />


      {/* ================= ADMINISTRATOR ONLY ================= */}

      <Route
        path="/user-management"
        element={
          <ProtectedRoute
            allowedRoles={["Administrator"]}
          >
            <ManageUsers />
          </ProtectedRoute>
        }
      />

      <Route
        path="/manage-videos"
        element={
          <ProtectedRoute
            allowedRoles={[
              "Educator",
              "Content Creator",
              "Administrator",
            ]}
          >
            <ManageVideos />
          </ProtectedRoute>
        }
      />

      <Route
        path="/usage-reports"
        element={
          <ProtectedRoute
            allowedRoles={["Administrator"]}
          >
            <UsageReports />
          </ProtectedRoute>
        }
      />

      <Route
        path="/ai-processing-jobs"
        element={
          <ProtectedRoute
            allowedRoles={["Administrator"]}
          >
            <AIProcessingJobs />
          </ProtectedRoute>
        }
      />

      <Route
        path="/system-analytics"
        element={
          <ProtectedRoute
            allowedRoles={["Administrator"]}
          >
            <SystemAnalytics />
          </ProtectedRoute>
        }
      />

      <Route
        path="/audit-logs"
        element={
          <ProtectedRoute
            allowedRoles={["Administrator"]}
          >
            <AuditLogs />
          </ProtectedRoute>
        }
      />

      <Route
        path="/platform-settings"
        element={
          <ProtectedRoute
            allowedRoles={["Administrator"]}
          >
            <PlatformSettings />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;