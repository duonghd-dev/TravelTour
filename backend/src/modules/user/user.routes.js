import express from 'express';
import * as userController from './user.controller.js';
import { authenticateToken } from '../../common/middleware/auth.middleware.js';
import {
  authorizeAdmin,
  authorizeAdminOrStaff,
} from '../../common/middleware/authorization.middleware.js';
import asyncHandler from '../../common/utils/asyncHandler.js';

const router = express.Router();

/**
 * User Routes
 * Routes are organized by specificity (most specific first)
 */

// 🔓 Public route - Verify email with OTP (no authentication needed)
router.post('/verify-email', asyncHandler(userController.verifyEmailOTP));

// 🔒 All routes below require authentication
router.use(authenticateToken);

// ==================== PROFILE ROUTES ====================
// 👤 Get own profile
router.get('/profile', asyncHandler(userController.getProfile));
// 👤 Update own profile
router.put('/profile', asyncHandler(userController.updateProfile));

// ==================== SUPPORT CHAT ROUTES ====================
// 💬 Get admin/staff user for customer support chat (no admin role required)
router.get('/support/admin', asyncHandler(userController.getAdminUser));

// ==================== PASSWORD & SECURITY ====================
// 🔐 Update password
router.put('/password', asyncHandler(userController.updatePassword));
// 🔐 Update two-factor authentication
router.put(
  '/two-factor-auth',
  asyncHandler(userController.updateTwoFactorAuth)
);

// ==================== ACTIVITY & STATS ====================
// 📊 Get activity log
router.get('/activity-log', asyncHandler(userController.getActivityLog));
// 📊 Get user stats (MUST be before /:id)
router.get('/stats/overview', asyncHandler(userController.getUserStats));

// ==================== FAVORITES ====================
// ❤️ Get user's favorites
router.get('/favorites', asyncHandler(userController.getFavorites));
// ➕ Add to favorites
router.post('/favorites', asyncHandler(userController.addFavorite));
// ❌ Remove from favorites
router.delete('/favorites/:id', asyncHandler(userController.removeFavorite));

// ==================== ADMIN ROUTES ====================
// 👥 Get admin user for support chat
router.get(
  '/admin',
  authorizeAdminOrStaff,
  asyncHandler(userController.getAdminUser)
);

// 📊 Create user (admin only)
router.post('/', authorizeAdmin, asyncHandler(userController.createUser));

// 👥 Get all users (admin only)
router.get(
  '/',
  authorizeAdminOrStaff,
  asyncHandler(userController.getAllUsers)
);

// 👤 Get specific user by ID (admin only)
router.get('/:id', authorizeAdmin, asyncHandler(userController.getUserById));

// 📝 Update specific user (admin only)
router.put('/:id', authorizeAdmin, asyncHandler(userController.updateUserById));

// 🗑️ Delete user (admin only)
router.delete('/:id', authorizeAdmin, asyncHandler(userController.deleteUser));

export default router;
