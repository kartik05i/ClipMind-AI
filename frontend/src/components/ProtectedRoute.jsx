import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");

  // User is not logged in
  if (!token || !userData) {
    return <Navigate to="/" replace />;
  }

  try {
    const user = JSON.parse(userData);

    // Role-based access check
    if (
      allowedRoles &&
      !allowedRoles.includes(user.role)
    ) {
      return <Navigate to="/dashboard" replace />;
    }

    return children;

  } catch (error) {
    // Invalid user data
    console.error("Invalid user data:", error);

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return <Navigate to="/" replace />;
  }
};

export default ProtectedRoute;