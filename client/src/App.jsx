import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import UserRoutes from "../src/routes/UserRoutes";
import AdminRoutes from "../src/routes/AdminRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default */}
        <Route path="/" element={<Navigate to="/login" />} />

        {UserRoutes()}

        {/* Admin Routes */}
        {AdminRoutes()}

        {/* 404 */}
        <Route
          path="*"
          element={
            <h1>404 Page Not Found . Piche Chalaja. Idhar Kuch nahi hey.</h1>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
