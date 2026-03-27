import React, { useState } from "react";
import { Form, Input, Button, Card, message } from "antd";
import API from "../../../../api/axios";
import { useNavigate } from "react-router-dom";

const CreateMasterUser = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      setLoading(true);

      await API.post("/users/create-master", values);

      message.success("Master User Created Successfully");

      navigate("/admin/dashboard"); // ✅ FIXED
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      message.error("Error creating user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 50 }}>
      <Card title="Create Master User" style={{ width: 400 }}>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="email" label="Email" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item name="mobile" label="Mobile">
            <Input />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={loading} block>
            Create User
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default CreateMasterUser;
