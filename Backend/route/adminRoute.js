import express from "express";
import {
  getDashboardStats,
  getUsers,
  getUserById,
  updateUserStatus,
  getReportsData,
  getNotifications,
  markNotificationRead,
  getAllOrphans,
  getAllDonors,
  getAllOrphanages,
  getAllVolunteers,
  getOrphanById,
  getDonorById,
  getOrphanageById,
  getVolunteerById,
  testEndpoint
} from "../controllers/adminController.js";

const router = express.Router();

// Get dashboard statistics
router.get("/stats", getDashboardStats);

// Get all users
router.get("/users", getUsers);

// Get user by ID
router.get("/users/:userId", getUserById);

// Update user status
router.put("/users/:userId/status", updateUserStatus);

// Get reports and analytics data
router.get("/reports", getReportsData);

// Get notifications
router.get("/notifications", getNotifications);

// Mark notification as read
router.put("/notifications/:notificationId/read", markNotificationRead);

// Get all orphans
router.get("/orphans", getAllOrphans);

// Get all donors
router.get("/donors", getAllDonors);

// Get all orphanages
router.get("/orphanages", getAllOrphanages);

// Get all volunteers
router.get("/volunteers", getAllVolunteers);

// Get orphan by ID
router.get("/orphans/:id", getOrphanById);

// Get donor by ID
router.get("/donors/:id", getDonorById);

// Get orphanage by ID
router.get("/orphanages/:id", getOrphanageById);

// Get volunteer by ID
router.get("/volunteers/:id", getVolunteerById);

// Test endpoint
router.get("/test", testEndpoint);

export default router;
