import React, { useEffect, useState } from "react";
import { Layout, Button, Card, message } from "antd";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

import UserSidebar from "../../components/Layout/UserSidebar";
import MyTasks from "./Task/MyTasks";

const { Header, Content } = Layout;

const Dashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [selectedKey, setSelectedKey] = useState("dashboard");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
      navigate("/login");
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(storedUser);

    // ✅ SOCKET INSIDE EFFECT
    const socket = io("https://management-app-production-4b5b.up.railway.app");
    socket.on("userDeleted", (userId) => {
      if (userId === storedUser._id) {
        message.error("Admin removed you");
        localStorage.clear();
        navigate("/login");
      }
    });

    socket.on("userBlocked", (userId) => {
      if (userId === storedUser._id) {
        message.error("You are blocked by admin");
        localStorage.clear();
        navigate("/login");
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [navigate]);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // ✅ CONTENT SWITCH (NO ROUTE CHANGE)
  const renderContent = () => {
    switch (selectedKey) {
      case "tasks":
        return <MyTasks />;

      default:
        return (
          <Card title="User Dashboard">
            <p>
              <b>Name:</b> {user?.name}
            </p>
            <p>
              <b>Email:</b> {user?.email}
            </p>
          </Card>
        );
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* ✅ SIDEBAR */}
      <UserSidebar selectedKey={selectedKey} setSelectedKey={setSelectedKey} />

      <Layout>
        {/* ✅ HEADER */}
        <Header
          style={{
            background: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 20px",
          }}
        >
          <h3>Welcome {user?.name}</h3>

          <Button danger onClick={logout}>
            Logout
          </Button>
        </Header>

        {/* ✅ CONTENT */}
        <Content style={{ margin: 20 }}>{renderContent()}</Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
