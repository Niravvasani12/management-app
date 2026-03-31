import React, { useEffect, useState, useMemo } from "react";
import { Table, Button, Space, message, Modal, Select } from "antd";
import API from "../../../../api/axios";

const PendingStaff = ({ searchText }) => {
  //** receive searchText
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");

  //** FETCH USERS
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/users");

      const filtered = res.data.filter((u) => u.status === "pending");
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

  //** OPEN MODAL
  const openApproveModal = (id) => {
    setSelectedUserId(id);
    setSelectedRole("");
    setIsModalOpen(true);
  };

  //** APPROVE USER
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
    } catch {
      message.error("Approve failed");
    }
  };

  //** BLOCK USER
  const handleBlock = async (id) => {
    try {
      await API.put(`/users/block/${id}`);
      message.success("User Blocked");
      fetchUsers();
    } catch {
      message.error("Block failed");
    }
  };

  //** TABLE COLUMNS
  const columns = [
    { title: "ID", render: (_, __, index) => index + 1 },
    { title: "Name", dataIndex: "name" },
    { title: "Email", dataIndex: "email" },
    { title: "Mobile", dataIndex: "mobile" },
    {
      title: "Last Updated",
      render: (_, record) => new Date(record.updatedAt).toLocaleDateString(),
    },
    {
      title: "Action",
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
    <>
      {/*** TABLE */}
      <Table
        columns={columns}
        dataSource={filteredData} //** use filtered data
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 5 }}
      />

      {/*** APPROVE MODAL */}
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
    </>
  );
};

export default PendingStaff;
