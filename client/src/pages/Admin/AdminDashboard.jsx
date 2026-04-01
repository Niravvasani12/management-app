import React, { useState } from "react";
import { Layout, Button } from "antd";
import Sidebar from "../../components/Layout/Sidebar";
// import Navbar from "../../components/Layout/Navbar";
import UserManagement from "../Admin/UserManagement/UserManagement";
import { useNavigate } from "react-router-dom";

// ✅ IMPORT THIS
import TaskManagement from "../Admin/TaskManagement/TaskManagement";

const { Header, Content } = Layout;

const AdminDashboard = () => {
  const [selectedKey, setSelectedKey] = useState("users");
  const navigate = useNavigate();

  const renderContent = () => {
    switch (selectedKey) {
      case "users":
        return <UserManagement />;

      case "tasks": // ✅ ADD THIS BLOCK
        return <TaskManagement />;

      default:
        return <h2>Welcome Admin</h2>;
    }
  };
  const logout = () => {
    localStorage.clear();
    navigate("/admin/login");
  };
  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sidebar selectedKey={selectedKey} setSelectedKey={setSelectedKey} />

      <Layout>
        <Header
          style={{
            background: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 20px",
          }}
        >
          {" "}
          <h3>Welcome Admin</h3>
          <Button danger onClick={logout}>
            Logout
          </Button>
          {/* <Navbar /> */}
        </Header>

        <Content style={{ margin: 20 }}>{renderContent()}</Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;
