import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

//  NEW IMPORTS
import http from "http";
import { Server } from "socket.io";

//  Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
//  Load env variables
dotenv.config();

//  Connect to MongoDB
connectDB();

const app = express();

//  CREATE HTTP SERVER
const server = http.createServer(app);

//  SOCKET.IO SETUP
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

//  MAKE IO GLOBAL (VERY IMPORTANT)
global.io = io;

//  SOCKET CONNECTION
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

//  Middleware
app.use(cors());
app.use(express.json());

//  API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

//  Test Route
app.get("/", (req, res) => {
  res.send(" API Running...");
});

//  404
app.use((req, res) => {
  res.status(404).json({ message: "Route Not Found" });
});

//  Start Server (IMPORTANT CHANGE)
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
