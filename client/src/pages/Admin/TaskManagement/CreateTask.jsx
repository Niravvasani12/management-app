import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  message,
  Radio,
  Modal,
} from "antd";
import axios from "../../../api/axios";

const { Option } = Select;

const CreateTask = () => {
  const [users, setUsers] = useState([]);
  const [userType, setUserType] = useState(null);
  const [open, setOpen] = useState(false);

  const [form] = Form.useForm();

  // ✅ FETCH USERS
  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    if (userType) fetchUsers();
  }, [userType]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/users");
      const data = Array.isArray(res.data) ? res.data : res.data.users || [];

      setUsers(data);
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      message.error("Failed to fetch users");
    }
  };

  // ✅ SUBMIT
  const handleSubmit = async (values) => {
    try {
      await axios.post("/tasks/create", {
        ...values,
        userType,
        deadline: values.deadline ? values.deadline.format("YYYY-MM-DD") : null,
      });

      message.success("Task Created Successfully");
      form.resetFields();
      setOpen(false);
    } catch {
      message.error("Error creating task");
    }
  };

  const filteredUsers = users.filter((u) => u?.role === userType);

  return (
    <>
      {/* 🔥 OPEN BUTTON */}
      <Button type="primary" onClick={() => setOpen(true)}>
        + Create Task
      </Button>

      {/* 🔥 MODAL FORM */}
      <Modal
        title={
          userType
            ? `Create Task for ${
                userType === "master" ? "Master User" : "Hotel User"
              }`
            : "Select User Type"
        }
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={600}
      >
        {/* STEP 1: RADIO */}
        <Form layout="vertical">
          <Form.Item label="Select User Type">
            <Radio.Group
              onChange={(e) => {
                setUserType(e.target.value);
                form.resetFields();
              }}
              value={userType}
            >
              <Radio value="master">Master User</Radio>
              <Radio value="hotel">Hotel User</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>

        {/* STEP 2: FORM */}
        {userType && (
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item name="title" label="Title" rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item name="description" label="Description">
              <Input.TextArea />
            </Form.Item>

            <Form.Item
              name="assignedTo"
              label="Assign User"
              rules={[{ required: true }]}
            >
              <Select placeholder="Select user">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((u) => (
                    <Option key={u._id} value={u._id}>
                      {u.name}
                    </Option>
                  ))
                ) : (
                  <Option disabled>No users found</Option>
                )}
              </Select>
            </Form.Item>

            <Form.Item name="deadline" label="Deadline">
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Button type="primary" htmlType="submit" block>
              Create Task
            </Button>
          </Form>
        )}
      </Modal>
    </>
  );
};

export default CreateTask;
