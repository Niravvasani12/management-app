import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import path from "path";
import { fileURLToPath } from "url";

import http from "http";
import { Server } from "socket.io";

// Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

// ================= CONFIG =================
dotenv.config();
await connectDB();

// Fix __dirname (ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================= APP INIT =================
const app = express();
const server = http.createServer(app);

// ================= CORS CONFIG =================
const corsOptions = {
  origin: (origin, callback) => {
    console.log("Request from:", origin);

    // allow local, vercel, and tools like Postman
    if (
      !origin ||
      origin.includes("localhost") ||
      origin.includes("vercel.app")
    ) {
      callback(null, true);
    } else {
      console.log("❌ CORS Blocked:", origin);
      callback(new Error("CORS blocked"));
    }
  },
  credentials: true,
};

// Apply CORS
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// ================= SOCKET.IO =================
const io = new Server(server, {
  cors: corsOptions,
  transports: ["websocket", "polling"],
});

global.io = io;

io.on("connection", (socket) => {
  console.log("🔥 User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// ================= MIDDLEWARE =================
app.use(express.json());

// ================= ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

// ================= HEALTH CHECK =================
app.get("/api", (req, res) => {
  res.json({ message: "API is running 🚀" });
});

// ================= FRONTEND (ONLY IF BUILT) =================
// ⚠️ This runs ONLY if you actually deploy frontend inside backend
if (process.env.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "client", "dist");

  app.use(express.static(distPath));

  app.get("*", (req, res) => {
    if (req.originalUrl.startsWith("/api")) {
      return res.status(404).json({ message: "API route not found" });
    }
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// ================= SERVER =================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
