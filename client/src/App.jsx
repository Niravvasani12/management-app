import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// User Pages
import Login from "./pages/User/Login";
import Register from "./pages/User/Register";
import Dashboard from "./pages/User/Dashboard";
import CreateMasterUser from "./pages/Admin/UserManagement/MasterUsers/CreateMasterUser";
import CreateHotelUser from "./pages/Admin/UserManagement/HotelUsers/CreateHotelUser"; // optional
// Admin Pages
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";

const UserPrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

const AdminPrivateRoute = ({ children }) => {
  const admin = localStorage.getItem("admin");
  return admin ? children : <Navigate to="/admin/login" replace />;
};

const PublicRoute = ({ children, type }) => {
  const token = localStorage.getItem("token");
  const admin = localStorage.getItem("admin");

  if (type === "user" && token) {
    return <Navigate to="/user/dashboard" replace />;
  }

  if (type === "admin" && admin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* ================= USER ROUTES ================= */}
        <Route
          path="/login"
          element={
            <PublicRoute type="user">
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute type="user">
              <Register />
            </PublicRoute>
          }
        />

        <Route
          path="/user/dashboard"
          element={
            <UserPrivateRoute>
              <Dashboard />
            </UserPrivateRoute>
          }
        />

        {/* ================= ADMIN ROUTES ================= */}

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
        {/* <Route
          path="/admin/user-management"
          element={
            <AdminPrivateRoute>
              < />
            </AdminPrivateRoute>
          }
        /> */}
        {/* 🔥 NEW ROUTES */}
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
        {/* ================= 404 ================= */}
        <Route path="*" element={<h1>404 Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
