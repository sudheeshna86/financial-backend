import express from 'express';
import { getSummary } from '../controllers/dashboardController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// Only Analysts and Admins can access the dashboard insights
router.get('/summary', protect, restrictTo('Analyst', 'Admin'), getSummary);

export default router;