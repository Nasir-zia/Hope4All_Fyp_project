import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../Files/cloudinary.js";
import { registerOrphan, getOrphanProfile } from "../controllers/orphanController.js";

const router = express.Router();

// Cloudinary  Multer setup
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "orphan_data",
    resource_type: "auto",
  },
});

const upload = multer({ storage });

// Route  Call controller
router.post(
  "/register",
  upload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "supportingDocs", maxCount: 1 },
  ]),
  registerOrphan
);

router.get("/profile/:id", getOrphanProfile);

export default router;
