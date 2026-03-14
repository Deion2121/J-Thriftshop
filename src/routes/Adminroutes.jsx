import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = () => {

  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but not admin
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Admin access allowed
  return <Outlet />;
};

export default AdminRoute;