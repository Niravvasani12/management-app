import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import path from "path";
import { fileURLToPath } from "url";

// NEW IMPORTS
import http from "http";
import { Server } from "socket.io";

// Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

// CONFIG
dotenv.config();
connectDB();

// FIX __dirname (IMPORTANT for ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// APP INIT
const app = express();
const server = http.createServer(app);

// SOCKET.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  transports: ["polling", "websocket"],
});

global.io = io;

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// API ROUTES (KEEP ABOVE STATIC)
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

// ================= FRONTEND SERVING =================

// Absolute path to client/dist
const distPath = path.join(__dirname, "client", "dist");

// Serve static files
app.use(express.static(distPath));

// React fallback (for routing)
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// ===================================================

// SERVER START
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
