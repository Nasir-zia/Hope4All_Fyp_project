import express from "express";
import { createOrphanAge } from "../controllers/orphan_agecontroller.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

//  Multer file upload setup — accept any files to avoid "Unexpected field" error
router.post(
  "/create",
  upload.any(),
  createOrphanAge
);

export default router;
