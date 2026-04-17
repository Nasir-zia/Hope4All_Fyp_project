import express from 'express';
import { addProgress, getOrphanProgress, deleteProgress } from '../controllers/progressController.js';

const router = express.Router();

router.post('/add', addProgress);
router.get('/orphan/:orphanId', getOrphanProgress);
router.delete('/:id', deleteProgress);

export default router;
