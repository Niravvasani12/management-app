import React, { useEffect, useState } from "react";
import { Table, Button, message, Popconfirm } from "antd";
import API from "../../../../api/axios";

const MasterUsers = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/users");
      const filtered = res.data.filter(
        (u) => u.role === "master" && u.status === "verified",
      );
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

  const handleBlock = async (id) => {
    try {
      await API.put(`/users/block/${id}`);
      message.success("User Blocked");
      fetchUsers();
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      message.error("Error blocking user");
    }
  };

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

  const columns = [
    { title: "Name", dataIndex: "name" },
    { title: "Email", dataIndex: "email" },
    { title: "Mobile", dataIndex: "mobile" },
    {
      title: "Role",
      dataIndex: "role",
      render: () => "Master",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: () => "Verified",
    },
    {
      title: "Action",
      render: (_, record) => (
        <>
          <Button
            danger
            style={{ marginRight: 10 }}
            onClick={() => handleBlock(record._id)}
          >
            Block
          </Button>

          <Popconfirm
            title="Are you sure to delete this user?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger>
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="_id"
      loading={loading}
      pagination={{ pageSize: 5 }}
    />
  );
};

export default MasterUsers;
