import { Router } from 'express';
import * as paymentController from './payment.controller.js';
import { authenticateToken } from '../../common/middleware/auth.middleware.js';
import {
  enforceHttps,
  rateLimitPayment,
  logPaymentRequest,
} from '../../common/middleware/security.middleware.js';

const router = Router();


router.use(logPaymentRequest); 
router.use(rateLimitPayment(10, 15 * 60 * 1000)); 


if (process.env.NODE_ENV === 'production') {
  router.use(enforceHttps); 
}

router.post(
  '/vnpay/create',
  authenticateToken,
  paymentController.createVNPayPayment
);


router.post('/vnpay/verify', paymentController.verifyVNPayPayment);


router.post(
  '/paypal/create',
  authenticateToken,
  paymentController.createPayPalPayment
);


router.post('/paypal/capture', paymentController.capturePayPalPayment);


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


router.use(authenticateToken);


router.post('/', paymentController.createPayment);


router.get('/user/history', paymentController.getUserPayments);


router.get('/:id', paymentController.getPayment);


router.post('/:id/complete', paymentController.completePayment);


router.post('/:id/fail', paymentController.failPayment);


router.post('/:id/refund', paymentController.refundPayment);


router.post('/webhook', paymentController.handleWebhook);

export default router;
