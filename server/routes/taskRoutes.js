import express from "express";
import {
  createTask,
  getAllTasks,
  getMyTasks,
  updateTaskStatus,
  deleteTask,
} from "../controllers/task.controller.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ================= ADMIN =================
router.post("/create", createTask);
router.get("/all", getAllTasks);
router.delete("/:id", deleteTask);

// ================= USER =================
router.get("/my", authMiddleware, getMyTasks);
router.put("/:id/status", updateTaskStatus);

export default router;
