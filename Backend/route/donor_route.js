import express from "express";
import { registerDonor, getDonors } from "../controllers/donorController.js";

const router = express.Router();

// Route to register a donor
router.post("/register", registerDonor);

// Route to get all donors
router.get("/", getDonors);

export default router;
