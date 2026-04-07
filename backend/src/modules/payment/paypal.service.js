import crypto from 'crypto';
import fetch from 'node-fetch';
import logger from '../../common/utils/logger.js';
import Payment from './payment.model.js';
import Booking from '../booking/booking.model.js';

/**
 * PayPal Payment Service
 * Handles PayPal payment gateway integration using REST API
 */

// PayPal Configuration
const PAYPAL_CONFIG = {
  mode: process.env.PAYPAL_MODE || 'sandbox', // sandbox or live
  clientId: process.env.PAYPAL_CLIENT_ID || 'YOUR_PAYPAL_CLIENT_ID',
  clientSecret: process.env.PAYPAL_CLIENT_SECRET || 'YOUR_PAYPAL_CLIENT_SECRET',
  returnUrl:
    process.env.PAYPAL_RETURN_URL ||
    'http://localhost:5173/checkout/payment-result',
  cancelUrl: process.env.PAYPAL_CANCEL_URL || 'http://localhost:5173/checkout',
};

// Get PayPal API base URL based on mode
const getPayPalApiUrl = () => {
  return PAYPAL_CONFIG.mode === 'sandbox'
    ? 'https://api.sandbox.paypal.com'
    : 'https://api.paypal.com';
};

// Get PayPal access token
const getAccessToken = async () => {
  try {
    console.log('[PayPal OAuth] Getting access token...');
    console.log(
      '[PayPal OAuth] ClientID length:',
      PAYPAL_CONFIG.clientId.length
    );
    console.log(
      '[PayPal OAuth] ClientSecret length:',
      PAYPAL_CONFIG.clientSecret.length
    );
    console.log('[PayPal OAuth] Mode:', PAYPAL_CONFIG.mode);
    console.log('[PayPal OAuth] URL:', getPayPalApiUrl());

    const auth = Buffer.from(
      `${PAYPAL_CONFIG.clientId}:${PAYPAL_CONFIG.clientSecret}`
    ).toString('base64');

    // Add timeout to fetch
    const fetchPromise = fetch(`${getPayPalApiUrl()}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error('PayPal request timeout after 10s')),
        10000
      )
    );

    const response = await Promise.race([fetchPromise, timeoutPromise]);

    const responseText = await response.text();
    console.log('[PayPal OAuth] Response status:', response.status);
    console.log('[PayPal OAuth] Response text:', responseText);

    if (!response.ok) {
      throw new Error(
        `PayPal OAuth failed: ${response.status} - ${responseText}`
      );
    }

    const data = JSON.parse(responseText);
    return data.access_token;
  } catch (error) {
    logger.error('[getAccessToken] Error:', error.message);
    logger.error('[getAccessToken] Stack:', error.stack);
    throw error;
  }
};

/**
 * Create PayPal payment and get approval URL
 * @param {Object} paymentData - Payment data {bookingId, amount, ipAddress, returnUrl, cancelUrl}
 * @returns {Promise<Object>} PayPal approval URL and transaction info
 */
export const createPayPalPayment = async (paymentData) => {
  try {
    // Validate PayPal credentials are configured
    if (
      PAYPAL_CONFIG.clientId.includes('YOUR_') ||
      PAYPAL_CONFIG.clientSecret.includes('YOUR_')
    ) {
      throw new Error(
        'PayPal credentials not configured. Please set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in .env'
      );
    }

    const { bookingId, amount, ipAddress, returnUrl, cancelUrl } = paymentData;

    console.log('[createPayPalPayment] Creating payment for:');
    console.log('  - bookingId:', bookingId);
    console.log('  - amount:', amount);

    // Validate booking exists
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    console.log('[createPayPalPayment] Found booking:');
    console.log('  - userId:', booking.userId);
    console.log('  - totalPrice:', booking.totalPrice);
    console.log('  - billingInfo:', JSON.stringify(booking.billingInfo));

    // Validate billing info exists
    if (
      !booking.billingInfo ||
      !booking.billingInfo.email ||
      !booking.billingInfo.fullName
    ) {
      console.error(
        '[createPayPalPayment] Invalid billing info:',
        booking.billingInfo
      );
      throw new Error(
        'Booking missing complete billing information (email and fullName required)'
      );
    }

    // Create/update payment record
    let payment = await Payment.findOne({
      bookingId,
      paymentMethod: 'paypal',
    });

    if (!payment) {
      payment = await Payment.create({
        bookingId,
        userId: booking.userId,
        amount: amount,
        paymentMethod: 'paypal',
        paymentGateway: 'paypal',
        transactionId: `PAYPAL_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        status: 'pending',
      });
    } else {
      payment.amount = amount;
      payment.status = 'pending';
      await payment.save();
    }

    // Get PayPal access token
    const accessToken = await getAccessToken();

    // Convert amount to USD safely
    const amountInUsd = (amount / 24500).toFixed(2);
    console.log(
      '[createPayPalPayment] Amount conversion: ',
      amount,
      'VND =',
      amountInUsd,
      'USD'
    );

    // Validate converted amount
    if (parseFloat(amountInUsd) <= 0) {
      throw new Error(
        `Invalid converted amount: ${amountInUsd} USD from ${amount} VND`
      );
    }

    // Prepare PayPal order request
    const paypalOrder = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: payment._id.toString(),
          description: `Booking_${bookingId}_User_${booking.userId}`,
          amount: {
            currency_code: 'USD',
            // Convert VND to USD (1 USD ≈ 24,500 VND - update rate as needed)
            value: amountInUsd,
          },
        },
      ],
      payer: {
        email_address: booking.billingInfo?.email || 'customer@example.com',
        name: {
          given_name:
            booking.billingInfo?.fullName?.split(' ')[0] || 'Customer',
          surname:
            booking.billingInfo?.fullName?.split(' ').slice(1).join(' ') ||
            'Traveler',
        },
      },
      application_context: {
        brand_name: 'Vietnam Heritage Tours',
        locale: 'en-US',
        landing_page: 'BILLING',
        user_action: 'PAY_NOW',
        return_url: returnUrl || PAYPAL_CONFIG.returnUrl,
        cancel_url: cancelUrl || PAYPAL_CONFIG.cancelUrl,
      },
    };

    console.log(
      '[createPayPalPayment] PayPal order request:',
      JSON.stringify(paypalOrder, null, 2)
    );

    // Call PayPal Create Order API
    const response = await fetch(`${getPayPalApiUrl()}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(paypalOrder),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`PayPal API error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();

    // Find approval link from links array
    const approvalUrl = data.links.find((link) => link.rel === 'approve')?.href;

    if (!approvalUrl) {
      throw new Error('PayPal approval URL not found in response');
    }

    // Update payment with PayPal transaction ID (store PayPal order ID in gatewayReference)
    payment.gatewayReference = data.id;
    await payment.save();

    console.log('[createPayPalPayment] Payment created successfully:');
    console.log('  - paymentId:', payment._id);
    console.log('  - gatewayReference (PayPal Order ID):', data.id);

    logger.info(
      `PayPal payment created: ${payment._id} for booking: ${bookingId}`
    );

    const responseData = {
      success: true,
      message: 'PayPal payment URL created',
      approvalUrl: approvalUrl,
      paymentUrl: approvalUrl, // For compatibility
      paymentId: payment._id,
      paypalOrderId: data.id,
      amount: amount,
    };

    logger.info('[PayPal Response]:', JSON.stringify(responseData));

    return responseData;
  } catch (error) {
    logger.error('[createPayPalPayment] Error:', error.message);
    logger.error('[createPayPalPayment] Stack:', error.stack);
    logger.error('[createPayPalPayment] Full error:', JSON.stringify(error));
    throw error;
  }
};

