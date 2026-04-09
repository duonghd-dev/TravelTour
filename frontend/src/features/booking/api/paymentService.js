

import apiService from '@/services/api/apiService.js';

const paymentAPI = '/api/v1/payments';


export const createVNPayPayment = async (bookingId, amount) => {
  try {
    const response = await apiService.post(`${paymentAPI}/vnpay/create`, {
      bookingId,
      amount, 
      clientIp: await getClientIP(),
      returnUrl: `${window.location.origin}/checkout/payment-result`,
    });
    console.log('[paymentService] Raw Response:', response);
    console.log('[paymentService] Response.paymentUrl:', response?.paymentUrl);
    
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


export const capturePayPalPayment = async (orderId) => {
  try {
    console.log(
      '[paymentService] Initiating PayPal capture for order:',
      orderId
    );
    const response = await apiService.post(`${paymentAPI}/paypal/capture`, {
      orderId,
    });
    
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


const getClientIP = async () => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch {
    return '127.0.0.1'; 
  }
};

export default {
  createVNPayPayment,
  verifyVNPayPayment,
  createPayPalPayment,
  verifyPayPalPayment,
  confirmPayment,
};
