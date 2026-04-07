import Payment from './payment.model.js';
import Booking from '../booking/booking.model.js';
import logger from '../../common/utils/logger.js';

/**
 * Create a new payment record
 */
export const createPayment = async (paymentData) => {
  try {
    const {
      bookingId,
      userId,
      amount,
      paymentMethod,
      paymentGateway = 'mock',
    } = paymentData;

    // Validate booking exists
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    // Create payment record
    const payment = await Payment.create({
      bookingId,
      userId,
      amount,
      paymentMethod,
      paymentGateway,
      transactionId: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
    });

    logger.info(`Payment created: ${payment._id} for booking: ${bookingId}`);

    return {
      success: true,
      message: 'Payment record created',
      data: payment,
    };
  } catch (error) {
    logger.error('[createPayment] Error:', error.message);
    throw error;
  }
};

/**
 * Get payment by ID
 */
export const getPayment = async (paymentId) => {
  try {
    const payment =
      await Payment.findById(paymentId).populate('bookingId userId');

    if (!payment) {
      throw new Error('Payment not found');
    }

    return {
      success: true,
      data: payment,
    };
  } catch (error) {
    logger.error('[getPayment] Error:', error.message);
    throw error;
  }
};

/**
 * Get user's payment history
 */
export const getUserPayments = async (userId) => {
  try {
    const payments = await Payment.find({ userId })
      .populate('bookingId')
      .sort({ createdAt: -1 });

    return {
      success: true,
      data: payments,
    };
  } catch (error) {
    logger.error('[getUserPayments] Error:', error.message);
    throw error;
  }
};

/**
 * Confirm/Complete payment - Mock payment processing
 */
export const completePayment = async (paymentId, transactionData) => {
  try {
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }

    // Update payment status to completed
    payment.status = 'completed';
    payment.completedAt = new Date();
    payment.transactionId =
      transactionData.transactionId || payment.transactionId;
    payment.gatewayReference = transactionData.gatewayReference || null;

    await payment.save();

    // Update booking status and isPaid flag
    const booking = await Booking.findByIdAndUpdate(
      payment.bookingId,
      {
        paymentStatus: 'completed',
        isPaid: true,
        status: 'confirmed',
        paymentId: payment._id,
      },
      { new: true }
    );

    logger.info(
      `Payment completed: ${paymentId} for booking: ${payment.bookingId}`
    );

    return {
      success: true,
      message: 'Payment completed successfully',
      data: booking,
    };
  } catch (error) {
    logger.error('[completePayment] Error:', error.message);
    throw error;
  }
};

/**
 * Mark payment as failed
 */
export const failPayment = async (paymentId, failureReason) => {
  try {
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }

    payment.status = 'failed';
    payment.failureReason = failureReason;
    await payment.save();

    // Update booking payment status
    await Booking.findByIdAndUpdate(payment.bookingId, {
      paymentStatus: 'failed',
      isPaid: false,
    });

    logger.info(`Payment failed: ${paymentId} - Reason: ${failureReason}`);

    return {
      success: true,
      message: 'Payment marked as failed',
      data: payment,
    };
  } catch (error) {
    logger.error('[failPayment] Error:', error.message);
    throw error;
  }
};

/**
 * Refund payment
 */
export const refundPayment = async (paymentId, refundReason) => {
  try {
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }

    if (payment.status !== 'completed') {
      throw new Error('Only completed payments can be refunded');
    }

    payment.status = 'refunded';
    payment.failureReason = refundReason;
    await payment.save();

    // Update booking status
    await Booking.findByIdAndUpdate(payment.bookingId, {
      status: 'cancelled',
      paymentStatus: 'refunded',
    });

    logger.info(`Payment refunded: ${paymentId} - Reason: ${refundReason}`);

    return {
      success: true,
      message: 'Payment refunded successfully',
      data: payment,
    };
  } catch (error) {
    logger.error('[refundPayment] Error:', error.message);
    throw error;
  }
};

/**
 * Webhook handler for payment gateway callbacks (Stripe, VNPay, etc)
 * This is a placeholder - implement based on actual gateway
 */
export const handlePaymentWebhook = async (webhookData) => {
  try {
    logger.info('Payment webhook received:', webhookData);

    // Example: Find payment by gateway reference
    const payment = await Payment.findOne({
      gatewayReference: webhookData.transactionId,
    });

    if (!payment) {
      throw new Error('Payment not found for webhook');
    }

    // Update payment based on webhook status
    if (
      webhookData.status === 'success' ||
      webhookData.status === 'completed'
    ) {
      return completePayment(payment._id, {
        transactionId: webhookData.transactionId,
        gatewayReference: webhookData.transactionId,
      });
    } else if (webhookData.status === 'failed') {
      return failPayment(
        payment._id,
        webhookData.errorMessage || 'Payment failed'
      );
    }

    return {
      success: true,
      message: 'Webhook processed',
    };
  } catch (error) {
    logger.error('[handlePaymentWebhook] Error:', error.message);
    throw error;
  }
};

export default {
  createPayment,
  getPayment,
  getUserPayments,
  completePayment,
  failPayment,
  refundPayment,
  handlePaymentWebhook,
};
