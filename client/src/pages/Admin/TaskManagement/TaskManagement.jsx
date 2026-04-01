import React, { useState } from "react";
import { Tabs, Card } from "antd";
import CreateTask from "./CreateTask";
import AllTasks from "./AllTasks";

const TaskManagement = () => {
  const [activeTab, setActiveTab] = useState("1");

  const tabItems = [
    {
      key: "1",
      label: "Create Task",
      children: <CreateTask />,
    },
    {
      key: "2",
      label: "All Tasks",
      children: <AllTasks />,
    },
  ];

  return (
    <Card title="Task Management" style={{ borderRadius: "12px" }}>
      <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
    </Card>
  );
};

export default TaskManagement;
