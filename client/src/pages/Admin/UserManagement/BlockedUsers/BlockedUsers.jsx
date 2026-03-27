import React, { useEffect, useState } from "react";
import { Table, Button, message, Popconfirm, Modal, Radio } from "antd";
import API from "../../../../api/axios";

const BlockedUsers = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔥 Modal State
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [role, setRole] = useState("hotel"); // default role

  // ✅ Fetch Blocked Users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/users");
      const filtered = res.data.filter((u) => u.status === "blocked");
      setData(filtered);
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      message.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔥 DELETE USER
  const handleDelete = async (id) => {
    try {
      await API.delete(`/users/delete/${id}`);
      message.success("User Deleted Successfully");
      fetchUsers();
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      message.error("Error deleting user");
    }
  };

  // 🔥 OPEN MODAL (UNBLOCK)
  const openUnblockModal = (user) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  // 🔥 CONFIRM UNBLOCK
  const handleUnblock = async () => {
    try {
      await API.put(`/users/unblock/${selectedUser._id}`, {
        role: role, // 👈 send role to backend
      });

      message.success("User Unblocked Successfully");
      setIsModalVisible(false);
      fetchUsers();
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      message.error("Error unblocking user");
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name" },
    { title: "Email", dataIndex: "email" },
    { title: "Mobile", dataIndex: "mobile" },
    {
      title: "Action",
      render: (_, record) => (
        <>
          {/* 🔓 UNBLOCK BUTTON */}
          <Button
            type="primary"
            style={{ marginRight: 10 }}
            onClick={() => openUnblockModal(record)}
          >
            Unblock
          </Button>

          {/* ❌ DELETE */}
          <Popconfirm
            title="Are you sure to delete this user?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 5 }}
      />

      {/* 🔥 ROLE SELECTION MODAL */}
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
