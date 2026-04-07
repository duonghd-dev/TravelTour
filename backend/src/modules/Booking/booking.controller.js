import * as bookingService from './booking.service.js';
import logger from '../../common/utils/logger.js';

/**
 * Lấy danh sách bookings của user
 */
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user._id;
    const result = await bookingService.getUserBookings(userId);

    res.json(result);
  } catch (err) {
    logger.error('[getUserBookings] Error:', err.message);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * Tạo booking mới
 */
export const createBooking = async (req, res) => {
  try {
    const userId = req.user._id;
    const result = await bookingService.createBooking(userId, req.body);

    res.status(201).json(result);
  } catch (err) {
    logger.error('[createBooking] Error:', err.message);
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * Lấy chi tiết booking
 */
export const getBookingDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await bookingService.getBookingDetail(id);

    res.json(result);
  } catch (err) {
    logger.error('[getBookingDetail] Error:', err.message);
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * Cập nhật status booking
 */
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const result = await bookingService.updateBookingStatus(id, status);

    res.json(result);
  } catch (err) {
    logger.error('[updateBookingStatus] Error:', err.message);
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * Hủy booking
 */
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await bookingService.cancelBooking(id);

    res.json(result);
  } catch (err) {
    logger.error('[cancelBooking] Error:', err.message);
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * Confirm payment for booking
 */
export const confirmPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { transactionId, paymentMethod } = req.body;
    const userId = req.user._id;

    const result = await bookingService.confirmPayment(id, userId, {
      transactionId,
      paymentMethod,
    });

    res.json(result);
  } catch (err) {
    logger.error('[confirmPayment] Error:', err.message);
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * Lấy số slot còn trống cho một ngày cụ thể
 * GET /api/v1/bookings/available-slots/:experienceId/:date
 */
export const getAvailableSlots = async (req, res) => {
  try {
    const { experienceId, date } = req.params;
    const result = await bookingService.getAvailableSlots(experienceId, date);

    res.json(result);
  } catch (err) {
    logger.error('[getAvailableSlots] Error:', err.message);
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
