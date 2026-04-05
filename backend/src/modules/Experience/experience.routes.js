import express from 'express';
import * as experienceController from './experience.controller.js';
import { authenticateToken } from '../../common/middleware/auth.middleware.js';
import asyncHandler from '../../common/utils/asyncHandler.js';

const router = express.Router();

/**
 * Experience Routes
 */

// ==================== PUBLIC ROUTES ====================
// 📋 Lấy danh sách experiences
router.get('/', asyncHandler(experienceController.getAllExperiences));

// 👤 Lấy chi tiết experience
router.get('/:id', asyncHandler(experienceController.getExperienceDetail));

// ==================== PROTECTED ROUTES ====================
// 🔒 All routes below require authentication
router.use(authenticateToken);

// ➕ Tạo experience
router.post('/', asyncHandler(experienceController.createExperience));

// ✏️ Cập nhật experience
router.put('/:id', asyncHandler(experienceController.updateExperience));

export default router;
