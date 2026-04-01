import React, { useState } from "react";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  LogoutOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Sider } = Layout;

const UserSidebar = ({ selectedKey, setSelectedKey }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  // ✅ FIXED MENU CLICK
  const handleMenuClick = (e) => {
    if (e.key === "logout") {
      localStorage.clear();
      navigate("/login");
      return;
    }

    // ✅ ONLY CHANGE STATE (NO NAVIGATE)
    setSelectedKey(e.key);
  };

  return (
    <div style={{ position: "relative" }}>
      {/* TOGGLE BUTTON */}
      <div
        onClick={() => setCollapsed(!collapsed)}
        style={{
          position: "absolute",
          top: 20,
          right: -15,
          zIndex: 1000,
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: "#8eb3b4",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "#fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        }}
      >
        {collapsed ? <ArrowLeftOutlined /> : <ArrowRightOutlined />}
      </div>

      <Sider
        width={220}
        collapsed={collapsed}
        collapsedWidth={80}
        trigger={null}
        style={{ background: "#0f172a", minHeight: "100vh" }}
      >
        {/* LOGO */}
        <div
          style={{
            color: "#fff",
            padding: 20,
            fontSize: 20,
            textAlign: collapsed ? "center" : "left",
          }}
        >
          {collapsed ? "U" : "User Panel"}
        </div>

        {/* MENU */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={handleMenuClick}
          items={[
            {
              key: "dashboard",
              icon: <DashboardOutlined />,
              label: "Dashboard",
            },
            {
              key: "tasks",
              icon: <UnorderedListOutlined />,
              label: "My Tasks",
            },
            {
              key: "logout",
              icon: <LogoutOutlined />,
              label: "Logout",
            },
          ]}
        />
      </Sider>
    </div>
  );
};

export default UserSidebar;
