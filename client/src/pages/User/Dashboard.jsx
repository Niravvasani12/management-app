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

    // FIX 1: role check added
    if (!storedUser || storedUser.role !== "user") {
      navigate("/login");
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(storedUser);

    // FIX 2: better socket config
    const socket = io(import.meta.env.VITE_SOCKET_URL, {
      transports: ["websocket"], // cleaner than polling
      withCredentials: true,
    });

    // USER DELETED
    socket.on("userDeleted", (userId) => {
      if (userId === storedUser._id) {
        message.error("Admin removed you");
        localStorage.clear();
        navigate("/login");
      }
    });

    // USER BLOCKED
    socket.on("userBlocked", (userId) => {
      if (userId === storedUser._id) {
        message.error("You are blocked by admin");
        localStorage.clear();
        navigate("/login");
      }
    });

    // FIX 3: cleanup
    return () => {
      socket.off("userDeleted");
      socket.off("userBlocked");
      socket.disconnect();
    };
  }, [navigate]);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const renderContent = () => {
    switch (selectedKey) {
      case "tasks":
        return <MyTasks />;

      default:
        return (
          <Card title="User Dashboard">
            <p>Name: {user?.name}</p>
            <p>Email: {user?.email}</p>
          </Card>
        );
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <UserSidebar selectedKey={selectedKey} setSelectedKey={setSelectedKey} />

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
          <h3>Welcome {user?.name}</h3>
          <Button danger onClick={logout}>
            Logout
          </Button>
        </Header>

        <Content style={{ margin: 20 }}>{renderContent()}</Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
