import express from "express";
import {
  getAllUsers,
  approveUser,
  blockUser,
  deleteUser,
} from "../controllers/user.controller.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// ================== GET ALL USERS ==================
router.get("/", getAllUsers);

// ================== CREATE MASTER ==================
router.post("/create-master", async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      mobile,
      role: "master",
      status: "verified",
    });

    res.json({ message: "Master user created", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ================== CREATE HOTEL ==================
router.post("/create-hotel", async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      mobile,
      role: "hotel",
      status: "verified",
    });

    res.json({ message: "Hotel user created", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ================== ACTIONS ==================
router.put("/approve/:id", approveUser);
router.put("/block/:id", blockUser);

// ================== UPDATE USER ==================
router.put("/update/:id", async (req, res) => {
  try {
    const { name, mobile, password, status } = req.body;

    const updateData = {
      name,
      mobile,
      status,
    };

    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true },
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ================== DELETE ==================
router.delete("/delete/:id", deleteUser);

// ================== GET SINGLE USER (LAST) ==================
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
