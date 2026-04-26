import express from "express";
import {
  createTask,
  getTasksByVolunteer,
  getAllTasks,
  updateTaskStatus,
  getVolunteerStats
} from "../controllers/taskController.js";

const router = express.Router();

// Create new task (admin)
router.post("/", createTask);

// Get tasks by volunteer
router.get("/volunteer/:volunteerId", getTasksByVolunteer);

// Get all tasks (admin)
router.get("/", getAllTasks);

// Update task status
router.put("/:taskId/status", updateTaskStatus);

// Get volunteer stats
router.get("/stats/:volunteerId", getVolunteerStats);

export default router;
