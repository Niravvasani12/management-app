import React from "react";
import { Modal, Tag } from "antd";
import UpdateTaskStatus from "./UpdateTaskStatus";

const TaskDetails = ({ task, onClose, refresh }) => {
  return (
    <Modal open={true} onCancel={onClose} footer={null} title="Task Details">
      <p>
        <b>Title:</b> {task.title}
      </p>
      <p>
        <b>Description:</b> {task.description}
      </p>

      <p>
        <b>Status:</b> <Tag>{task.status}</Tag>
      </p>

      <p>
        <b>Deadline:</b>{" "}
        {task.deadline ? new Date(task.deadline).toLocaleDateString() : "N/A"}
      </p>

      {/*  Update Status Component */}
      <UpdateTaskStatus task={task} refresh={refresh} onClose={onClose} />
    </Modal>
  );
};

export default TaskDetails;
