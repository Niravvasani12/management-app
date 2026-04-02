import React from "react";
import { Route, Navigate } from "react-router-dom";

import AdminLogin from "../pages/Admin/AdminLogin";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import CreateMasterUser from "../pages/Admin/UserManagement/MasterUsers/CreateMasterUser";
import CreateHotelUser from "../pages/Admin/UserManagement/HotelUsers/CreateHotelUser";

import { AdminPrivateRoute, PublicRoute } from "../routes/ProtectedRoute";

const AdminRoutes = () => {
  return (
    <>
      <Route path="/admin" element={<Navigate to="/admin/login" />} />

      <Route
        path="/admin/login"
        element={
          <PublicRoute type="admin">
            <AdminLogin />
          </PublicRoute>
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          <AdminPrivateRoute>
            <AdminDashboard />
          </AdminPrivateRoute>
        }
      />

      <Route
        path="/admin/create-master"
        element={
          <AdminPrivateRoute>
            <CreateMasterUser />
          </AdminPrivateRoute>
        }
      />

      <Route
        path="/admin/create-hotel"
        element={
          <AdminPrivateRoute>
            <CreateHotelUser />
          </AdminPrivateRoute>
        }
      />
    </>
  );
};

export default AdminRoutes;
