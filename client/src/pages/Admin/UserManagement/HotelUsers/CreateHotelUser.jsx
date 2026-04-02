import React, { useState } from "react";
import { Form, Input, Button, Card, message } from "antd";
import { useNavigate } from "react-router-dom";
import API from "../../../../api/axios";

const CreateHotelUser = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      setLoading(true);

      await API.post("/users/create-hotel", values);

      message.success("Hotel User Created Successfully");

      navigate("/admin/dashboard");
    } catch (err) {
      message.error(err.response?.data?.message || "Error creating user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 50 }}>
      <Card title="Create Hotel User" style={{ width: 400 }}>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input placeholder="Enter name" autoFocus />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true }, { type: "email" }]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true }]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>

          <Form.Item name="mobile" label="Mobile">
            <Input placeholder="Enter mobile number" />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={loading} block>
            Create Hotel User
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default CreateHotelUser;
