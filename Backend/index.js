
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import uploadRoutes from "./route/orphan_route.js";
import donorRoutes from "./route/donor_route.js";
import orphanageRoutes from "./route/orphanageRoute.js";
import authRoutes from "./route/authRoute.js";
import requestRoutes from "./route/requestRoute.js";
import taskRoutes from "./route/taskRoute.js";
import inventoryRoutes from "./route/inventoryRoute.js";
import adminRoutes from "./route/adminRoute.js";
import messageRoutes from "./route/messageRoute.js";
import dbconnection from "./Config/dbconnection.js";
import dns from "dns";
import initSocket from "./socketHandler.js";

dotenv.config();
dns.setServers(['8.8.8.8', '8.8.4.4']);
dbconnection();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

initSocket(io);

app.use(cors({
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(` ${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// auth routes
app.use("/api/auth", authRoutes);

// cloudinary and upload routes
app.use("/api/upload", uploadRoutes);

// donor routes
app.use("/api/donors", donorRoutes);

// orphanage routes
app.use("/api/orphanages", orphanageRoutes);

// request routes
app.use("/api/requests", requestRoutes);

// task routes
app.use("/api/tasks", taskRoutes);

// inventory routes
app.use("/api/inventory", inventoryRoutes);

// admin routes
app.use("/api/admin", adminRoutes);

// message routes
app.use("/api/messages", messageRoutes);



// Test route
app.get("/", (req, res) => {
  res.send("Hello from Node.js + MongoDB!");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(` Server + Socket.io running on port ${PORT}`));

