import User from "../models/User.js";

// ================== GET ALL USERS ==================
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
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

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        status: "verified",
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

    // IMPORTANT (ADD THIS)
    global.io.emit("userBlocked", user._id.toString());

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

    // IMPORTANT (ADD THIS)
    global.io.emit("userDeleted", user._id.toString());

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting user" });
  }
};
