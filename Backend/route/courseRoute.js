import express from 'express';
import {
  createCourse,
  getAllCourses,
  getApprovedCourses,
  updateCourseStatus,
  deleteCourse
} from '../controllers/courseController.js';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public/All authenticated can view approved courses
router.get('/approved', authenticateToken, getApprovedCourses);

// Admin only: view all courses
router.get('/all', authenticateToken, requireAdmin, getAllCourses);

// Any authenticated (admin or donor) can create (admin auto-approved, donor pending)
router.post('/create', authenticateToken, createCourse);

// Admin only: update status
router.put('/:id/status', authenticateToken, requireAdmin, updateCourseStatus);

// Admin only: delete
router.delete('/:id', authenticateToken, requireAdmin, deleteCourse);

export default router;
