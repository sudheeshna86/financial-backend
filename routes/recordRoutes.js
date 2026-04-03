import express from 'express';
import * as recordController from '../controllers/recordController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// All record routes require being logged in
router.use(protect);

router.route('/')
  .get(recordController.getAllRecords) // Viewers, Analysts, Admins can view
  .post(restrictTo('Admin', 'Analyst'), recordController.createRecord); // Viewers blocked

router.route('/:id')
  .patch(restrictTo('Admin', 'Analyst'), recordController.updateRecord)
  .delete(restrictTo('Admin'), recordController.deleteRecord); // Only Admins can delete

export default router;