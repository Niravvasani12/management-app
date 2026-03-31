import React from "react";
import { Layout, Button } from "antd";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;

const Navbar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <Header
      style={{
        background: "#fff",
        padding: "0 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* LEFT */}

      {/* RIGHT */}
      <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
        {" "}
        <h3>Welcome to Management Portal</h3>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 12, color: "#888" }}>ADMIN</div>
        </div>
        <Button danger onClick={logout}>
          Logout
        </Button>
      </div>
    </Header>
  );
};

export default Navbar;
