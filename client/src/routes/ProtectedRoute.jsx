import React from "react";
import { Navigate } from "react-router-dom";

// ================= USER PROTECT =================
export const UserPrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  return token ? children : <Navigate to="/login" replace />;
};

// ================= ADMIN PROTECT =================
export const AdminPrivateRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// ================= PUBLIC ROUTE =================
export const PublicRoute = ({ children, type }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (type === "user" && token) {
    return <Navigate to="/user/dashboard" replace />;
  }

  if (type === "admin" && user?.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};
