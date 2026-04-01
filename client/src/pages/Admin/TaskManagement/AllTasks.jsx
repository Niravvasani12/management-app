import React, { useEffect, useState } from "react";
import { Table, Tag, message, Button, Popconfirm } from "antd";
import axios from "axios";

const AllTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ FETCH TASKS (SAFE)
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/tasks/all");

      console.log("TASK API 👉", res.data);

      // 🔥 Ensure array (avoid crash)
      const data = Array.isArray(res.data) ? res.data : res.data.tasks || [];

      setTasks(data);
    } catch (error) {
      console.error("FETCH TASK ERROR:", error);
      message.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ✅ DELETE TASK (SAFE)
  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      message.success("Task Deleted");

      // 🔥 instant UI update (no delay)
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (error) {
      console.error("DELETE ERROR:", error);
      message.error("Delete failed");
    }
  };

  // ✅ STATUS COLOR LOGIC
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "orange";
      case "completed":
        return "green";
      case "in-progress":
        return "blue";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      render: (text) => text || "No Title",
    },
    {
      title: "User",
      render: (t) => t?.assignedTo?.name || "N/A",
    },
    {
      title: "Type",
      dataIndex: "userType",
      render: (type) => <Tag color="purple">{type || "N/A"}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)}>{status || "unknown"}</Tag>
      ),
    },
    {
      title: "Deadline",
      dataIndex: "deadline",
      render: (date) =>
        date ? new Date(date).toLocaleDateString() : "No Date",
    },
    {
      title: "Action",
      render: (t) => (
        <Popconfirm
          title="Are you sure to delete this task?"
          onConfirm={() => deleteTask(t._id)}
          okText="Yes"
          cancelText="No"
        >
          <Button danger>Delete</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <Table
      dataSource={Array.isArray(tasks) ? tasks : []}
      columns={columns}
      rowKey="_id"
      loading={loading}
      bordered
    />
  );
};

export default AllTasks;
