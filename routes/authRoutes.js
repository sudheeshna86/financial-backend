import express from 'express';
import { protect,restrictTo } from '../middleware/authMiddleware.js';
import { register, login,updateUserStatus } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.patch('/manage-user/:id', protect, restrictTo('Admin'), updateUserStatus);

export default router;