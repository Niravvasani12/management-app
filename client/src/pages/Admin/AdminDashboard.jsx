import React, { useState } from "react";
import { Layout } from "antd";
import Sidebar from "../../components/Layout/Sidebar";
import Navbar from "../../components/Layout/Navbar";
import UserManagement from "../Admin/UserManagement/UserManagement";

const { Header, Content } = Layout;

const AdminDashboard = () => {
  const [selectedKey, setSelectedKey] = useState("users");

  const renderContent = () => {
    switch (selectedKey) {
      case "users":
        return <UserManagement />;
      default:
        return <h2>Welcome Admin</h2>;
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar Component */}
      <Sidebar selectedKey={selectedKey} setSelectedKey={setSelectedKey} />

      <Layout>
        <Header
          style={{
            background: "#fff",
            display: "flex",
            justifyContent: "space-between",
            padding: "0 20px",
          }}
        >
          {/* <h3>Welcome to Management Portal</h3> */}
          <Navbar />
        </Header>

        <Content style={{ margin: 20 }}>{renderContent()}</Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;
