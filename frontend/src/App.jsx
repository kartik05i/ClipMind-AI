import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import UploadVideo from "./pages/UploadVideo";
import ContentInsights from "./pages/ContentInsights";
import UsageReports from "./pages/UsageReports";

// Temporary pages
const MyVideos = () => <h1 className="p-10 text-3xl">My Videos</h1>;
const UploadHistory = () => (
  <h1 className="p-10 text-3xl">Upload History</h1>
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/register" element={<Register />} />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/upload" element={<UploadVideo />} />

      <Route path="/content-insights" element={<ContentInsights />} />

      <Route path="/usage-reports" element={<UsageReports />} />

      <Route path="/my-videos" element={<MyVideos />} />

      <Route
        path="/upload-history"
        element={<UploadHistory />}
      />
    </Routes>
  );
}

export default App;