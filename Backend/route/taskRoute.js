import express from "express";
import {
  createTask,
  getTasksByVolunteer,
  getAllTasks,
  updateTaskStatus,
  getVolunteerStats
} from "../controllers/taskController.js";
import { authenticateToken, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create new task — admin only
router.post("/", authenticateToken, requireAdmin, createTask);

// Get tasks for a specific volunteer — authenticated (volunteer reads own tasks)
router.get("/volunteer/:volunteerId", authenticateToken, getTasksByVolunteer);

// Get all tasks — admin only
router.get("/", authenticateToken, requireAdmin, getAllTasks);

// Update task status — authenticated (volunteer updates own task status)
router.put("/:taskId/status", authenticateToken, updateTaskStatus);

// Get volunteer stats — authenticated
router.get("/stats/:volunteerId", authenticateToken, getVolunteerStats);

export default router;
