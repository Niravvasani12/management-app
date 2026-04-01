import React, { useState } from "react";
import { Layout, Menu } from "antd";
import {
  UserOutlined,
  SettingOutlined,
  UnorderedListOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;

const Sidebar = ({ selectedKey, setSelectedKey }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      {/* Toggle Button */}
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
          background: "#82a4a5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "#fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        }}
      >
        {collapsed ? <ArrowRightOutlined /> : <ArrowLeftOutlined />}
      </div>

      <Sider
        width={220}
        collapsed={collapsed}
        collapsedWidth={80}
        trigger={null}
        style={{ background: "#081228fc", minHeight: "100vh" }}
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
          {collapsed ? "M" : "Management"}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={(e) => setSelectedKey(e.key)}
          items={[
            {
              key: "users",
              icon: <UserOutlined />,
              label: "User Management",
            },
            {
              key: "tasks", // ✅ FIXED
              icon: <UnorderedListOutlined />,
              label: "Task Management",
            },
            {
              key: "settings",
              icon: <SettingOutlined />,
              label: "Settings",
            },
          ]}
        />
      </Sider>
    </div>
  );
};

export default Sidebar;
