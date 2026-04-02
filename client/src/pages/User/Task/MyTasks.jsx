import React, { useEffect, useState } from "react";
import { Table, Tag, Button, message, Card } from "antd";
import axios from "../../../api/axios";
import TaskDetails from "./TaskDetails";

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        message.error("Please login again");
        return;
      }

      const res = await axios.get("/tasks/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTasks(res.data);
    } catch (error) {
      console.error(error);
      message.error("Failed to load tasks");
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTasks();
    const interval = setInterval(fetchTasks, 5000);
    return () => clearInterval(interval); // first load
  }, []);

  // CLOSE HANDLER (IMPORTANT)
  const handleClose = () => {
    setSelectedTask(null);
    fetchTasks();
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <Tag color={status === "completed" ? "green" : "orange"}>{status}</Tag>
      ),
    },
    {
      title: "Deadline",
      dataIndex: "deadline",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "N/A"),
    },
    {
      title: "Action",
      render: (t) => (
        <Button type="primary" onClick={() => setSelectedTask(t)}>
          View
        </Button>
      ),
    },
  ];

  return (
    <Card title="My Tasks">
      <Table
        dataSource={tasks}
        columns={columns}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
      />

      {selectedTask && (
        <TaskDetails
          task={selectedTask}
          onClose={handleClose}
          refresh={fetchTasks}
        />
      )}
    </Card>
  );
};

export default MyTasks;
