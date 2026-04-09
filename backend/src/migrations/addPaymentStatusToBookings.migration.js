import Booking from '../modules/booking/booking.model.js';
import Payment from '../modules/payment/payment.model.js';
import logger from '../common/utils/logger.js';

/**
 * Migration: Add paymentStatus and paymentMethod to existing bookings
 * - If booking.status = 'confirmed', set paymentStatus = 'completed' and isPaid = true
 * - Otherwise, set paymentStatus = 'pending' and isPaid = false
 * - Set paymentMethod based on Payment record or default to 'cash'
 */
async function migratePaymentStatus() {
  try {
    logger.info(
      'Starting migration: Add paymentStatus and paymentMethod to bookings'
    );

    // Find all bookings
    const bookings = await Booking.find({}).lean();
    logger.info(`Found ${bookings.length} bookings to update`);

    let updateCount = 0;
    let confirmedBookings = 0;
    let paypalBookings = 0;
    let vnpayBookings = 0;
    let cashBookings = 0;

    // Update each booking
    for (const booking of bookings) {
      let paymentStatus = 'pending';
      let isPaid = false;
      let paymentMethod = 'cash';

      // If booking is confirmed, mark as completed and paid
      if (booking.status === 'confirmed') {
        paymentStatus = 'completed';
        isPaid = true;
        confirmedBookings++;
      }

      // Check if booking has paymentId (linked to Payment record)
      if (booking.paymentId) {
        const payment = await Payment.findById(booking.paymentId).lean();
        if (payment) {
          // Set paymentMethod based on Payment record
          if (payment.gateway === 'paypal') {
            paymentMethod = 'paypal';
            paypalBookings++;
          } else if (payment.gateway === 'vnpay') {
            paymentMethod = 'vnpay';
            vnpayBookings++;
          } else {
            paymentMethod = 'cash';
            cashBookings++;
          }

          // Update paymentStatus if Payment record says completed
          if (payment.status === 'completed') {
            paymentStatus = 'completed';
            isPaid = true;
          }
        }
      } else {
        cashBookings++;
      }

      // Update booking
      await Booking.findByIdAndUpdate(
        booking._id,
        {
          paymentStatus: paymentStatus,
          isPaid: isPaid,
          paymentMethod: paymentMethod,
        },
        { new: true }
      );

      updateCount++;
    }

    logger.info(
      `Migration completed: Updated ${updateCount} bookings (confirmed: ${confirmedBookings}, paypal: ${paypalBookings}, vnpay: ${vnpayBookings}, cash: ${cashBookings})`
    );
    return {
      success: true,
      message: `Updated ${updateCount} bookings`,
      confirmed: confirmedBookings,
      paypal: paypalBookings,
      vnpay: vnpayBookings,
      cash: cashBookings,
    };
  } catch (error) {
    logger.error('Migration failed:', error);
    throw error;
  }
}

export default migratePaymentStatus;
