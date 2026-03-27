import React, { useEffect, useState } from "react";
import {
  Table,
  Tabs,
  Input,
  Button,
  message,
  Space,
  Popconfirm,
  Modal,
  Select,
  Form,
} from "antd";
import { UserAddOutlined, EditOutlined } from "@ant-design/icons";
import API from "../../../api/axios";
import { useNavigate } from "react-router-dom";

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("activeTab") || "1",
  );

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [form] = Form.useForm();

  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/users");
      setUsers(res.data);
    } catch {
      message.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ OPEN EDIT MODAL
  const openEditModal = (user) => {
    setSelectedUser(user);
    form.setFieldsValue({
      name: user.name,
      mobile: user.mobile,
      password: "",
      status: user.status,
    });
    setIsModalOpen(true);
  };

  // ✅ UPDATE USER
  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();

      await API.put(`/users/update/${selectedUser._id}`, values);

      message.success("User Updated Successfully");
      setIsModalOpen(false);
      fetchUsers();
    } catch {
      message.error("Update failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/users/delete/${id}`);
      message.success("User Deleted");
      fetchUsers();
    } catch {
      message.error("Error deleting user");
    }
  };

  const baseColumns = [
    { title: "ID", render: (_, __, index) => index + 1 },
    { title: "User Name", dataIndex: "name" },
    { title: "Mobile Number", dataIndex: "mobile" },
    { title: "Email", dataIndex: "email" },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Last Updated",
      render: (_, record) => new Date(record.updatedAt).toLocaleDateString(),
    },
  ];

  // ✅ EDIT ACTION COLUMN (NO BLOCK BUTTON)
  const actionColumn = {
    title: "Action",
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
  };

  const getFilteredUsers = (key) => {
    switch (key) {
      case "1":
        return users.filter(
          (u) => u.role === "master" && u.status === "verified",
        );
      case "2":
        return users.filter(
          (u) => u.role === "hotel" && u.status === "verified",
        );
      case "3":
        return users.filter((u) => u.status === "pending");
      case "4":
        return users.filter((u) => u.status === "blocked");
      default:
        return users;
    }
  };

  const getButtonText = () => {
    if (activeTab === "1") return "Master User";
    if (activeTab === "2") return "Hotel User Create";
    return "";
  };

  const items = [
    {
      key: "1",
      label: "Master Users",
      children: (
        <Table
          columns={[...baseColumns, actionColumn]}
          dataSource={getFilteredUsers("1")}
          rowKey="_id"
          loading={loading}
        />
      ),
    },
    {
      key: "2",
      label: "Hotel Users",
      children: (
        <Table
          columns={[...baseColumns, actionColumn]}
          dataSource={getFilteredUsers("2")}
          rowKey="_id"
          loading={loading}
        />
      ),
    },
    {
      key: "3",
      label: "Pending Staff",
      children: (
        <Table
          columns={[...baseColumns, actionColumn]}
          dataSource={getFilteredUsers("3")}
          rowKey="_id"
          loading={loading}
        />
      ),
    },
    {
      key: "4",
      label: "Blocked Users",
      children: (
        <Table
          columns={[...baseColumns, actionColumn]}
          dataSource={getFilteredUsers("4")}
          rowKey="_id"
          loading={loading}
        />
      ),
    },
  ];

  return (
    <div style={{ background: "#fff", padding: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <h2>User Management</h2>

        <div style={{ display: "flex", gap: 10 }}>
          <Input placeholder="Search user" style={{ width: 200 }} />

          {(activeTab === "1" || activeTab === "2") && (
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={() => {
                if (activeTab === "1") navigate("/admin/create-master");
                if (activeTab === "2") navigate("/admin/create-hotel");
              }}
            >
              {getButtonText()}
            </Button>
          )}
        </div>
      </div>

      <Tabs
        activeKey={activeTab}
        items={items}
        onChange={(key) => {
          setActiveTab(key);
          localStorage.setItem("activeTab", key);
        }}
      />

      {/* ✅ EDIT MODAL */}
      <Modal
        title="Edit User"
        open={isModalOpen}
        onOk={handleUpdate}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Mobile" name="mobile" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Password" name="password">
            <Input.Password placeholder="Leave blank to keep same" />
          </Form.Item>

          <Form.Item label="Status" name="status" rules={[{ required: true }]}>
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

export default UserManagement;
