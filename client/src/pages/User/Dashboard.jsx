import React, { useEffect, useState } from "react";
import { Layout, Menu, Button, Card, message } from "antd";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

const { Header, Content, Sider } = Layout;

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
      navigate("/login");
      return;
    }

    //  SET USER IMMEDIATELY (no blank screen)
    setUser(storedUser);

    // 🔥 AUTO CHECK EVERY 5 SECONDS
    const interval = setInterval(async () => {
      try {
        const res = await API.get(`/users/${storedUser._id}`);

        if (!res.data) {
          throw new Error("User not found");
        }

        setUser(res.data);
        // eslint-disable-next-line no-unused-vars
      } catch (err) {
        message.error("Admin removed you");

        localStorage.clear();
        navigate("/login");
      }
    }, 5000);

    // 🧹 CLEANUP
    return () => clearInterval(interval);
  }, [navigate]);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider breakpoint="lg" collapsedWidth="0">
        <div style={{ color: "#fff", padding: 20, fontSize: 18 }}>
          User Panel
        </div>

        <Menu theme="dark" mode="inline">
          <Menu.Item key="1">Dashboard</Menu.Item>
          <Menu.Item key="2">Profile</Menu.Item>
        </Menu>
      </Sider>

      {/* Main */}
      <Layout>
        <Header
          style={{
            background: "#fff",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <h3>Welcome {user?.name}</h3>
          <Button danger onClick={logout}>
            Logout
          </Button>
        </Header>

        <Content style={{ margin: 20 }}>
          <Card title="User Dashboard">
            <p>
              <b>Name:</b> {user?.name}
            </p>
            <p>
              <b>Email:</b> {user?.email}
            </p>
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
