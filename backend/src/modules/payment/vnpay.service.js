import crypto from 'crypto';
import querystring from 'querystring';
import logger from '../../common/utils/logger.js';
import Payment from './payment.model.js';
import Booking from '../booking/booking.model.js';

/**
 * VNPay Payment Service
 * Handles VNPay payment gateway integration
 */

// VNPay Configuration (should be from environment variables)
const VNPAY_CONFIG = {
  vnp_TmnCode: process.env.VNP_TMN_CODE || 'HMSJ5PHJ', // Sandbox TMN code
  vnp_HashSecret:
    process.env.VNP_HASH_SECRET || 'AIK9R58Z6N3YPFP78XT672FYMN7E6L0G', // Sandbox hash secret
  vnp_Url: 'https://vnpayment.vn',
  vnp_ReturnUrl:
    process.env.VNP_RETURN_URL ||
    'http://localhost:5173/checkout/payment-result',
};

/**
 * Create VNPay payment URL
 * @param {Object} paymentData - Payment data {bookingId, amount, ipAddress, returnUrl}
 * @returns {Promise<Object>} VNPay payment URL and transaction info
 */
export const createVNPayPayment = async (paymentData) => {
  try {
    const { bookingId, amount, ipAddress, returnUrl } = paymentData;

    // Validate booking exists
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    // Create/update payment record
    let payment = await Payment.findOne({
      bookingId,
      paymentMethod: 'vnpay',
    });

    if (!payment) {
      payment = await Payment.create({
        bookingId,
        userId: booking.userId,
        amount: amount,
        paymentMethod: 'vnpay',
        paymentGateway: 'vnpay',
        transactionId: `VNP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        status: 'pending',
      });
    } else {
      payment.amount = amount;
      payment.status = 'pending';
      await payment.save();
    }

    // Build VNPay parameters
    const vnp_Params = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: VNPAY_CONFIG.vnp_TmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: payment._id.toString(), // Use payment ID as transaction reference
      vnp_OrderInfo: `Booking_${bookingId}_User_${booking.userId}`,
      vnp_OrderType: 'billpayment',
      vnp_Amount: Math.round(amount * 100), // VNPay expects amount in smallest unit
      vnp_ReturnUrl: returnUrl || VNPAY_CONFIG.vnp_ReturnUrl,
      vnp_IpAddr: ipAddress || '127.0.0.1',
      vnp_CreateDate: formatDate(new Date()),
      vnp_ExpireDate: formatDate(addMinutes(new Date(), 15)), // 15 minutes expiry
    };

    // Sort parameters and create signed URL
    const sortedParams = Object.keys(vnp_Params)
      .sort()
      .reduce((result, key) => {
        if (vnp_Params[key] !== '' && vnp_Params[key] != null) {
          result[key] = vnp_Params[key];
        }
        return result;
      }, {});

    const signData = querystring.stringify(sortedParams);
    const hmac = crypto
      .createHmac('sha512', VNPAY_CONFIG.vnp_HashSecret)
      .update(Buffer.from(signData, 'utf-8'))
      .digest('hex');

    const paymentUrl = `${VNPAY_CONFIG.vnp_Url}?${signData}&vnp_SecureHash=${hmac}`;

    logger.info(
      `VNPay payment created: ${payment._id} for booking: ${bookingId}`
    );

    const responseData = {
      success: true,
      message: 'VNPay payment URL created',
      paymentUrl: paymentUrl,
      paymentId: payment._id,
      amount: amount,
    };

    logger.info('[VNPay Response]:', JSON.stringify(responseData));

    return responseData;
  } catch (error) {
    logger.error('[createVNPayPayment] Error:', error.message);
    throw error;
  }
};

/**
 * Verify VNPay payment callback
 * @param {Object} queryParams - Query parameters from VNPay callback
 * @returns {Promise<Object>} Verification result
 */
export const verifyVNPayPayment = async (queryParams) => {
  try {
    const {
      vnp_Amount,
      vnp_BankCode,
      vnp_BankTranNo,
      vnp_CardType,
      vnp_OrderInfo,
      vnp_PayDate,
      vnp_ResponseCode,
      vnp_SecureHash,
      vnp_TmnCode,
      vnp_TransactionNo,
      vnp_TxnRef,
    } = queryParams;

    // Verify secure hash
    const signData = Object.keys(queryParams)
      .filter((key) => key !== 'vnp_SecureHash' && key !== 'vnp_SecureHashType')
      .sort()
      .map((key) => `${key}=${queryParams[key]}`)
      .join('&');

    const hmac = crypto
      .createHmac('sha512', VNPAY_CONFIG.vnp_HashSecret)
      .update(Buffer.from(signData, 'utf-8'))
      .digest('hex');

    // If hash doesn't match, payment is invalid
    if (hmac !== vnp_SecureHash) {
      logger.warn('[verifyVNPayPayment] Invalid secure hash');
      return {
        success: false,
        message: 'Invalid secure hash',
      };
    }

    // Check response code
    if (vnp_ResponseCode !== '00') {
      logger.warn(
        `[verifyVNPayPayment] Payment failed with code: ${vnp_ResponseCode}`
      );
      return {
        success: false,
        message: getVNPayResponseMessage(vnp_ResponseCode),
        responseCode: vnp_ResponseCode,
      };
    }

    // Update payment record
    const payment = await Payment.findById(vnp_TxnRef);
    if (!payment) {
      throw new Error('Payment record not found');
    }

    payment.status = 'completed';
    payment.transactionId = vnp_TransactionNo || vnp_BankTranNo;
    payment.transactionDate = new Date();
    payment.paymentDetails = {
      bankCode: vnp_BankCode,
      cardType: vnp_CardType,
      responseCode: vnp_ResponseCode,
      transactionDate: vnp_PayDate,
    };

    await payment.save();

    // Update booking status
    const booking = await Booking.findById(payment.bookingId);
    if (booking) {
      booking.paymentStatus = 'completed';
      booking.status = 'confirmed';
      await booking.save();
    }

    logger.info(
      `VNPay payment verified: ${payment._id}, Transaction: ${vnp_TransactionNo}`
    );

    return {
      success: true,
      message: 'Payment verified successfully',
      transactionId: vnp_TransactionNo || vnp_BankTranNo,
      amount: parseInt(vnp_Amount) / 100,
      paymentId: payment._id,
    };
  } catch (error) {
    logger.error('[verifyVNPayPayment] Error:', error.message);
    throw error;
  }
};

/**
 * Cancel VNPay payment
 * @param {string} paymentId - Payment ID
 * @returns {Promise<Object>} Cancellation result
 */
export const cancelVNPayPayment = async (paymentId) => {
  try {
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }

    payment.status = 'cancelled';
    await payment.save();

    logger.info(`VNPay payment cancelled: ${paymentId}`);

    return {
      success: true,
      message: 'Payment cancelled',
      paymentId: paymentId,
    };
  } catch (error) {
    logger.error('[cancelVNPayPayment] Error:', error.message);
    throw error;
  }
};

/**
 * Refund VNPay payment
 * @param {string} paymentId - Payment ID
 * @param {Object} refundData - Refund data {reason, amount}
 * @returns {Promise<Object>} Refund result
 */
export const refundVNPayPayment = async (paymentId, refundData) => {
  try {
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }

    if (payment.status !== 'completed') {
      throw new Error('Only completed payments can be refunded');
    }

    // In real scenario, you would call VNPay refund API here
    // For now, we'll just update the status
    payment.status = 'refunded';
    payment.refundDetails = {
      reason: refundData.reason || 'Customer requested refund',
      amount: refundData.amount || payment.amount,
      refundDate: new Date(),
    };

    await payment.save();

    logger.info(`VNPay payment refunded: ${paymentId}`);

    return {
      success: true,
      message: 'Payment refunded',
      paymentId: paymentId,
    };
  } catch (error) {
    logger.error('[refundVNPayPayment] Error:', error.message);
    throw error;
  }
};

/**
 * Get VNPay response message
 * @param {string} responseCode - VNPay response code
 * @returns {string} Message description
 */
function getVNPayResponseMessage(responseCode) {
  const messages = {
    '00': 'Giao dịch thành công',
    '01': 'Gọi API khởi tạo giao dịch không thành công do các tham số gửi không đúng định dạng',
    '02': 'Merchant không được phép thực hiện loại giao dịch này',
    '03': 'Session của API client được sử dụng không còn hiệu lực',
    '04': 'Đã hết hạn để gửi yêu cầu thanh toán. Xin vui lòng redo từ đầu',
    '05': 'Không tìm thấy khách hàng trong hệ thống',
    '06': 'Không hỗ trợ loại tiền tệ',
    '07': 'Lỗi không xác định',
    '08': 'Không tìm thấy giao dịch thanh toán',
    '09': 'Sai giá trị CheckSum',
    10: 'Merchant không được phép thực hiện loại tiền tệ này',
    11: 'Giao dịch không được Khách hàng hoàn tất',
    12: 'Merchant thực hiện giao dịch với giá trị không hợp lệ',
    13: 'Sai định dạng của Merchant',
    99: 'Người dùng hủy giao dịch',
  };

  return messages[responseCode] || 'Lỗi không xác định';
}

/**
 * Format date to VNPay format (yyyyMMddHHmmss)
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 */
function formatDate(date) {
  return date
    .toISOString()
    .replace(/[^0-9]/g, '')
    .slice(0, 14);
}

/**
 * Add minutes to a date
 * @param {Date} date - Base date
 * @param {number} minutes - Minutes to add
 * @returns {Date} New date
 */
function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

export default {
  createVNPayPayment,
  verifyVNPayPayment,
  cancelVNPayPayment,
  refundVNPayPayment,
};
