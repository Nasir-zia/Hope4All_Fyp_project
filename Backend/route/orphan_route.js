import express from "express";
import multer from "multer";
import pkg from "multer-storage-cloudinary";
const CloudinaryStorage = pkg; // v2 style, no destructuring
import cloudinary from "../Files/cloudinary.js";
import { registerOrphan, getOrphanProfile, updateOrphanProfile } from "../controllers/orphanController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Cloudinary + Multer storage setup
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "orphan_data",
    resource_type: "auto",
  },
});

const upload = multer({ storage });

// Route to register orphan (new users setting up profile might not have full token passed)
router.post(
  "/register",
  upload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "supportingDocs", maxCount: 1 },
  ]),
  registerOrphan
);

// Route to get orphan profile (public read)
router.get("/profile/:id", getOrphanProfile);

// Route to update orphan profile (must be authenticated)
router.put(
  "/profile/:id",
  authenticateToken,
  upload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "supportingDocs", maxCount: 1 },
  ]),
  updateOrphanProfile
);

export default router;
