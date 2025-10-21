import express from "express";
import {
  sendMessage,
  getMessages,
  getConversations,
  markMessagesRead
} from "../controllers/messageController.js";

const router = express.Router();

// Send message
router.post("/", sendMessage);

// Get messages with specific user
router.get("/:otherUserId", getMessages);

// Get all conversations
router.get("/", getConversations);

// Mark messages as read
router.put("/:otherUserId/read", markMessagesRead);

export default router;
