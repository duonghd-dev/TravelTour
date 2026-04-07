import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/contexts';
import { getUserBookings } from '@/features/booking/api/bookingService';
import styles from './MyBookingsSection.module.scss';

const MyBookingsSection = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const response = await getUserBookings();

      // Handle both array response and object response with success property
      let bookingsData = [];
      if (Array.isArray(response)) {
        bookingsData = response;
      } else if (response.success && Array.isArray(response.data)) {
        bookingsData = response.data;
      }

      if (bookingsData && bookingsData.length > 0) {
        setBookings(bookingsData.slice(0, 3)); // Show only first 3
      }
    } catch (err) {
      console.error('Failed to load bookings:', err);
      // Don't show error if it's an auth issue - just keep empty state
      if (err.status !== 403 && err.status !== 401) {
        toast.error('Không thể tải danh sách bookings');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending':
        return 'Chờ xác nhận';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'cancelled':
        return 'Đã hủy';
      case 'completed':
        return 'Hoàn thành';
      default:
        return status;
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  if (loading) {
    return (
      <section className={styles.section}>
        <h2>My Bookings</h2>
        <div className={styles.loadingState}>
          <p>Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2>My Bookings</h2>
        <button
          className={styles.viewAllBtn}
          onClick={() => navigate('/bookings')}
        >
          View All →
        </button>
      </div>

      {bookings.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📅</div>
          <p>No bookings yet</p>
          <button
            className={styles.createBtn}
            onClick={() => navigate('/experiences')}
          >
            Explore & Book
          </button>
        </div>
      ) : (
        <div className={styles.bookingsList}>
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className={styles.bookingItem}
              onClick={() => navigate('/bookings')}
            >
              <div className={styles.itemHeader}>
                <h3>
                  {booking.experienceId?.title ||
                    booking.tourId?.title ||
                    booking.hotelId?.title ||
                    'Booking #' + booking._id.slice(-6)}
                </h3>
                <span
                  className={`${styles.status} ${styles[`status-${booking.status}`]}`}
                >
                  {getStatusLabel(booking.status)}
                </span>
              </div>

              <div className={styles.itemDetails}>
                <span>📅 {formatDate(booking.bookingDate)}</span>
                <span>👥 {booking.guestsCount} guests</span>
                <span className={styles.price}>
                  {formatCurrency(booking.totalPrice)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className={styles.footer}>
        <button
          className={styles.allBookingsBtn}
          onClick={() => navigate('/bookings')}
        >
          View All Bookings →
        </button>
      </div>
    </section>
  );
};

export default MyBookingsSection;
