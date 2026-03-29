import express from 'express';
import * as artisanController from './artisan.controller.js';
import { authenticateToken } from '../../common/middleware/auth.middleware.js';
import asyncHandler from '../../common/utils/asyncHandler.js';

const router = express.Router();

/**
 * Artisan Routes
 */

// ==================== PUBLIC ROUTES ====================
// 📋 Lấy danh sách tất cả nghệ nhân
router.get('/', asyncHandler(artisanController.getAllArtisans));

// 🔍 Tìm kiếm nghệ nhân
router.get('/search', asyncHandler(artisanController.searchArtisans));

// 👤 Lấy chi tiết nghệ nhân (MUST be after specific routes)
router.get('/:id', asyncHandler(artisanController.getArtisanDetail));

// 📊 Lấy thống kê hoạt động
router.get('/:id/stats', asyncHandler(artisanController.getArtisanStats));

// ==================== PROTECTED ROUTES ====================
// 🔒 All routes below require authentication
router.use(authenticateToken);

// 👤 Lấy hồ sơ nghệ nhân của chính mình
router.get('/me/profile', asyncHandler(artisanController.getMyArtisanProfile));

// ➕ Tạo hồ sơ nghệ nhân
router.post(
  '/',
  asyncHandler((req, res, next) => {
    // Check if user role is artisan
    if (req.user.role !== 'artisan') {
      return res.status(403).json({
        success: false,
        message: 'Chỉ nghệ nhân mới có thể tạo hồ sơ',
      });
    }
    next();
  }),
  asyncHandler(artisanController.createArtisanProfile)
);

// ✏️ Cập nhật hồ sơ nghệ nhân
router.put(
  '/',
  asyncHandler((req, res, next) => {
    // Check if user role is artisan
    if (req.user.role !== 'artisan') {
      return res.status(403).json({
        success: false,
        message: 'Chỉ nghệ nhân mới có thể cập nhật hồ sơ',
      });
    }
    next();
  }),
  asyncHandler(artisanController.updateArtisanProfile)
);

export default router;
