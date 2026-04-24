import express from "express";
import { createFee, getOrphanFees, getAvailableFees, pledgeFee, markFeePaid } from "../controllers/fee_controller.js";
import { authenticateToken, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create a fee entry — accessible to orphans and admins
router.post("/create", authenticateToken, createFee);

// Read endpoints — public (donors/orphans browse without a separate auth roundtrip)
router.get("/orphan/:orphanId", getOrphanFees);
router.get("/available", getAvailableFees);

// Donor pledges a fee — must be logged in
router.post("/pledge/:feeId", authenticateToken, pledgeFee);

// Donor/admin marks a pledged fee as paid — must be logged in
router.put("/pay/:feeId", authenticateToken, markFeePaid);

export default router;
