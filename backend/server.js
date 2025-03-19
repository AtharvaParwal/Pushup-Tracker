import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http"; // Import HTTP module
import { Server } from "socket.io"; // Import Socket.IO

import connectDB from "./database/db.js";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app); // Create an HTTP server
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL, // Allow frontend to connect
    credentials: true,
  },
});

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true, // Allow cookies
  })
);
app.use(express.json());

// **Socket.IO Connection**
io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// **Use Routes**
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


