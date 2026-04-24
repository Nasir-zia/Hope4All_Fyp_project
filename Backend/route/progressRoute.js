import express from 'express';
import { addProgress, getOrphanProgress, deleteProgress } from '../controllers/progressController.js';
import upload from '../middleware/uploadMiddleware.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Add progress entry — must be authenticated (orphan/admin)
router.post('/add', authenticateToken, upload.single('achievementImage'), addProgress);

// Get progress for an orphan — public (donors/visitors can view)
router.get('/orphan/:orphanId', getOrphanProgress);

// Delete a progress entry — must be authenticated
router.delete('/:id', authenticateToken, deleteProgress);

export default router;
