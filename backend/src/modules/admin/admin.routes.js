import express from 'express';
import * as adminController from './admin.controller.js';
import {
  authenticateToken,
  authorize,
} from '../../common/middleware/auth.middleware.js';

const router = express.Router();

// ==================== PROTECTED ROUTES (Admin only) ====================
router.use(authenticateToken);
router.use(authorize(['admin']));

// 📊 Dashboard metrics
router.get('/metrics', adminController.getDashboardMetrics);
router.get('/revenue', adminController.getRevenueMetrics);
router.get('/pending-verifications', adminController.getPendingVerifications);
router.get('/bookings-by-category', adminController.getBookingsByCategory);
router.get('/revenue-by-month', adminController.getRevenueByMonth);
router.get('/artisans-by-region', adminController.getArtisansByRegion);

export default router;
