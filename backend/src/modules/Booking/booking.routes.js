import express from 'express';
import * as bookingController from './booking.controller.js';
import * as bookingValidator from './booking.validator.js';
import { authenticateToken } from '../../common/middleware/auth.middleware.js';

const router = express.Router();

// Public routes
// GET /api/v1/bookings/available-slots/:experienceId/:date - Get available slots for a date
router.get(
  '/available-slots/:experienceId/:date',
  bookingController.getAvailableSlots
);

// Protected routes (require auth)
router.use(authenticateToken);

// GET /api/v1/bookings - Get user's bookings
router.get('/', bookingController.getUserBookings);

// POST /api/v1/bookings - Create new booking
router.post(
  '/',
  bookingValidator.validateCreateBooking,
  bookingController.createBooking
);

// GET /api/v1/bookings/:id - Get booking detail
router.get('/:id', bookingController.getBookingDetail);

// PATCH /api/v1/bookings/:id/status - Update booking status
router.patch('/:id/status', bookingController.updateBookingStatus);

// POST /api/v1/bookings/:id/confirm-payment - Confirm payment for booking
router.post('/:id/confirm-payment', bookingController.confirmPayment);

// DELETE /api/v1/bookings/:id - Cancel booking
router.delete('/:id', bookingController.cancelBooking);

export default router;
