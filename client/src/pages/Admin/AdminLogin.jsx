import React from "react";
import { Form, Input, Button, Card, message, Typography, Divider } from "antd";
import { useNavigate, Link } from "react-router-dom";

const { Title, Text } = Typography;

const AdminLogin = () => {
  const navigate = useNavigate();

  const onFinish = (values) => {
    const { email, password } = values;

    if (email === "adminAavgo@gmail.com" && password === "admin123") {
      localStorage.setItem("admin", JSON.stringify({ email }));
      message.success("Login Successful , Admin");
      navigate("/admin/dashboard");
    } else {
      message.error("Invalid Credentials");
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div
        style={{
          flex: 1,
          background: "#e7ecf4",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Title style={{ marginBottom: 0 }}>Admin Panel</Title>
        <Text>Manage your system securely</Text>
      </div>

      {/* RIGHT SIDE */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f0f2f5",
        }}
      >
        <Card title="Admin Login" style={{ width: 400, borderRadius: 10 }}>
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Email is required" },
                { type: "email", message: "Enter valid email" },
              ]}
            >
              <Input placeholder="Enter admin email" autoFocus />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Password is required" }]}
            >
              <Input.Password placeholder="Enter password" />
            </Form.Item>

            <Button type="primary" htmlType="submit" block>
              Login
            </Button>
          </Form>

          {/*Switch to User Portal */}
          <Divider>OR</Divider>

          <div style={{ textAlign: "center" }}>
            <Text>Not an admin?</Text>
            <br />
            <Button type="link" onClick={() => navigate("/login")}>
              Go to User Login
            </Button>

            <br />

            <Link to="/register">Create User Account</Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
