import React, { useEffect, useState, useMemo } from "react";
import {
  Table,
  Button,
  message,
  Popconfirm,
  Modal,
  Form,
  Input,
  Space,
  Select,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import API from "../../../../api/axios";

const HotelUsers = ({ searchText }) => {
  //** receive searchText
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);

  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  //** FETCH USERS
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/users");

      const filtered = res.data.filter(
        (u) => u.role === "hotel" && u.status === "verified",
      );

      setData(filtered);
    } catch {
      message.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  //** AUTO REFRESH
  useEffect(() => {
    fetchUsers();
    const interval = setInterval(fetchUsers, 5000);
    return () => clearInterval(interval);
  }, []);

  //** SEARCH FILTER (OPTIMIZED)
  const filteredData = useMemo(() => {
    if (!searchText) return data;

    const value = searchText.toLowerCase().trim();

    return data.filter((user) => {
      return (
        user.name?.toLowerCase().includes(value) ||
        user.email?.toLowerCase().includes(value) ||
        user.mobile?.toLowerCase().includes(value)
      );
    });
  }, [data, searchText]);

  //** CREATE USER
  const handleCreate = async () => {
    try {
      const values = await form.validateFields();

      await API.post("/users/create-hotel", values);

      message.success("Hotel User Created Successfully");

      setIsCreateModalOpen(false);
      form.resetFields();
      fetchUsers();
    } catch {
      message.error("Error creating user");
    }
  };

  //** OPEN EDIT MODAL
  const openEditModal = (user) => {
    setSelectedUser(user);

    editForm.setFieldsValue({
      name: user.name,
      mobile: user.mobile,
      password: "",
      status: user.status,
    });

    setIsEditModalOpen(true);
  };

  //** UPDATE USER
  const handleUpdate = async () => {
    try {
      const values = await editForm.validateFields();

      await API.put(`/users/update/${selectedUser._id}`, values);

      message.success("User Updated Successfully");

      setIsEditModalOpen(false);
      fetchUsers();
    } catch {
      message.error("Update failed");
    }
  };

  //** DELETE USER
  const handleDelete = async (id) => {
    try {
      await API.delete(`/users/delete/${id}`);
      message.success("User Deleted Successfully");
      fetchUsers();
    } catch {
      message.error("Error deleting user");
    }
  };

  //** TABLE COLUMNS
  const columns = [
    { title: "ID", width: 80, render: (_, __, index) => index + 1 },
    { title: "Name", dataIndex: "name", width: 150 },
    { title: "Email", dataIndex: "email", width: 220 },
    { title: "Mobile", dataIndex: "mobile", width: 150 },
    { title: "Status", dataIndex: "status", width: 120 },
    {
      title: "Last Updated",
      width: 180,
      render: (_, record) => new Date(record.updatedAt).toLocaleDateString(),
    },
    {
      title: "Action",
      width: 180,
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => openEditModal(record)}>
            Edit
          </Button>

          <Popconfirm
            title="Delete user?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ overflowX: "auto" }}>
      {/*** TABLE */}
      <Table
        columns={columns}
        dataSource={filteredData} //** use filtered data
        rowKey="_id"
        loading={loading}
        scroll={{ x: 1000 }} //** any width
      />

      {/*** CREATE MODAL */}
      <Modal
        title="Create Hotel User"
        open={isCreateModalOpen}
        onOk={handleCreate}
        onCancel={() => setIsCreateModalOpen(false)}
      >
        <Form form={form} layout="vertical">
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
        </Form>
      </Modal>

      {/*** EDIT MODAL */}
      <Modal
        title="Edit User"
        open={isEditModalOpen}
        onOk={handleUpdate}
        onCancel={() => setIsEditModalOpen(false)}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="mobile" label="Mobile" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="password" label="Password">
            <Input.Password placeholder="Leave blank to keep same" />
          </Form.Item>

          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="verified">Active</Select.Option>
              <Select.Option value="blocked">Blocked</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default HotelUsers;
