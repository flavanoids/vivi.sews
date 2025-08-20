import express from 'express';
import { login, signup, getProfile, updateProfile, getPendingUsers, approveUser, rejectUser } from '../controllers/authController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/login', login);
router.post('/signup', signup);

// Protected routes
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);

// Admin routes
router.get('/pending-users', authenticateToken, requireAdmin, getPendingUsers);
router.post('/approve-user/:userId', authenticateToken, requireAdmin, approveUser);
router.delete('/reject-user/:userId', authenticateToken, requireAdmin, rejectUser);

export default router;
