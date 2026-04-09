import crypto from 'crypto';
import querystring from 'querystring';
import logger from '../../common/utils/logger.js';
import { encrypt as encryptData } from '../../common/utils/encryption.js';
import Payment from './payment.model.js';
import Booking from '../booking/booking.model.js';




const VNPAY_CONFIG = {
  vnp_TmnCode: process.env.VNP_TMN_CODE,
  vnp_HashSecret: process.env.VNP_HASH_SECRET,
  vnp_Url: 'https://vnpayment.vn',
  vnp_ReturnUrl:
    process.env.VNP_RETURN_URL ||
    'http://localhost:5173/checkout/payment-result',
};


const validateVNPayConfig = () => {
  if (!VNPAY_CONFIG.vnp_TmnCode || !VNPAY_CONFIG.vnp_HashSecret) {
    const error =
      'VNPay credentials not configured! Set VNP_TMN_CODE and VNP_HASH_SECRET in .env';
    logger.error('❌ ' + error);
    throw new Error(error);
  }
  logger.info('✅ VNPay credentials configured successfully');
};


validateVNPayConfig();


export const createVNPayPayment = async (paymentData) => {
  try {
    const { bookingId, amount, ipAddress, returnUrl } = paymentData;

    
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    
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

    
    const vnp_Params = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: VNPAY_CONFIG.vnp_TmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: payment._id.toString(), 
      vnp_OrderInfo: `Booking_${bookingId}_User_${booking.userId}`,
      vnp_OrderType: 'billpayment',
      vnp_Amount: Math.round(amount * 100), 
      vnp_ReturnUrl: returnUrl || VNPAY_CONFIG.vnp_ReturnUrl,
      vnp_IpAddr: ipAddress || '127.0.0.1',
      vnp_CreateDate: formatDate(new Date()),
      vnp_ExpireDate: formatDate(addMinutes(new Date(), 15)), 
    };

    
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
      `VNPay payment created: ${payment._id} for booking: ${bookingId}, amount: ${amount}`
    );

    const responseData = {
      success: true,
      message: 'VNPay payment URL created',
      paymentUrl: paymentUrl,
      paymentId: payment._id,
      amount: amount,
    };

    return responseData;
  } catch (error) {
    logger.error('[createVNPayPayment] Error:', error.message);
    throw error;
  }
};


