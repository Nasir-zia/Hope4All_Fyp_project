
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import orphanRoutes from "./route/orphan_route.js";
import donorRoutes from "./route/donor_route.js";
import orphanageRoutes from "./route/orphanageRoute.js";
import authRoutes from "./route/authRoute.js";
import requestRoutes from "./route/requestRoute.js";
import taskRoutes from "./route/taskRoute.js";
import inventoryRoutes from "./route/inventoryRoute.js";
import adminRoutes from "./route/adminRoute.js";
import messageRoutes from "./route/messageRoute.js";
import feeRoutes from "./route/fee_route.js";
import progressRoutes from "./route/progressRoute.js";
import courseRoutes from "./route/courseRoute.js";
import dbconnection from "./Config/dbconnection.js";
import dns from "dns";
import initSocket from "./socketHandler.js";
import cron from "node-cron";
import Fee from "./model/fee_model.js";
import Notification from "./model/notification_model.js";

dotenv.config();
dns.setServers(['8.8.8.8', '8.8.4.4']);
dbconnection();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  }
});

initSocket(io);

app.use(cors({
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  origin: "*"
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

// orphan routes
app.use("/api/orphans", orphanRoutes);

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

// fee routes
app.use("/api/fees", feeRoutes);

// progress routes
app.use("/api/progress", progressRoutes);

// course routes
app.use("/api/courses", courseRoutes);



// Test route
app.get("/", (req, res) => {
  res.send("Hello from Node.js + MongoDB!");
});

// Setup scheduled job for fee reminders
// Runs every minute for demonstration purposes
cron.schedule('* * * * *', async () => {
  try {
    const pledgedFees = await Fee.find({
      status: 'pledged',
      notificationSent: false
    });

    if (pledgedFees.length > 0) {
      console.log(`[Cron] Found ${pledgedFees.length} pledged fees needing notification.`);
      for (const fee of pledgedFees) {
        // Create notification for the specific donor
        const newNotification = new Notification({
          donorId: fee.pledgedBy,
          type: 'update',
          title: 'Fee Payment Reminder',
          message: `Reminder: The scheduled payment for '${fee.title}' of $${fee.amount} is approaching its due date. Please fulfill your pledge.`,
          unread: true
        });

        await newNotification.save();

        // Update fee so it doesn't notify again
        fee.notificationSent = true;
        await fee.save();
        console.log(`[Cron] Notification sent for fee ID: ${fee._id}`);
      }
    }
  } catch (err) {
    console.error("[Cron] Error processing fee reminders: ", err);
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(` Server + Socket.io running on port ${PORT}`));
