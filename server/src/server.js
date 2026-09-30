// RescuEats Backend Server
// Express REST API + Socket.io WebSocket Gateway

import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import apiRoutes from "./routes/api.js";
import { iotSimulator } from "./services/iotSimulator.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// Enable CORS for Vite frontend running on default ports
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PATCH"]
  }
});

// Attach io instance to app context so controllers can emit broadcasts
app.set("io", io);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount API Routes
app.use("/api/v1", apiRoutes);

// Socket.io Connection Lifecycle
io.on("connection", (socket) => {
  console.log(`[WebSocket] 🔌 Client connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`[WebSocket] ❌ Client disconnected: ${socket.id}`);
  });
});

// Start IoT Telemetry Background Streaming
iotSimulator.init(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`
  ======================================================
  🌱 RescuEats AI-Powered Food Waste Reduction Engine
  🚀 Server running on: http://localhost:${PORT}
  📡 WebSocket Gateway active on port ${PORT}
  🧠 Multi-Agent Core: Ready (4 Agents Online)
  ======================================================
  `);
});
