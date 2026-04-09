import crypto from 'crypto';
import fetch from 'node-fetch';
import logger from '../../common/utils/logger.js';
import { decryptObject, decrypt } from '../../common/utils/encryption.js';
import Payment from './payment.model.js';
import Booking from '../booking/booking.model.js';
import BillingInfo from '../booking/billingInfo.model.js';

const PAYPAL_CONFIG = {
  mode: process.env.PAYPAL_MODE || 'sandbox',
  clientId: process.env.PAYPAL_CLIENT_ID || 'YOUR_PAYPAL_CLIENT_ID',
  clientSecret: process.env.PAYPAL_CLIENT_SECRET || 'YOUR_PAYPAL_CLIENT_SECRET',
  returnUrl:
    process.env.PAYPAL_RETURN_URL ||
    'http://localhost:5173/checkout/payment-result',
  cancelUrl: process.env.PAYPAL_CANCEL_URL || 'http://localhost:5173/checkout',
};

const getPayPalApiUrl = () => {
  return PAYPAL_CONFIG.mode === 'sandbox'
    ? 'https://api.sandbox.paypal.com'
    : 'https://api.paypal.com';
};

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

    let response;
    try {
      response = await Promise.race([fetchPromise, timeoutPromise]);
    } catch (raceError) {
      logger.error('[getAccessToken] Request failed:', raceError.message);
      throw new Error(`PayPal OAuth request failed: ${raceError.message}`);
    }

    let responseText;
    try {
      responseText = await response.text();
    } catch (textError) {
      logger.error(
        '[getAccessToken] Failed to read response:',
        textError.message
      );
      throw new Error('Failed to read PayPal OAuth response');
    }

    console.log('[PayPal OAuth] Response status:', response.status);
    console.log('[PayPal OAuth] Response text:', responseText);

    if (!response.ok) {
      logger.error('[getAccessToken] OAuth failed:', {
        status: response.status,
        body: responseText,
      });
      throw new Error(
        `PayPal OAuth failed: ${response.status} - ${responseText}`
      );
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      logger.error(
        '[getAccessToken] Failed to parse response:',
        parseError.message
      );
      throw new Error('Failed to parse PayPal OAuth response');
    }

    if (!data.access_token) {
      logger.error('[getAccessToken] No access token in response:', data);
      throw new Error('PayPal OAuth did not return access token');
    }

    return data.access_token;
  } catch (error) {
    logger.error('[getAccessToken] Error:', error.message);
    logger.error('[getAccessToken] Stack:', error.stack);
    throw error;
  }
};

export const createPayPalPayment = async (paymentData) => {
  try {
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

    const booking = await Booking.findById(bookingId).populate('billingInfoId');
    if (!booking) {
      throw new Error('Booking not found');
    }

    console.log('[createPayPalPayment] Found booking:');
    console.log('  - userId:', booking.userId);
    console.log('  - totalPrice:', booking.totalPrice);

    let billingInfo = null;

    // Check if billingInfoId is populated from BillingInfo collection
    if (booking.billingInfoId && booking.billingInfoId.encryptedData) {
      try {
        console.log(
          '[createPayPalPayment] Decrypting billing info from BillingInfo collection...'
        );
        const encryptedObj = booking.billingInfoId;
        const decryptedStr = decrypt({
          encryptedData: encryptedObj.encryptedData,
          iv: encryptedObj.iv,
          authTag: encryptedObj.authTag,
        });
        billingInfo = JSON.parse(decryptedStr);
        console.log(
          '[createPayPalPayment] Billing info decrypted successfully'
        );
      } catch (decryptError) {
        logger.error('[createPayPalPayment] Decryption failed:', {
          message: decryptError.message,
        });
        throw new Error(
          `Failed to decrypt billing information: ${decryptError.message}`
        );
      }
    } else if (booking.billingInfo && booking.billingInfo.encryptedData) {
      // Fallback for old schema during migration
      try {
        console.log(
          '[createPayPalPayment] Using legacy billing info (embedded in booking)...'
        );
        billingInfo = decryptObject(booking.billingInfo);
      } catch (decryptError) {
        logger.error('[createPayPalPayment] Legacy decryption failed:', {
          message: decryptError.message,
        });
        throw new Error(
          `Failed to decrypt legacy billing information: ${decryptError.message}`
        );
      }
    }

    if (!billingInfo || !billingInfo.email || !billingInfo.fullName) {
      console.error('[createPayPalPayment] Invalid billing info:', billingInfo);
      throw new Error(
        'Booking missing complete billing information (email and fullName required)'
      );
    }

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

    const accessToken = await getAccessToken();

    const amountInUsd = (amount / 24500).toFixed(2);
    console.log(
      '[createPayPalPayment] Amount conversion: ',
      amount,
      'VND =',
      amountInUsd,
      'USD'
    );

    if (parseFloat(amountInUsd) <= 0) {
      throw new Error(
        `Invalid converted amount: ${amountInUsd} USD from ${amount} VND`
      );
    }

    const paypalOrder = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: payment._id.toString(),
          description: `Booking_${bookingId}_User_${booking.userId}`,
          amount: {
            currency_code: 'USD',

            value: amountInUsd,
          },
        },
      ],
      payer: {
        email_address: billingInfo?.email || 'customer@example.com',
        name: {
          given_name: billingInfo?.fullName?.split(' ')[0] || 'Customer',
          surname:
            billingInfo?.fullName?.split(' ').slice(1).join(' ') || 'Traveler',
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

    let response;
    try {
      response = await fetch(`${getPayPalApiUrl()}/v2/checkout/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(paypalOrder),
        timeout: 10000,
      });
    } catch (fetchError) {
      logger.error('[createPayPalPayment] Fetch error:', {
        message: fetchError.message,
        code: fetchError.code,
      });
      throw new Error(
        `Network error calling PayPal API: ${fetchError.message}`
      );
    }

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { error: response.statusText };
      }
      logger.error('[createPayPalPayment] PayPal API returned error:', {
        status: response.status,
        error: errorData,
      });
      throw new Error(
        `PayPal API error (${response.status}): ${JSON.stringify(errorData)}`
      );
    }

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      logger.error('[createPayPalPayment] Failed to parse PayPal response:', {
        message: parseError.message,
      });
      throw new Error('Failed to parse PayPal API response');
    }

    const approvalUrl = data.links.find((link) => link.rel === 'approve')?.href;

    if (!approvalUrl) {
      throw new Error('PayPal approval URL not found in response');
    }

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
      paymentUrl: approvalUrl,
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

export const capturePayPalPayment = async (orderId) => {
  try {
    console.log('[capturePayPalPayment] Attempting to capture order:', orderId);
    const accessToken = await getAccessToken();

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
