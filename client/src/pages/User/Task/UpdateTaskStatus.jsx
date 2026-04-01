import React from "react";
import { Select, message } from "antd";
import axios from "axios";

const { Option } = Select;

const UpdateTaskStatus = ({ task, refresh }) => {
  const updateStatus = async (status) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${task._id}/status`, {
        status,
      });

      message.success("Status Updated");
      refresh();
    } catch {
      message.error("Update failed");
    }
  };

  return (
    <div style={{ marginTop: 20 }}>
      <b>Update Status:</b>

      <Select
        defaultValue={task.status}
        style={{ width: "100%", marginTop: 10 }}
        onChange={updateStatus}
      >
        <Option value="pending">Pending</Option>
        <Option value="in-progress">In Progress</Option>
        <Option value="completed">Completed</Option>
      </Select>
    </div>
  );
};

export default UpdateTaskStatus;