export const verifyVNPayPayment = async (queryParams) => {
  try {
    const {
      vnp_Amount,
      vnp_BankCode,
      vnp_BankTranNo,
      vnp_CardType,
      vnp_CurrCode,
      vnp_OrderInfo,
      vnp_PayDate,
      vnp_ResponseCode,
      vnp_SecureHash,
      vnp_TmnCode,
      vnp_TransactionNo,
      vnp_TxnRef,
    } = queryParams;

    
    if (vnp_TmnCode !== VNPAY_CONFIG.vnp_TmnCode) {
      logger.warn('[verifyVNPayPayment] TMN Code mismatch');
      return {
        success: false,
        message: 'Invalid merchant code',
      };
    }

    
    if (vnp_CurrCode !== 'VND') {
      logger.warn('[verifyVNPayPayment] Invalid currency code');
      return {
        success: false,
        message: 'Invalid currency',
      };
    }

    
    const signData = Object.keys(queryParams)
      .filter((key) => key !== 'vnp_SecureHash' && key !== 'vnp_SecureHashType')
      .sort()
      .map((key) => `${key}=${queryParams[key]}`)
      .join('&');

    const hmac = crypto
      .createHmac('sha512', VNPAY_CONFIG.vnp_HashSecret)
      .update(Buffer.from(signData, 'utf-8'))
      .digest('hex');

    if (hmac !== vnp_SecureHash) {
      logger.warn(
        '[verifyVNPayPayment] Invalid secure hash - possible tampering'
      );
      return {
        success: false,
        message: 'Invalid signature',
      };
    }

    
    if (vnp_ResponseCode !== '00') {
      logger.info(
        `[verifyVNPayPayment] Payment failed with code: ${vnp_ResponseCode}`
      );
      return {
        success: false,
        message: getVNPayResponseMessage(vnp_ResponseCode),
        responseCode: vnp_ResponseCode,
      };
    }

    
    const payment = await Payment.findById(vnp_TxnRef);
    if (!payment) {
      logger.error(
        '[verifyVNPayPayment] Payment record not found:',
        vnp_TxnRef
      );
      return {
        success: false,
        message: 'Payment record not found',
      };
    }

    
    if (payment.status === 'completed') {
      logger.info(
        `[verifyVNPayPayment] Payment already confirmed: ${payment._id}`
      );
      return {
        success: true,
        message: 'Payment already confirmed',
        transactionId: payment.transactionId,
        amount: payment.amount,
        paymentId: payment._id,
      };
    }

    
    const expectedAmount = Math.round(payment.amount * 100); 

    if (parseInt(vnp_Amount) !== expectedAmount) {
      logger.error(
        `[verifyVNPayPayment] Amount mismatch for payment ${vnp_TxnRef}: expected ${expectedAmount}, got ${vnp_Amount}`
      );

      
      payment.status = 'failed';
      payment.failureReason = 'Amount mismatch';
      await payment.save();

      return {
        success: false,
        message: 'Payment amount mismatch',
      };
    }

    
    if (!vnp_TransactionNo && !vnp_BankTranNo) {
      logger.warn('[verifyVNPayPayment] No transaction number from VNPay');
      return {
        success: false,
        message: 'Invalid transaction data',
      };
    }

    
    let encryptedPaymentDetails = null;
    let isEncrypted = false;

    try {
      const paymentDetails = {
        bankCode: vnp_BankCode || '',
        cardType: vnp_CardType || '',
        responseCode: vnp_ResponseCode,
        transactionDate: vnp_PayDate,
      };

      
      Object.keys(paymentDetails).forEach((key) => {
        if (!paymentDetails[key]) delete paymentDetails[key];
      });

      if (Object.keys(paymentDetails).length > 0) {
        encryptedPaymentDetails = encryptData(JSON.stringify(paymentDetails));
        isEncrypted = true;
      }
    } catch (encryptError) {
      logger.error('Failed to encrypt payment details:', encryptError.message);
      
      isEncrypted = false;
    }

    
    payment.status = 'completed';
    payment.transactionId = vnp_TransactionNo || vnp_BankTranNo;
    payment.completedAt = new Date();
    payment.paymentDetails = encryptedPaymentDetails;
    payment.isEncrypted = isEncrypted;

    await payment.save();

    
    const booking = await Booking.findById(payment.bookingId);
    if (booking) {
      booking.paymentStatus = 'completed';
      booking.isPaid = true;
      booking.status = 'confirmed';
      await booking.save();
    }

    logger.info(
      `✅ VNPay payment verified: ${payment._id}, Transaction: ${vnp_TransactionNo || vnp_BankTranNo}`
    );

    return {
      success: true,
      message: 'Payment verified successfully',
      transactionId: vnp_TransactionNo || vnp_BankTranNo,
      amount: Math.round(parseInt(vnp_Amount) / 100),
      paymentId: payment._id,
    };
  } catch (error) {
    logger.error('[verifyVNPayPayment] Error:', error.message);
    throw error;
  }
};


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


export const refundVNPayPayment = async (paymentId, refundData) => {
  try {
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }

    if (payment.status !== 'completed') {
      throw new Error('Only completed payments can be refunded');
    }

    if (!payment.transactionId) {
      throw new Error('No transaction ID for refund');
    }

    
    
    

    logger.info(
      `[RefundRequest] Payment ${paymentId}, Amount: ${refundData.amount || payment.amount}, Reason: ${refundData.reason || 'Not specified'}`
    );

    
    
    
    
    
    
    
    

    payment.status = 'refunded';
    payment.failureReason = refundData.reason || 'Customer requested refund';
    await payment.save();

    
    const booking = await Booking.findById(payment.bookingId);
    if (booking) {
      booking.status = 'cancelled';
      booking.paymentStatus = 'refunded';
      booking.isPaid = false;
      await booking.save();
    }

    logger.info(
      `✅ VNPay payment refund processed: ${paymentId}, Amount: ${refundData.amount || payment.amount}`
    );

    return {
      success: true,
      message: 'Refund request submitted successfully',
      paymentId: paymentId,
      refundAmount: refundData.amount || payment.amount,
    };
  } catch (error) {
    logger.error('[refundVNPayPayment] Error:', error.message);
    throw error;
  }
};


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


function formatDate(date) {
  return date
    .toISOString()
    .replace(/[^0-9]/g, '')
    .slice(0, 14);
}


function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

export default {
  createVNPayPayment,
  verifyVNPayPayment,
  cancelVNPayPayment,
  refundVNPayPayment,
};
