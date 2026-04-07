import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, AlertCircle } from 'lucide-react';
import {
  verifyVNPayPayment,
  capturePayPalPayment,
  confirmPayment,
} from '../../booking/api/paymentService';
import LoadingSpinner from '../../../shared/components/common/LoadingSpinner';
import styles from './PaymentResultPage.module.scss';

const PaymentResultPage = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('processing'); // 'processing', 'success', 'failed'
  const [message, setMessage] = useState('Đang xử lý thanh toán...');
  const [bookingId, setBookingId] = useState(null);
  const processedRef = useRef(false);

  useEffect(() => {
    // Tránh xử lý payment 2 lần
    if (processedRef.current) return;
    processedRef.current = true;

    const processPayment = async () => {
      try {
        // Check if coming from VNPay callback
        if (searchParams.has('vnp_TxnRef')) {
          const vnpayParams = Object.fromEntries(searchParams);

          if (vnpayParams.vnp_ResponseCode === '00') {
            // VNPay payment success
            const verifyResult = await verifyVNPayPayment(vnpayParams);

            if (verifyResult.success) {
              // Confirm payment in database
              const bookId = vnpayParams.vnp_OrderInfo?.split('_')[1] || '';
              await confirmPayment(bookId, {
                paymentMethod: 'vnpay',
                transactionId: vnpayParams.vnp_TxnRef,
                amount: parseInt(vnpayParams.vnp_Amount) / 100,
                timestamp: vnpayParams.vnp_PayDate,
              });

              setStatus('success');
              setMessage('Thanh toán thành công!');
              setBookingId(bookId);
            } else {
              setStatus('failed');
              setMessage('Xác minh thanh toán VNPay thất bại');
            }
          } else {
            setStatus('failed');
            setMessage(
              vnpayParams.vnp_ResponseCode === '24'
                ? 'Giao dịch bị hủy'
                : 'Thanh toán VNPay thất bại'
            );
          }
        }
        // Check if coming from PayPal callback
        else if (searchParams.has('token')) {
          const paypalToken = searchParams.get('token');
          const paypalPayerId = searchParams.get('PayerID');

          console.log('[PaymentResult] PayPal token:', paypalToken);

          // Capture PayPal payment
          console.log(
            '[PaymentResult] Attempting to capture PayPal token:',
            paypalToken
          );
          const captureResult = await capturePayPalPayment(paypalToken);

          console.log('[PaymentResult] PayPal capture result:', captureResult);
          console.log(
            '[PaymentResult] Capture result keys:',
            Object.keys(captureResult || {})
          );

          if (
            captureResult.status === 'COMPLETED' ||
            captureResult.success === true
          ) {
            // Extract booking ID from response or purchase unit
            const bookId =
              captureResult.bookingId ||
              captureResult.purchase_units?.[0]?.reference_id ||
              location.state?.bookingId;

            console.log('[PaymentResult] Extracted bookingId:', bookId);

            if (bookId) {
              // Confirm payment in database
              const purchaseUnit = captureResult.purchase_units?.[0];
              await confirmPayment(bookId, {
                paymentMethod: 'paypal',
                transactionId: captureResult.id || captureResult.orderId,
                payerId: paypalPayerId,
                amount: parseFloat(
                  purchaseUnit?.amount?.value || captureResult.amount || 0
                ),
                payerEmail:
                  captureResult.payer?.email_address ||
                  captureResult.paypalEmail,
                timestamp: new Date().toISOString(),
              });

              setStatus('success');
              setMessage('Thanh toán PayPal thành công!');
              setBookingId(bookId);
            } else {
              throw new Error('Không tìm thấy mã đơn hàng');
            }
          } else {
            setStatus('failed');
            setMessage(
              `Thanh toán PayPal thất bại: ${captureResult.message || captureResult.status}`
            );
          }
        }
        // Check if direct redirect from checkout (pay on delivery)
        else if (location.state?.bookingId) {
          // Mark booking as confirmed for pay on delivery
          await confirmPayment(location.state.bookingId, {
            paymentMethod: 'cash',
            status: 'pending_payment',
            timestamp: new Date().toISOString(),
          });

          setStatus('success');
          setMessage(
            'Đã tạo đơn đặt hàng thành công! Vui lòng thanh toán khi nhận dịch vụ.'
          );
          setBookingId(location.state.bookingId);
        }
        // No payment data found
        else {
          setStatus('failed');
          setMessage('Không tìm thấy thông tin thanh toán');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setStatus('failed');
        setMessage(error.message || 'Xảy ra lỗi khi xử lý thanh toán');
      } finally {
        setLoading(false);
      }
    };

    processPayment();
  }, [searchParams, location.state]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <LoadingSpinner />
          <p className={styles.subtitle}>Đang xử lý thanh toán...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${styles[`container-${status}`]}`}>
      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          {status === 'success' && (
            <CheckCircle size={80} className={styles.icon} />
          )}
          {status === 'failed' && (
            <AlertCircle size={80} className={styles.icon} />
          )}
        </div>

        <h1 className={styles[`status-${status}`]}>
          {status === 'success'
            ? 'Thanh toán thành công'
            : 'Thanh toán thất bại'}
        </h1>

        <p className={styles.subtitle}>{message}</p>

        {status === 'success' && bookingId && (
          <div className={styles.confirmationId}>
            <p>Mã đơn đặt</p>
            <code>{bookingId}</code>
            <p className={styles.hint}>
              Mã này sẽ được gửi tới email của bạn. Vui lòng kiểm tra email để
              xem chi tiết đơn hàng.
            </p>
          </div>
        )}

        <div className={styles.actions}>
          <button
            className={styles.primaryBtn}
            onClick={() => {
              if (status === 'success' && bookingId) {
                navigate(`/profile/bookings`);
              } else if (status === 'failed') {
                navigate('/checkout');
              } else {
                navigate('/');
              }
            }}
          >
            {status === 'success'
              ? 'Xem chi tiết đơn hàng'
              : 'Quay lại thanh toán'}
          </button>

          <button className={styles.secondaryBtn} onClick={() => navigate('/')}>
            Quay về trang chủ
          </button>
        </div>

        {status === 'failed' && (
          <p className={styles.helpText}>
            Bạn có thể kiểm tra lại thông tin hoặc liên hệ hỗ trợ khách hàng.
          </p>
        )}
      </div>
    </div>
  );
};

export default PaymentResultPage;
