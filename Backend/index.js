import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import uploadRoutes from "./route/orphan_route.js";
import donorRoutes from "./route/donor_route.js";
import orphanageRoutes from "./route/orphanageRoute.js";
import dbconnection from "./Config/dbconnection.js";

dotenv.config();

dbconnection();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// cloudinary and upload routes
app.use("/api/upload", uploadRoutes);

// donor routes
app.use("/api/donors", donorRoutes);

// orphanage routes
app.use("/api/orphanages", orphanageRoutes);



// Test route
app.get("/", (req, res) => {
  res.send("Hello from Node.js + MongoDB!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
