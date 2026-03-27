import React from "react";
import { Form, Input, Button, Card, message, Divider } from "antd";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const navigate = useNavigate();

  const onFinish = (values) => {
    const { email, password } = values;

    if (email === "adminAavgo@gmail.com" && password === "admin123") {
      localStorage.setItem("admin", JSON.stringify({ email }));
      message.success("Login Successful");
      navigate("/admin/dashboard");
    } else {
      message.error("Invalid Credentials");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f0f2f5",
      }}
    >
      <Card title="Admin Login" style={{ width: 350 }}>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Email" name="email" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true }]}
          >
            <Input.Password />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Login
          </Button>
        </Form>

        {/* 🔥 Divider */}
        <Divider>OR</Divider>

        {/* 👤 User Portal Links */}
        <div style={{ textAlign: "center" }}>
          <p style={{ marginBottom: 10 }}>Want to use User Portal?</p>

          <Button
            type="default"
            style={{ marginRight: 10 }}
            onClick={() => navigate("/login")}
          >
            User Login
          </Button>

          <Button type="link" onClick={() => navigate("/register")}>
            Register
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AdminLogin;
