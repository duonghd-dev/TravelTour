import * as adminService from './admin.service.js';
import logger from '../../common/utils/logger.js';

/**
 * GET /api/v1/admin/metrics - Lấy dashboard metrics
 */
export const getDashboardMetrics = async (req, res) => {
  try {
    const timeRange = req.query.timeRange || 'last-30-days';
    const result = await adminService.getDashboardMetrics(timeRange);
    res.json(result);
  } catch (err) {
    logger.error('[getDashboardMetrics] Error:', err.message);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * GET /api/v1/admin/revenue - Lấy doanh thu
 */
export const getRevenueMetrics = async (req, res) => {
  try {
    const result = await adminService.getRevenueMetrics();
    res.json(result);
  } catch (err) {
    logger.error('[getRevenueMetrics] Error:', err.message);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * GET /api/v1/admin/pending-verifications - Lấy artisan chờ xác thực
 */
export const getPendingVerifications = async (req, res) => {
  try {
    const result = await adminService.getPendingVerifications();
    res.json(result);
  } catch (err) {
    logger.error('[getPendingVerifications] Error:', err.message);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * GET /api/v1/admin/bookings-by-category - Lấy booking theo category
 */
export const getBookingsByCategory = async (req, res) => {
  try {
    const result = await adminService.getBookingsByCategory();
    res.json(result);
  } catch (err) {
    logger.error('[getBookingsByCategory] Error:', err.message);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * GET /api/v1/admin/revenue-by-month - Lấy doanh thu theo tháng
 */
export const getRevenueByMonth = async (req, res) => {
  try {
    const result = await adminService.getRevenueByMonth();
    res.json(result);
  } catch (err) {
    logger.error('[getRevenueByMonth] Error:', err.message);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * GET /api/v1/admin/artisans-by-region - Lấy artisan theo vùng địa lý
 */
export const getArtisansByRegion = async (req, res) => {
  try {
    const result = await adminService.getArtisansByRegion();
    res.json(result);
  } catch (err) {
    logger.error('[getArtisansByRegion] Error:', err.message);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
