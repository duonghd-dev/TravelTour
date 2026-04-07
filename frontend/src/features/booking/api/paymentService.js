/**
 * Payment Service
 * Handle VNPay, PayPal and other payment methods
 */

import apiService from '@/services/api/apiService.js';

const paymentAPI = '/api/v1/payments';

/**
 * Create VNPay payment
 * @param {string} bookingId - Booking ID
 * @param {number} amount - Amount in VND
 * @returns {Promise}
 */
export const createVNPayPayment = async (bookingId, amount) => {
  try {
    const response = await apiService.post(`${paymentAPI}/vnpay/create`, {
      bookingId,
      amount, // VND
      clientIp: await getClientIP(),
      returnUrl: `${window.location.origin}/checkout/payment-result`,
    });
    console.log('[paymentService] Raw Response:', response);
    console.log('[paymentService] Response.paymentUrl:', response?.paymentUrl);
    // apiService already returns response.data, so check if we need to unwrap further
    if (response && typeof response === 'object') {
      console.log('[paymentService] Response Keys:', Object.keys(response));
      return response;
    }
    return response;
  } catch (error) {
    console.error('[paymentService] Error creating VNPay payment:', error);
    throw error;
  }
};

/**
 * Verify VNPay payment callback
 * @param {Object} queryParams - Query parameters from VNPay redirect
 * @returns {Promise}
 */
export const verifyVNPayPayment = async (queryParams) => {
  try {
    const response = await apiService.post(
      `${paymentAPI}/vnpay/verify`,
      queryParams
    );
    return response.data;
  } catch (error) {
    console.error('Failed to verify VNPay payment:', error);
    throw error;
  }
};

/**
 * Create PayPal payment
 * @param {string} bookingId - Booking ID
 * @param {number} amount - Amount in USD
 * @param {string} currency - Currency code (default: USD)
 * @returns {Promise}
 */
export const createPayPalPayment = async (
  bookingId,
  amount,
  currency = 'USD'
) => {
  try {
    const response = await apiService.post(`${paymentAPI}/paypal/create`, {
      bookingId,
      amount,
      currency,
      clientIp: await getClientIP(),
      returnUrl: `${window.location.origin}/checkout/payment-result`,
      cancelUrl: `${window.location.origin}/checkout`,
    });
    console.log('[paymentService] PayPal Response:', response);
    console.log(
      '[paymentService] PayPal Response Keys:',
      Object.keys(response || {})
    );
    return response;
  } catch (error) {
    console.error('Failed to create PayPal payment:', error);
    throw error;
  }
};

/**
 * Verify PayPal payment
 * @param {string} paymentId - PayPal payment ID
 * @param {string} payerId - PayPal payer ID
 * @returns {Promise}
 */
export const verifyPayPalPayment = async (paymentId, payerId) => {
  try {
    const response = await apiService.post(`${paymentAPI}/paypal/verify`, {
      paymentId,
      payerId,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to verify PayPal payment:', error);
    throw error;
  }
};

/**
 * Capture PayPal payment (finalize transaction)
 * @param {string} orderId - PayPal Order ID (token)
 * @returns {Promise}
 */
export const capturePayPalPayment = async (orderId) => {
  try {
    console.log(
      '[paymentService] Initiating PayPal capture for order:',
      orderId
    );
    const response = await apiService.post(`${paymentAPI}/paypal/capture`, {
      orderId,
    });
    // apiService returns response directly with data unwrapped
    console.log('[paymentService] PayPal capture response:', response);
    console.log(
      '[paymentService] Capture response keys:',
      Object.keys(response || {})
    );

    if (!response) {
      throw new Error('No response from PayPal capture');
    }

    return response;
  } catch (error) {
    console.error('[paymentService] Failed to capture PayPal payment:', error);
    console.error('[paymentService] Error details:', error.message);
    throw error;
  }
};

/**
 * Confirm Payment (update booking with payment info)
 * @param {string} bookingId - Booking ID
 * @param {Object} paymentData - Payment transaction details
 * @returns {Promise}
 */
export const confirmPayment = async (bookingId, paymentData) => {
  try {
    const response = await apiService.post(
      `/api/v1/bookings/${bookingId}/confirm-payment`,
      paymentData
    );
    return response.data;
  } catch (error) {
    console.error('Failed to confirm payment:', error);
    throw error;
  }
};

/**
 * Get client IP address
 * @returns {Promise<string>}
 */
const getClientIP = async () => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch {
    return '127.0.0.1'; // Fallback
  }
};

export default {
  createVNPayPayment,
  verifyVNPayPayment,
  createPayPalPayment,
  verifyPayPalPayment,
  confirmPayment,
};
