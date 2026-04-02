import React, { useState } from "react";
import { Form, Input, Button, Card, message, Typography, Divider } from "antd";
import { useNavigate, Link } from "react-router-dom";
import API from "../../api/axios";

const { Text, Title } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);

      const res = await API.post("/auth/login", values);

      const token = res.data?.token;
      const user = res.data?.user;
      const approvalMessage = res.data?.approvalMessage;

      if (!token || !user || !user._id) {
        message.error("Invalid login response from server");
        return;
      }

      if (user.role === "admin") {
        message.error("Please login from Admin Portal");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (approvalMessage) {
        message.success(approvalMessage);
      } else {
        message.success(`Login Successful ${user?.name}`);
      }

      navigate("/user/dashboard");
    } catch (error) {
      message.error(error.response?.data?.message || "Invalid Credentials");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* LEFT */}
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
        <Title style={{ marginBottom: 0 }}>Management App</Title>
        <Text>Welcome to your system</Text>
      </div>

      {/* RIGHT */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f0f2f5",
        }}
      >
        <Card title="User Login" style={{ width: 400, borderRadius: 10 }}>
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Email is required" },
                { type: "email", message: "Enter valid email" },
              ]}
            >
              <Input placeholder="Enter email" autoFocus />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Password is required" }]}
            >
              <Input.Password placeholder="Enter password" />
            </Form.Item>

            <Button type="primary" htmlType="submit" loading={loading} block>
              Login
            </Button>
          </Form>

          <div style={{ marginTop: 15, textAlign: "center" }}>
            <Text>Don't have an account? </Text>
            <Link to="/register">Register here</Link>
          </div>

          <Divider>OR</Divider>

          <div style={{ textAlign: "center" }}>
            <Text>Admin?</Text>
            <br />
            <Button type="link" onClick={() => navigate("/admin/login")}>
              Go to Admin Portal
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
