import express from "express";
import {
  sendMessage,
  getMessages,
  getConversations,
  markMessagesRead
} from "../controllers/messageController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protect all message routes
router.use(authenticateToken);

// Send message (HTTP fallback, prefer Socket.io)
router.post("/", sendMessage);

// Get messages with specific user
router.get("/:otherUserId", getMessages);

// Get all conversations
router.get("/", getConversations);

// Mark messages as read
router.put("/:otherUserId/read", markMessagesRead);

export default router;

