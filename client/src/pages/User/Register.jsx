import React, { useState } from "react";
import { Form, Input, Button, Card, message, Typography, Divider } from "antd";
import { useNavigate, Link } from "react-router-dom";
import API from "../../api/axios";

const { Text, Title } = Typography;

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);

      const res = await API.post("/auth/register", values);

      message.success(res.data.message || "Registration Successful ");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      message.error(error.response?.data?.message || "Registration Failed");
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
        <Card title="User Register" style={{ width: 400, borderRadius: 10 }}>
          <Form layout="vertical" onFinish={onFinish}>
            {/* NAME */}
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please enter name" }]}
            >
              <Input placeholder="Enter name" autoFocus />
            </Form.Item>

            {/*  EMAIL */}
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter email" },
                { type: "email", message: "Enter valid email" },

                //  CUSTOM PATTERN VALIDATION
                {
                  pattern: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
                  message: "Only Gmail addresses are allowed",
                },
              ]}
            >
              <Input placeholder="Enter email" />
            </Form.Item>

            {/* MOBILE NUMBER (NEW) */}
            <Form.Item
              label="Mobile Number"
              name="mobile"
              rules={[
                { required: true, message: "Please enter mobile number" },
                {
                  pattern: /^[6-9]\d{9}$/,
                  message: "Enter valid 10-digit mobile number",
                },
              ]}
            >
              <Input placeholder="Enter mobile number" maxLength={10} />
            </Form.Item>

            {/* PASSWORD */}
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Please enter password" }]}
            >
              <Input.Password placeholder="Enter password" />
            </Form.Item>

            <Button type="primary" htmlType="submit" loading={loading} block>
              Register
            </Button>
          </Form>

          <div style={{ marginTop: 15, textAlign: "center" }}>
            <Text>Already have an account? </Text>
            <Link to="/login">Login here</Link>
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

export default Register;
