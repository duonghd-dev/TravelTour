import express from 'express';
import * as aiController from './ai.controller.js';

const router = express.Router();

/**
 * @route   POST /api/v1/ai/suggest
 * @desc    Lấy tư vấn từ AI
 */
router.post('/suggest', aiController.getAISuggestion);

/**
 * @route   GET /api/v1/ai/health
 * @desc    Kiểm tra trạng thái Gemini API
 */
router.get('/health', aiController.checkAIHealth);

export default router;
