import express from 'express';
import * as reviewController from './review.controller.js';
import { authenticateToken } from '../../common/middleware/auth.middleware.js';
import asyncHandler from '../../common/utils/asyncHandler.js';

const router = express.Router();

/**
 * Review Routes
 */

// ==================== PROTECTED ROUTES ====================
// ➕ Tạo review
router.post(
  '/',
  authenticateToken,
  asyncHandler(reviewController.createReview)
);

// 🗑️ Xóa review
router.delete(
  '/:reviewId',
  authenticateToken,
  asyncHandler(reviewController.deleteReview)
);

// ==================== PUBLIC ROUTES ====================
// 📋 Lấy reviews - hỗ trợ filter theo experience hoặc artisan
router.get(
  '/by-experience/:experienceId',
  asyncHandler(reviewController.getExperienceReviews)
);
router.get(
  '/by-artisan/:artisanId',
  asyncHandler(reviewController.getArtisanReviews)
);

export default router;
