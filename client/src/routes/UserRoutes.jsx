import React from "react";
import { Route } from "react-router-dom";

import Login from "../pages/User/Login";
import Register from "../pages/User/Register";
import Dashboard from "../pages/User/Dashboard";
import MyTasks from "../pages/User/Task/MyTasks";

import { UserPrivateRoute, PublicRoute } from "../routes/ProtectedRoute";

const UserRoutes = () => {
  return (
    <>
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

      <Route
        path="/user/tasks"
        element={
          <UserPrivateRoute>
            <MyTasks />
          </UserPrivateRoute>
        }
      />
    </>
  );
};

export default UserRoutes;
