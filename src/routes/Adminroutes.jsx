// src/routes/Adminroutes.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = () => {
  const { currentUser, loading } = useAuth();

  // wait auth check
  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  // not logged in
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // not admin
  if (currentUser.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // allow admin
  return <Outlet />;
};

export default AdminRoute;