/**
 * Verify PayPal payment execution
 * @param {string} orderId - PayPal Order ID
 * @returns {Promise<Object>} Verification result
 */
export const verifyPayPalPayment = async (orderId) => {
  try {
    const accessToken = await getAccessToken();

    const response = await fetch(
      `${getPayPalApiUrl()}/v2/checkout/orders/${orderId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`PayPal API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    logger.error('[verifyPayPalPayment] Error:', error.message);
    throw error;
  }
};

/**
 * Capture PayPal payment (finalize transaction)
 * @param {string} orderId - PayPal Order ID
 * @returns {Promise<Object>} Capture result
 */
export const capturePayPalPayment = async (orderId) => {
  try {
    console.log('[capturePayPalPayment] Attempting to capture order:', orderId);
    const accessToken = await getAccessToken();

    // Find payment by PayPal order ID before capture (PayPal order ID stored in gatewayReference)
    const payment = await Payment.findOne({ gatewayReference: orderId });
    console.log(
      '[capturePayPalPayment] Found payment:',
      payment?._id,
      'for booking:',
      payment?.bookingId
    );

    if (!payment) {
      console.warn(
        '[capturePayPalPayment] Payment not found for orderId:',
        orderId
      );
      console.warn(
        '[capturePayPalPayment] Searching all payments with gatewayReference...'
      );
      const allPayments = await Payment.find().lean();
      console.warn(
        '[capturePayPalPayment] Total payments in DB:',
        allPayments.length
      );
      allPayments.forEach((p) => {
        console.warn(
          `  - Payment ${p._id}: gatewayReference=${p.gatewayReference}`
        );
      });
    }

    const response = await fetch(
      `${getPayPalApiUrl()}/v2/checkout/orders/${orderId}/capture`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('[capturePayPalPayment] Capture failed:', data);
      console.error(
        '[capturePayPalPayment] Full PayPal error response:',
        JSON.stringify(data, null, 2)
      );
      throw new Error(`PayPal capture error: ${JSON.stringify(data)}`);
    }

    console.log(
      '[capturePayPalPayment] Capture successful. Status:',
      data.status
    );
    console.log('[capturePayPalPayment] Full response:', JSON.stringify(data));

    // Update payment status in database using the payment we found
    if (payment) {
      payment.status = 'completed';
      payment.gatewayReference = data.id;
      payment.paymentDetails = {
        status: data.status,
        paypalEmail: data.payer?.email_address,
        captureTime: new Date(),
      };
      await payment.save();
      console.log('[capturePayPalPayment] Payment updated:', payment._id);
    }

    return {
      success: true,
      orderId: data.id,
      status: data.status,
      paymentId: payment?._id?.toString(),
      bookingId: payment?.bookingId?.toString(),
      purchaseUnits: data.purchase_units,
      ...data,
    };
  } catch (error) {
    logger.error('[capturePayPalPayment] Error:', error.message);
    logger.error('[capturePayPalPayment] Stack:', error.stack);
    throw error;
  }
};
