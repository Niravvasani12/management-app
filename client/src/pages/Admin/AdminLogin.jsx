import React from "react";
import { Form, Input, Button, Card, message, Typography, Divider } from "antd";
import { useNavigate, Link } from "react-router-dom";

const { Title, Text } = Typography;
import axios from "../../api/axios";
const AdminLogin = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const res = await axios.post("/auth/login", values);
      console.log("LOGIN RESPONSE:", res.data);

      const { token, user } = res.data;

      //  Store data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      //  FORCE NAVIGATION (no mistake now)
      if (user.role === "admin") {
        message.success("Welcome Admin ");

        //  IMPORTANT (delay fix for navigation issue)
        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 500);
      } else {
        message.error("Access denied! Not admin");
      }
    } catch (error) {
      console.log("ERROR:", error.response?.data);
      message.error(error.response?.data?.message || "Login failed");
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
        <br />
        <h6>-Nirav vasani</h6>
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
