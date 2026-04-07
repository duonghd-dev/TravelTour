import * as paymentService from './payment.service.js';
import * as vnpayService from './vnpay.service.js';
import * as paypalService from './paypal.service.js';
import asyncHandler from '../../common/utils/asyncHandler.js';
import logger from '../../common/utils/logger.js';

/**
 * POST /api/v1/payments
 * Create a new payment
 */
export const createPayment = asyncHandler(async (req, res) => {
  const { bookingId, amount, paymentMethod } = req.body;
  const userId = req.user.userId;

  if (!bookingId || !amount || !paymentMethod) {
    return res.status(400).json({
      success: false,
      message: 'bookingId, amount, and paymentMethod are required',
    });
  }

  const result = await paymentService.createPayment({
    bookingId,
    userId,
    amount,
    paymentMethod,
    paymentGateway: 'mock', // Using mock for testing
  });

  res.json(result);
});

/**
 * GET /api/v1/payments/:id
 * Get payment details
 */
export const getPayment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await paymentService.getPayment(id);
  res.json(result);
});

/**
 * GET /api/v1/payments/user/history
 * Get user's payment history
 */
export const getUserPayments = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const result = await paymentService.getUserPayments(userId);
  res.json(result);
});

/**
 * POST /api/v1/payments/:id/complete
 * Complete/Confirm a payment (Mock implementation)
 */
export const completePayment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { transactionId } = req.body;

  const result = await paymentService.completePayment(id, {
    transactionId: transactionId || `TXN_${Date.now()}`,
  });

  res.json(result);
});

/**
 * POST /api/v1/payments/:id/fail
 * Mark payment as failed
 */
export const failPayment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { failureReason } = req.body;

  const result = await paymentService.failPayment(
    id,
    failureReason || 'Payment processing error'
  );

  res.json(result);
});

/**
 * POST /api/v1/payments/:id/refund
 * Refund a payment
 */
export const refundPayment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { refundReason } = req.body;

  const result = await paymentService.refundPayment(
    id,
    refundReason || 'Customer requested refund'
  );

  res.json(result);
});

/**
 * POST /api/v1/payments/webhook
 * Handle payment gateway webhooks
 */
export const handleWebhook = asyncHandler(async (req, res) => {
  const webhookData = req.body;

  // Verify webhook authenticity (implementation depends on gateway)
  // For now, just process it

  const result = await paymentService.handlePaymentWebhook(webhookData);

  res.json(result);
});

/**
 * POST /api/v1/payments/vnpay/create
 * Create VNPay payment URL
 */
export const createVNPayPayment = asyncHandler(async (req, res) => {
  const { bookingId, amount, clientIp, returnUrl } = req.body;

  logger.info('[createVNPayPayment Controller] Received request:', {
    bookingId,
    amount,
    clientIp: clientIp || req.ip,
  });

  if (!bookingId || !amount) {
    logger.warn('[createVNPayPayment] Missing required fields:', {
      bookingId,
      amount,
    });
    return res.status(400).json({
      success: false,
      code: 'INVALID_REQUEST',
      message: 'bookingId and amount are required',
    });
  }

  try {
    const result = await vnpayService.createVNPayPayment({
      bookingId,
      amount,
      ipAddress: clientIp || req.ip,
      returnUrl: returnUrl,
    });

    logger.info('[createVNPayPayment] Success:', {
      paymentId: result.paymentId,
    });

    res.json(result);
  } catch (error) {
    logger.error('[createVNPayPayment] Payment creation failed:', {
      message: error.message,
      stack: error.stack,
      bookingId,
      amount,
    });

    // Return detailed error to frontend for debugging
    res.status(500).json({
      success: false,
      code: 'VNPAY_ERROR',
      message: error.message || 'Failed to create VNPay payment',
      details: process.env.NODE_ENV === 'development' ? error.message : null,
    });
  }
});

/**
 * POST /api/v1/payments/vnpay/verify
 * Verify VNPay payment callback
 */
export const verifyVNPayPayment = asyncHandler(async (req, res) => {
  const queryParams = req.body.queryParams || req.body;

  if (!queryParams.vnp_TxnRef || !queryParams.vnp_SecureHash) {
    return res.status(400).json({
      success: false,
      message: 'Missing required VNPay parameters',
    });
  }

  const result = await vnpayService.verifyVNPayPayment(queryParams);

  res.json(result);
});

/**
 * POST /api/v1/payments/paypal/create
 * Create PayPal payment and get approval URL
 */
export const createPayPalPayment = asyncHandler(async (req, res) => {
  const { bookingId, amount, clientIp, returnUrl, cancelUrl } = req.body;

  logger.info('[createPayPalPayment Controller] Received request:', {
    bookingId,
    amount,
    clientIp: clientIp || req.ip,
  });

  if (!bookingId || !amount) {
    logger.warn('[createPayPalPayment] Missing required fields:', {
      bookingId,
      amount,
    });
    return res.status(400).json({
      success: false,
      code: 'INVALID_REQUEST',
      message: 'bookingId and amount are required',
    });
  }

  try {
    const result = await paypalService.createPayPalPayment({
      bookingId,
      amount,
      ipAddress: clientIp || req.ip,
      returnUrl: returnUrl,
      cancelUrl: cancelUrl,
    });

    logger.info('[createPayPalPayment] Success:', {
      paymentId: result.paymentId,
      paypalOrderId: result.paypalOrderId,
    });

    res.json(result);
  } catch (error) {
    logger.error('[createPayPalPayment] Payment creation failed:', {
      message: error.message,
      stack: error.stack,
      bookingId,
      amount,
    });

    // Return detailed error to frontend for debugging
    res.status(500).json({
      success: false,
      code: 'PAYPAL_ERROR',
      message: error.message || 'Failed to create PayPal payment',
      details: process.env.NODE_ENV === 'development' ? error.message : null,
    });
  }
});

/**
 * POST /api/v1/payments/paypal/capture
 * Capture PayPal payment after user approval
 */
export const capturePayPalPayment = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  if (!orderId) {
    return res.status(400).json({
      success: false,
      message: 'orderId is required',
    });
  }

  const result = await paypalService.capturePayPalPayment(orderId);

  res.json(result);
});

export default {
  createPayment,
  getPayment,
  getUserPayments,
  completePayment,
  failPayment,
  refundPayment,
  handleWebhook,
  createVNPayPayment,
  verifyVNPayPayment,
  createPayPalPayment,
  capturePayPalPayment,
};
