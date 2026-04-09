import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb } from '@fortawesome/free-solid-svg-icons';
import {
  getBooking,
  confirmBookingPayment,
} from '@/features/booking/api/bookingService.js';
import styles from './PaymentProcessingPage.module.scss';

const PaymentProcessingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingId = location.state?.bookingId;
  const items = location.state?.items || [];
  const totalPrice = location.state?.totalPrice;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [booking, setBooking] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [simulatingPayment, setSimulatingPayment] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        if (!bookingId) {
          throw new Error('Không tìm thấy ID booking');
        }
        const response = await getBooking(bookingId);
        if (response.success) {
          setBooking(response.data);
        } else {
          throw new Error(response.message || 'Lỗi khi lấy thông tin booking');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  const handleSimulatePayment = async () => {
    setSimulatingPayment(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const response = await confirmBookingPayment(bookingId, {
        transactionId: `TXN_${Date.now()}`,
        paymentMethod: booking?.paymentMethod || 'credit_card',
      });

      if (response.success) {
        setPaymentSuccess(true);

        setTimeout(() => {
          navigate('/payment-success', {
            state: { bookingId, booking: response.data },
          });
        }, 2000);
      } else {
        throw new Error(response.message || 'Thanh toán thất bại');
      }
    } catch (err) {
      setError(err.message || 'Có lỗi khi xử lý thanh toán');
      setSimulatingPayment(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    navigate(-1);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loader}>
          <div className={styles.spinner}></div>
          <p>Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className={styles.container}>
        <div className={styles.success}>
          <CheckCircle size={64} className={styles.icon} />
          <h1>Thanh Toán Thành Công!</h1>
          <p>Đang chuyển hướng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>Xác Nhận Thanh Toán</h1>

        {error && (
          <div className={styles.errorBox}>
            <AlertCircle size={20} />
            <div className={styles.errorContent}>
              <h3>Lỗi</h3>
              <p>{error}</p>
            </div>
          </div>
        )}

        {}
        {items && items.length > 0 && (
          <div className={styles.itemsList}>
            <h3>Các sản phẩm được thanh toán:</h3>
            {items.map((item, idx) => (
              <div key={idx} className={styles.itemCard}>
                <div className={styles.itemName}>{item.itemName}</div>
                <div className={styles.itemMeta}>
                  <span>
                    Loại:{' '}
                    {item.itemType === 'experience'
                      ? 'Trải nghiệm'
                      : item.itemType === 'hotel'
                        ? 'Khách sạn'
                        : 'Tour'}
                  </span>
                  <span>{item.guestsCount} khách</span>
                  <span className={styles.itemPrice}>
                    ${(item.totalPrice || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {booking && (
          <div className={styles.details}>
            <div className={styles.section}>
              <h3>Thông tin booking</h3>
              <div className={styles.detailRow}>
                <span>ID Booking:</span>
                <span>{booking._id || booking.id}</span>
              </div>
              <div className={styles.detailRow}>
                <span>Sản phẩm:</span>
                <span>{booking.itemName || 'Experience'}</span>
              </div>
              <div className={styles.detailRow}>
                <span>Ngày:</span>
                <span>
                  {new Date(booking.bookingDate).toLocaleDateString('vi-VN')}
                </span>
              </div>
              <div className={styles.detailRow}>
                <span>Số khách:</span>
                <span>{booking.guestsCount}</span>
              </div>
            </div>

            <div className={styles.section}>
              <h3>Thông tin thanh toán</h3>
              <div className={styles.detailRow}>
                <span>Phương thức:</span>
                <span className={styles.method}>
                  {getPaymentMethodLabel(booking.paymentMethod)}
                </span>
              </div>
              <div className={styles.detailRow}>
                <span>Trạng thái:</span>
                <span className={styles.status}>
                  {getPaymentStatusLabel(booking.paymentStatus)}
                </span>
              </div>
            </div>

            <div className={styles.priceSection}>
              <div className={styles.priceRow}>
                <span>Tổng tiền:</span>
                <span className={styles.amount}>
                  ${(totalPrice || booking.totalPrice || 0).toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={handleSimulatePayment}
              disabled={simulatingPayment || error}
              className={styles.payBtn}
            >
              {simulatingPayment ? 'Đang xử lý...' : 'Thanh Toán Ngay'}
            </button>

            {error && (
              <button onClick={handleRetry} className={styles.retryBtn}>
                Thử Lại
              </button>
            )}

            <p className={styles.note}>
              <FontAwesomeIcon icon={faLightbulb} /> Cho mục đích testing, click
              "Thanh Toán Ngay" để mô phỏng thanh toán thành công
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

function getPaymentMethodLabel(method) {
  const labels = {
    credit_card: 'Thẻ tín dụng / Ghi nợ',
    bank_transfer: 'Chuyển khoản ngân hàng',
    cash: 'Thanh toán khi đến',
  };
  return labels[method] || method;
}

function getPaymentStatusLabel(status) {
  const labels = {
    pending: 'Đang chờ',
    completed: 'Hoàn tất',
    failed: 'Thất bại',
    refunded: 'Hoàn tiền',
  };
  return labels[status] || status;
}

export default PaymentProcessingPage;
