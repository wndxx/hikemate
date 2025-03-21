"use client";

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && (!user.role || !user.role.includes(requiredRole))) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
