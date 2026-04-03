import React, { useEffect, useState, useMemo } from "react";
import { Table, Button, message, Popconfirm, Modal, Radio, Space } from "antd";
import API from "../../../../api/axios";

const BlockedUsers = ({ searchText }) => {
  //  receive searchText
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [role, setRole] = useState("hotel");

  //** FETCH USERS
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/users");

      const filtered = res.data.filter((u) => u.status === "blocked");
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

  //** OPEN UNBLOCK MODAL
  const openUnblockModal = (user) => {
    setSelectedUser(user);
    setRole("hotel");
    setIsModalVisible(true);
  };

  //** UNBLOCK USER
  const handleUnblock = async () => {
    try {
      await API.put(`/users/unblock/${selectedUser._id}`, {
        role: role,
      });

      message.success("User Unblocked Successfully");
      setIsModalVisible(false);
      fetchUsers();
    } catch {
      message.error("Error unblocking user");
    }
  };

  //** TABLE COLUMNS
  const columns = [
    { title: "ID", width: 80, render: (_, __, index) => index + 1 },
    { title: "Name", dataIndex: "name", width: 150 },
    { title: "Email", dataIndex: "email", width: 220 },
    { title: "Mobile", dataIndex: "mobile", width: 150 },
    {
      title: "Last Updated",
      width: 180,
      render: (_, record) => new Date(record.updatedAt).toLocaleDateString(),
    },
    {
      title: "Action",
      width: 220,
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => openUnblockModal(record)}>
            Unblock
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
    <>
      {/* TABLE */}
      <Table
        columns={columns}
        dataSource={filteredData} //** IMPORTANT
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 5 }}
        scroll={{ x: "max-content" }} //** ADD THIS
      />

      {/* UNBLOCK MODAL */}
      <Modal
        title="Select User Role"
        open={isModalVisible}
        onOk={handleUnblock}
        onCancel={() => setIsModalVisible(false)}
      >
        <Radio.Group onChange={(e) => setRole(e.target.value)} value={role}>
          <Radio value="master">Master User</Radio>
          <Radio value="hotel">Hotel User</Radio>
        </Radio.Group>
      </Modal>
    </>
  );
};

export default BlockedUsers;
