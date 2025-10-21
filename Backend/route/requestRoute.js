import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../Files/cloudinary.js";
import Request from "../model/request_model.js";
import {
  submitRequest,
  getRequestsByOrphan,
  getAllRequests,
  updateRequestStatus
} from "../controllers/requestController.js";

const router = express.Router();

// Cloudinary storage for request documents
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "request_documents",
    resource_type: "auto",
  },
});

const upload = multer({ storage });

// Submit new request
router.post("/submit", upload.array("documents"), submitRequest);

// Get requests by orphan
router.get("/orphan/:orphanId", getRequestsByOrphan);

// Get all requests (admin)
router.get("/", getAllRequests);

// Update request status (admin)
router.put("/:requestId/status", updateRequestStatus);

// Get approved requests for donors
router.get("/approved", async (req, res) => {
  try {
    const requests = await Request.find({ status: 'approved' })
      .populate('orphanId', 'name age gender')
      .populate('orphanageId', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({ requests });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching approved requests', error: error.message });
  }
});

export default router;
