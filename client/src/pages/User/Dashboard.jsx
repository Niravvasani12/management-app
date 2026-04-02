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

    // FINAL SOCKET FIX (WORKS IN PRODUCTION)
    const socket = io(import.meta.env.VITE_SOCKET_URL, {
      transports: ["polling", "websocket"],
      withCredentials: true,
    });

    // CONNECT LOG
    socket.on("connect", () => {
      console.log("Socket Connected:", socket.id);
    });

    //  ERROR LOG
    socket.on("connect_error", (err) => {
      console.log(" Socket Error:", err.message);
    });

    //  USER DELETED
    socket.on("userDeleted", (userId) => {
      console.log(" userDeleted received:", userId);

      if (userId === storedUser._id) {
        message.error("Admin removed you");

        setTimeout(() => {
          localStorage.clear();
          navigate("/login");
        }, 1000);
      }
    });

    //  USER BLOCKED
    socket.on("userBlocked", (userId) => {
      console.log(" userBlocked received:", userId);

      if (userId === storedUser._id) {
        message.error("You are blocked by admin");

        setTimeout(() => {
          localStorage.clear();
          navigate("/login");
        }, 1000);
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
