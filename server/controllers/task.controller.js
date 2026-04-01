import Task from "../models/Task.js";

// ================= CREATE TASK =================
export const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, userType, deadline } = req.body;

    const task = await Task.create({
      title,
      description,
      assignedTo,
      userType,
      deadline,
    });

    res.status(201).json(task);
  } catch (error) {
    console.error("CREATE TASK ERROR:", error);
    res.status(500).json({ message: "Error creating task" });
  }
};

// ================= GET ALL TASKS (ADMIN) =================
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo", "name email role")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    console.error("GET ALL TASKS ERROR:", error);
    res.status(500).json({ message: "Error fetching tasks" });
  }
};

// ================= GET MY TASKS (USER) =================
export const getMyTasks = async (req, res) => {
  try {
    console.log("🔥 USER FROM TOKEN:", req.user); // DEBUG

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    const tasks = await Task.find({
      assignedTo: req.user._id, // ✅ FIXED HERE
    })
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    console.error("GET MY TASKS ERROR:", error);
    res.status(500).json({ message: "Error fetching user tasks" });
  }
};

// ================= UPDATE STATUS =================
export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );

    res.json(task);
  } catch (error) {
    console.error("UPDATE STATUS ERROR:", error);
    res.status(500).json({ message: "Error updating status" });
  }
};

// ================= DELETE TASK =================
export const deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (error) {
    console.error("DELETE TASK ERROR:", error);
    res.status(500).json({ message: "Error deleting task" });
  }
};
