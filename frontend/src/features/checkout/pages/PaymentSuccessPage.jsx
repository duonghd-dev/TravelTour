import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Home } from 'lucide-react';
import styles from './PaymentSuccessPage.module.scss';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingId, booking } = location.state || {};

  useEffect(() => {
    // Auto-redirect to dashboard after 5 seconds
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <CheckCircle size={80} className={styles.icon} />
        </div>

        <h1 className={styles.statusPayment}>Thanh Toán Thành Công!</h1>
        <p className={styles.subtitle}>Booking của bạn đã được xác nhận</p>

        {bookingId && (
          <div className={styles.confirmationId}>
            <p>ID Booking:</p>
            <code>{bookingId}</code>
          </div>
        )}

        {booking && (
          <div className={styles.details}>
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
            <div className={styles.priceRow}>
              <span>Tổng tiền:</span>
              <span>${(booking.totalPrice || 0).toFixed(2)}</span>
            </div>
          </div>
        )}

        <div className={styles.actions}>
          <button
            onClick={() => navigate('/my-bookings')}
            className={styles.primaryBtn}
          >
            Xem Booking Của Tôi
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className={styles.secondaryBtn}
          >
            <Home size={18} />
            Quay Về Trang Chủ
          </button>
        </div>

        <p className={styles.autoRedirect}>
          Trang sẽ tự động chuyển hướng sau 5 giây...
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
