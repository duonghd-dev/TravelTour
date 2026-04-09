import Payment from './payment.model.js';
import Booking from '../booking/booking.model.js';
import logger from '../../common/utils/logger.js';
import {
  encrypt,
  decrypt,
  maskSensitiveData,
} from '../../common/utils/encryption.js';

const encryptPaymentDetails = (paymentDetails) => {
  if (!paymentDetails) return null;

  try {
    return encrypt(JSON.stringify(paymentDetails));
  } catch (error) {
    logger.error('Failed to encrypt payment details:', error.message);

    return paymentDetails;
  }
};

const decryptPaymentDetails = (encryptedData) => {
  if (!encryptedData || typeof encryptedData === 'string') {
    return encryptedData;
  }

  try {
    const decrypted = decrypt(encryptedData);
    return JSON.parse(decrypted);
  } catch (error) {
    logger.error('Failed to decrypt payment details:', error.message);
    return null;
  }
};

const maskPaymentDetails = (paymentDetails) => {
  if (!paymentDetails) return null;

  return {
    last4Digits: maskSensitiveData(paymentDetails.last4Digits, 4),
    cardBrand: paymentDetails.cardBrand || '',
    bankCode: paymentDetails.bankCode
      ? maskSensitiveData(paymentDetails.bankCode, 2)
      : '',
    bankName: paymentDetails.bankName || '',
    notes: paymentDetails.notes || '',
  };
};

export const createPayment = async (paymentData) => {
  try {
    const {
      bookingId,
      userId,
      amount,
      paymentMethod,
      paymentGateway = 'mock',
    } = paymentData;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

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

export const getPayment = async (paymentId) => {
  try {
    const payment =
      await Payment.findById(paymentId).populate('bookingId userId');

    if (!payment) {
      throw new Error('Payment not found');
    }

    const paymentObj = payment.toObject();

    if (paymentObj.isEncrypted && paymentObj.paymentDetails) {
      const decrypted = decryptPaymentDetails(paymentObj.paymentDetails);

      paymentObj.paymentDetails = maskPaymentDetails(decrypted);
    }

    return {
      success: true,
      data: paymentObj,
    };
  } catch (error) {
    logger.error('[getPayment] Error:', error.message);
    throw error;
  }
};

export const getUserPayments = async (userId) => {
  try {
    const payments = await Payment.find({ userId })
      .populate('bookingId')
      .sort({ createdAt: -1 });

    const decryptedPayments = payments.map((payment) => {
      const paymentObj = payment.toObject();

      if (paymentObj.isEncrypted && paymentObj.paymentDetails) {
        const decrypted = decryptPaymentDetails(paymentObj.paymentDetails);

        paymentObj.paymentDetails = maskPaymentDetails(decrypted);
      }

      return paymentObj;
    });

    return {
      success: true,
      data: decryptedPayments,
    };
  } catch (error) {
    logger.error('[getUserPayments] Error:', error.message);
    throw error;
  }
};

export const completePayment = async (paymentId, transactionData) => {
  try {
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }

    payment.status = 'completed';
    payment.completedAt = new Date();
    payment.transactionId =
      transactionData.transactionId || payment.transactionId;
    payment.gatewayReference = transactionData.gatewayReference || null;

    await payment.save();

    const booking = await Booking.findByIdAndUpdate(
      payment.bookingId,
      {
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

export const failPayment = async (paymentId, failureReason) => {
  try {
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }

    payment.status = 'failed';
    payment.failureReason = failureReason;
    await payment.save();

    await Booking.findByIdAndUpdate(payment.bookingId, {
      paymentStatus: 'failed',
      isPaid: false,
    });

    logger.info(`❌ Payment failed: ${paymentId} - Reason: ${failureReason}`);

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

    await Booking.findByIdAndUpdate(payment.bookingId, {
      status: 'cancelled',
      paymentStatus: 'refunded',
    });

    logger.info(`✅ Payment refunded: ${paymentId} - Reason: ${refundReason}`);

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

export const preparePaymentDetails = (details) => {
  if (!details || Object.keys(details).length === 0) {
    return { encrypted: null, isEncrypted: false };
  }

  const encrypted = encryptPaymentDetails(details);
  return {
    encrypted,
    isEncrypted: !!encrypted && typeof encrypted === 'object' && encrypted.iv,
  };
};

export const getPaymentDetailsForClient = (payment) => {
  if (!payment || !payment.paymentDetails) {
    return null;
  }

  try {
    if (payment.isEncrypted) {
      const decrypted = decryptPaymentDetails(payment.paymentDetails);
      return maskPaymentDetails(decrypted);
    }

    return maskPaymentDetails(payment.paymentDetails);
  } catch (error) {
    logger.error(
      'Failed to prepare payment details for client:',
      error.message
    );
    return null;
  }
};

export const handlePaymentWebhook = async (webhookData) => {
  try {
    logger.info('Payment webhook received:', webhookData);

    const payment = await Payment.findOne({
      gatewayReference: webhookData.transactionId,
    });

    if (!payment) {
      throw new Error('Payment not found for webhook');
    }

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
  preparePaymentDetails,
  getPaymentDetailsForClient,
};
