import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ================= PROTECT ROUTE =================
export const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    // ❌ No token
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // ✅ Remove Bearer
    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Attach user (full user + role)
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // contains role also
    next();
  } catch (error) {
    console.error("AUTH ERROR:", error.message);
    res.status(401).json({ message: "Invalid token" });
  }
};

// ================= ADMIN CHECK =================
export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};
