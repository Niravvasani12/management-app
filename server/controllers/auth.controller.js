import User from "../models/User.js";
import Admin from "../models/Admin.js"; // ✅ ADD THIS
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ================= REGISTER =================
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      mobile,
      password: hashedPassword,
      role: "master",
      status: "pending",
      isApprovedNotified: false,
    });

    res.status(201).json({
      message: "User Registered. Wait for Admin Approval",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= LOGIN (UPDATED ) =================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user;
    let role;

    //  1. CHECK ADMIN FIRST
    user = await Admin.findOne({ email });

    if (user) {
      role = "admin";
    } else {
      //  2. CHECK NORMAL USER
      user = await User.findOne({ email });
      role = "user";
    }

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    //  CHECK PASSWORD
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    //  STATUS CHECK (ONLY FOR NORMAL USER)
    if (role === "user") {
      if (user.status === "pending") {
        return res.status(403).json({
          message: "Wait for admin approval",
        });
      }

      if (user.status === "blocked") {
        return res.status(403).json({
          message: "You are blocked",
        });
      }
    }

    //  APPROVAL MESSAGE (ONLY USER)
    let approvalMessage = null;

    if (role === "user" && user.isApprovedNotified === false) {
      approvalMessage = "🎉 Admin approved your account!";
      user.isApprovedNotified = true;
      await user.save();
    }

    //  TOKEN
    const token = jwt.sign(
      {
        id: user._id,
        role: role, // ✅ dynamic role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    //  CLEAN RESPONSE
    const userData = {
      _id: user._id,
      email: user.email,
      role: role,
      name: user.name || "Admin",
    };

    res.status(200).json({
      message: "Login successful",
      approvalMessage,
      token,
      user: userData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// ================= APPROVE USER =================
export const approveUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      {
        status: "verified",
        role: role || "hotel",
        isApprovedNotified: false,
      },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User approved successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
