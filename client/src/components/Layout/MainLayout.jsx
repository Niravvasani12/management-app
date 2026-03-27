import React, { useState } from "react";
import { Layout } from "antd";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const { Content, Header } = Layout;

const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout>
      <Sidebar collapsed={collapsed} />

      <Layout>
        <Header style={{ background: "#fff", padding: "0 20px" }}>
          <Navbar collapsed={collapsed} setCollapsed={setCollapsed} />
        </Header>

        <Content style={{ margin: 20, background: "#fff", padding: 20 }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
