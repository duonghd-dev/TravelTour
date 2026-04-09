import express from 'express';
import * as bookingController from './booking.controller.js';
import * as bookingValidator from './booking.validator.js';
import { authenticateToken } from '../../common/middleware/auth.middleware.js';

const router = express.Router();



router.get(
  '/available-slots/:experienceId/:date',
  bookingController.getAvailableSlots
);


router.use(authenticateToken);


router.get('/', bookingController.getUserBookings);


router.post(
  '/',
  bookingValidator.validateCreateBooking,
  bookingController.createBooking
);


router.get('/:id', bookingController.getBookingDetail);


router.patch('/:id/status', bookingController.updateBookingStatus);


router.post('/:id/confirm-payment', bookingController.confirmPayment);


router.delete('/:id', bookingController.cancelBooking);

export default router;
