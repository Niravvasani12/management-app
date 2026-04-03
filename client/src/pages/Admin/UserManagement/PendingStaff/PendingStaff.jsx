import React, { useEffect, useState, useMemo } from "react";
import { Table, Button, Space, message, Modal, Select } from "antd";
import API from "../../../../api/axios";

const PendingStaff = ({ searchText }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");

  //  FETCH USERS (FIXED)
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await API.get("/users"); //  correct if baseURL = /api

      console.log("USERS 👉", res.data); // 🔥 DEBUG

      const users = Array.isArray(res.data) ? res.data : res.data.users || [];

      //  SAFE FILTER (IMPORTANT FIX)
      const filtered = users.filter(
        (u) => u.status?.toLowerCase() === "pending",
      );

      setData(filtered);
    } catch (error) {
      console.error(error);
      message.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  //  AUTO REFRESH
  useEffect(() => {
    fetchUsers();
    const interval = setInterval(fetchUsers, 5000);
    return () => clearInterval(interval);
  }, []);

  //  SEARCH FILTER
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

  //  OPEN MODAL
  const openApproveModal = (id) => {
    setSelectedUserId(id);
    setSelectedRole("");
    setIsModalOpen(true);
  };

  //  APPROVE USER
  const handleApprove = async () => {
    if (!selectedRole) {
      return message.warning("Select role first");
    }

    try {
      await API.put(`/users/approve/${selectedUserId}`, {
        role: selectedRole,
      });

      message.success(`Approved as ${selectedRole}`);

      setIsModalOpen(false);
      setSelectedUserId(null);
      setSelectedRole("");
      fetchUsers();
    } catch (error) {
      console.error(error);
      message.error("Approve failed");
    }
  };

  //  BLOCK USER
  const handleBlock = async (id) => {
    try {
      await API.put(`/users/block/${id}`);
      message.success("User Blocked");
      fetchUsers();
    } catch (error) {
      console.error(error);
      message.error("Block failed");
    }
  };

  //  TABLE COLUMNS
  const columns = [
    { title: "ID", width: 80, render: (_, __, index) => index + 1 },
    { title: "Name", dataIndex: "name", width: 150 },
    { title: "Email", dataIndex: "email", width: 220 },
    { title: "Mobile", dataIndex: "mobile", width: 150 },
    { title: "Status", dataIndex: "status", width: 120 },
    {
      title: "Last Updated",
      width: 180,
      render: (_, record) =>
        record.updatedAt
          ? new Date(record.updatedAt).toLocaleDateString()
          : "N/A",
    },
    {
      title: "Action",
      width: 220,
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => openApproveModal(record._id)}>
            Approve
          </Button>
          <Button danger onClick={() => handleBlock(record._id)}>
            Block
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ overflowX: "auto" }}>
      {/* TABLE */}
      <Table
        columns={columns}
        dataSource={Array.isArray(filteredData) ? filteredData : []}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 5 }}
        scroll={{ x: "max-content" }} // ** ADD THIS
      />

      {/* APPROVE MODAL */}
      <Modal
        title="Select Role Before Approval"
        open={isModalOpen}
        onOk={handleApprove}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedUserId(null);
          setSelectedRole("");
        }}
      >
        <Select
          placeholder="Choose Role"
          style={{ width: "100%" }}
          value={selectedRole}
          onChange={(value) => setSelectedRole(value)}
        >
          <Select.Option value="master">Master User</Select.Option>
          <Select.Option value="hotel">Hotel User</Select.Option>
        </Select>
      </Modal>
    </div>
  );
};

export default PendingStaff;
