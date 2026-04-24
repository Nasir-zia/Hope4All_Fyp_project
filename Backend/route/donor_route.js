
import express from "express";
import {
  registerDonor,
  registerDonorWithFiles,
  getDonors,
  getDonorProfile,
  updateDonorProfile,
  makeDonation,
  getDonationHistory,
  getDonorOrphans,
  updateDonation,
  deleteDonation,
  getNotifications,
  markNotificationRead,
  getMatchedOrphans,
  getPreferenceOptions,
  getOrphanAid,
  deleteDonor
} from "../controllers/donorController.js";
import upload from "../middleware/uploadMiddleware.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// --- Public read endpoints ---

// Get all donors
router.get("/", getDonors);

// Get donor profile (by userId or donorId)
router.get("/profile/:id", getDonorProfile);

// Get preference options
router.get("/preferences/options", getPreferenceOptions);

// Get aid received by an orphan
router.get("/aid/:id", getOrphanAid);

// Get donor by user ID (alias)
router.get("/user/:userId", getDonorProfile);

// Get matched orphans
router.get("/matched-orphans/:id", getMatchedOrphans);

// Get donation history
router.get("/history/:id", getDonationHistory);

// Get orphans donor has donated to
router.get("/orphans/:id", getDonorOrphans);

// Get notifications
router.get("/notifications/:id", getNotifications);

// --- Registration (unauthenticated — new users setting up profile) ---

// Register a donor (basic)
router.post("/register", registerDonor);

// Register a donor with file uploads
router.post("/register-with-files", upload.fields([
  { name: 'profilePic', maxCount: 1 },
  { name: 'documents', maxCount: 10 }
]), registerDonorWithFiles);

// --- Authenticated write endpoints ---

// Update donor profile — must be logged in
router.put("/profile/:id", authenticateToken, upload.fields([
  { name: 'profilePic', maxCount: 1 },
  { name: 'documents', maxCount: 10 }
]), updateDonorProfile);

// Make a donation — must be logged in
router.post("/donate", authenticateToken, makeDonation);

// Update donation — must be logged in
router.put("/donation/:donationId", authenticateToken, updateDonation);

// Delete donation — must be logged in
router.delete("/donation/:donationId", authenticateToken, deleteDonation);

// Mark notification as read — must be logged in
router.put("/notifications/:notificationId/read", authenticateToken, markNotificationRead);

// Delete donor — must be logged in
router.delete("/:id", authenticateToken, deleteDonor);

export default router;
