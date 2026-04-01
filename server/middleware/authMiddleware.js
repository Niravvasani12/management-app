import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
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

    // ✅ Attach user
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    console.error("AUTH ERROR:", error.message);
    res.status(401).json({ message: "Invalid token" });
  }
};

export default authMiddleware;
