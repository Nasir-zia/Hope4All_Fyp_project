import express from "express";
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

dotenv.config();

dbconnection();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

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
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
