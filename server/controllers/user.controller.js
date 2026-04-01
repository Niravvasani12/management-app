import User from "../models/User.js";

// ================== GET ALL USERS ==================
export const getAllUsers = async (req, res) => {
  try {
    console.log("✅ GET USERS CALLED");

    // 🔥 REMOVE FILTER (IMPORTANT FIX)
    const users = await User.find().sort({ createdAt: -1 });

    console.log("USERS FOUND:", users.length);

    res.status(200).json(users);
  } catch (error) {
    console.error("❌ GET USERS ERROR:", error);
    res.status(500).json({
      message: "Error fetching users",
      error: error.message,
    });
  }
};

// ================== APPROVE USER ==================
export const approveUser = async (req, res) => {
  try {
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ message: "Role is required" });
    }

    if (!["master", "hotel"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        status: "verified", // ✅ correct
        role,
      },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: `User approved as ${role}`,
      user,
    });
  } catch (error) {
    console.error("❌ APPROVE ERROR:", error);
    res.status(500).json({ message: "Error approving user" });
  }
};

// ================== BLOCK USER ==================
export const blockUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: "blocked" },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User blocked successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error blocking user" });
  }
};

// ================== DELETE USER ==================
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting user" });
  }
};
