import { Router } from 'express';
import * as paymentController from './payment.controller.js';
import { authenticateToken } from '../../common/middleware/auth.middleware.js';

const router = Router();

// VNPay routes (some don't require auth)
/**
 * POST /api/v1/payments/vnpay/create
 * Create VNPay payment URL (requires auth)
 */
router.post(
  '/vnpay/create',
  authenticateToken,
  paymentController.createVNPayPayment
);

/**
 * POST /api/v1/payments/vnpay/verify
 * Verify VNPay payment callback (no auth required)
 */
router.post('/vnpay/verify', paymentController.verifyVNPayPayment);

/**
 * POST /api/v1/payments/paypal/create
 * Create PayPal payment and get approval URL (requires auth)
 */
router.post(
  '/paypal/create',
  authenticateToken,
  paymentController.createPayPalPayment
);

/**
 * POST /api/v1/payments/paypal/capture
 * Capture PayPal payment after user approval (no auth required)
 */
router.post('/paypal/capture', paymentController.capturePayPalPayment);

// TEST ROUTE - Remove in production
router.post('/test/paypal', async (req, res) => {
  try {
    console.log('[TEST] PayPal test endpoint called');
    const result = await paymentController.createPayPalPayment(req, res);
    return result;
  } catch (error) {
    console.error('[TEST] Error:', error.message);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

// All other payment routes require authentication
router.use(authenticateToken);

/**
 * POST /api/v1/payments
 * Create a new payment
 */
router.post('/', paymentController.createPayment);

/**
 * GET /api/v1/payments/user/history
 * Get user's payment history
 */
router.get('/user/history', paymentController.getUserPayments);

/**
 * GET /api/v1/payments/:id
 * Get payment details
 */
router.get('/:id', paymentController.getPayment);

/**
 * POST /api/v1/payments/:id/complete
 * Complete/Confirm payment
 */
router.post('/:id/complete', paymentController.completePayment);

/**
 * POST /api/v1/payments/:id/fail
 * Mark payment as failed
 */
router.post('/:id/fail', paymentController.failPayment);

/**
 * POST /api/v1/payments/:id/refund
 * Refund payment
 */
router.post('/:id/refund', paymentController.refundPayment);

/**
 * POST /api/v1/payments/webhook
 * Payment gateway webhook (No auth required)
 */
router.post('/webhook', paymentController.handleWebhook);

export default router;
