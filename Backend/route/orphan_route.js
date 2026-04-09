import express from "express";
import multer from "multer";
import pkg from "multer-storage-cloudinary";
const CloudinaryStorage = pkg; // v2 style, no destructuring
import cloudinary from "../Files/cloudinary.js";
import { registerOrphan, getOrphanProfile } from "../controllers/orphanController.js";

const router = express.Router();

// Cloudinary + Multer storage setup
const storage = CloudinaryStorage({
  cloudinary,
  folder: "orphan_data",       // v2 style
  resource_type: "auto",
});

const upload = multer({ storage });

// Route to register orphan
router.post(
  "/register",
  upload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "supportingDocs", maxCount: 1 },
  ]),
  registerOrphan
);

// Route to get orphan profile
router.get("/profile/:id", getOrphanProfile);

export default router;
