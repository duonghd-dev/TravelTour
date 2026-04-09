import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/contexts';
import { getUserBookings, cancelBooking } from '../api/bookingService';
import styles from './MyBookingsPage.module.scss';

const MyBookingsPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadBookings();
  }, [isAuthenticated, navigate]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getUserBookings();

      let bookingsData = [];
      if (Array.isArray(response)) {
        bookingsData = response;
      } else if (response.success && Array.isArray(response.data)) {
        bookingsData = response.data;
      }

      if (bookingsData && bookingsData.length >= 0) {
        setBookings(bookingsData);
        filterBookings(bookingsData, 'all');
      } else {
        setError('Không thể tải danh sách bookings');
      }
    } catch (err) {
      console.error('[MyBookingsPage] Error loading bookings:', err);

      if (err.status === 403) {
        console.warn('[MyBookingsPage] Token invalid, redirecting to login');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.error(
          'Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại.'
        );
        navigate('/login');
        return;
      }

      if (err.status === 401) {
        console.warn(
          '[MyBookingsPage] Not authenticated, redirecting to login'
        );
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.error('Vui lòng đăng nhập để xem danh sách booking');
        navigate('/login');
        return;
      }

      const errorMessage = err.message || 'Lỗi khi tải danh sách bookings';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = (bookingsList, filter) => {
    setActiveFilter(filter);

    if (filter === 'all') {
      setFilteredBookings(bookingsList);
    } else {
      const filtered = bookingsList.filter(
        (booking) => booking.status === filter
      );
      setFilteredBookings(filtered);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy booking này?')) {
      return;
    }

    try {
      setCancellingId(bookingId);
      const response = await cancelBooking(bookingId);

      if (response.success) {
        toast.success('Hủy booking thành công');

        const updatedBookings = bookings.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: 'cancelled' }
            : booking
        );
        setBookings(updatedBookings);
        filterBookings(updatedBookings, activeFilter);
      } else {
        toast.error(response.message || 'Không thể hủy booking');
      }
    } catch (err) {
      toast.error(err.message || 'Lỗi khi hủy booking');
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return styles.statusPending;
      case 'confirmed':
        return styles.statusConfirmed;
      case 'cancelled':
        return styles.statusCancelled;
      case 'completed':
        return styles.statusCompleted;
      default:
        return '';
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
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Đang tải danh sách bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Các Đơn Đặt Của Tôi</h1>
        <p className={styles.subtitle}>
          {filteredBookings.length} đơn đặt{' '}
          {activeFilter !== 'all' && `(${getStatusLabel(activeFilter)})`}
        </p>
      </div>

      {error && (
        <div className={styles.errorMessage}>
          <p>{error}</p>
          <button onClick={loadBookings} className={styles.retryBtn}>
            Thử lại
          </button>
        </div>
      )}

      {}
      <div className={styles.filterTabs}>
        <button
          className={`${styles.filterTab} ${activeFilter === 'all' ? styles.active : ''}`}
          onClick={() => filterBookings(bookings, 'all')}
        >
          Tất cả
        </button>
        <button
          className={`${styles.filterTab} ${activeFilter === 'pending' ? styles.active : ''}`}
          onClick={() => filterBookings(bookings, 'pending')}
        >
          Chờ xác nhận
        </button>
        <button
          className={`${styles.filterTab} ${activeFilter === 'confirmed' ? styles.active : ''}`}
          onClick={() => filterBookings(bookings, 'confirmed')}
        >
          Đã xác nhận
        </button>
        <button
          className={`${styles.filterTab} ${activeFilter === 'completed' ? styles.active : ''}`}
          onClick={() => filterBookings(bookings, 'completed')}
        >
          Hoàn thành
        </button>
        <button
          className={`${styles.filterTab} ${activeFilter === 'cancelled' ? styles.active : ''}`}
          onClick={() => filterBookings(bookings, 'cancelled')}
        >
          Đã hủy
        </button>
      </div>

      {}
      {filteredBookings.length === 0 ? (
        <div className={styles.emptyState}>
          <FontAwesomeIcon icon={faCalendarDays} className={styles.emptyIcon} />
          <h3>Chưa có đơn đặt nào</h3>
          <p>Hãy khám phá và đặt các trải nghiệm tuyệt vời ngay hôm nay!</p>
          <button
            className={styles.exploreBtn}
            onClick={() => navigate('/experiences')}
          >
            Khám phá trải nghiệm
          </button>
        </div>
      ) : (
        <div className={styles.bookingsList}>
          {filteredBookings.map((booking) => (
            <div
              key={booking._id}
              className={`${styles.bookingCard} ${styles[`status${(booking.status || 'pending').charAt(0).toUpperCase() + (booking.status || 'pending').slice(1)}`]}`}
            >
              {}
              <div className={styles.cardHeader}>
                <div className={styles.titleSection}>
                  <h3 className={styles.itemTitle}>Đơn đặt</h3>
                  <div className={styles.bookingId}>
                    #{booking._id.slice(-8).toUpperCase()}
                  </div>
                  <span
                    className={`${styles.statusBadge} ${getStatusBadgeClass(booking.status)}`}
                  >
                    {getStatusLabel(booking.status)}
                  </span>
                </div>
              </div>

              {}
              <div className={styles.cardContent}>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <div className={styles.content}>
                      <span className={styles.label}>Ngày đặt</span>
                      <span className={styles.value}>
                        {formatDate(booking.bookingDate)}
                      </span>
                    </div>
                  </div>

                  <div className={styles.infoItem}>
                    <div className={styles.content}>
                      <span className={styles.label}>Số khách</span>
                      <span className={styles.value}>
                        {booking.guestsCount} người
                      </span>
                    </div>
                  </div>

                  <div className={styles.infoItem}>
                    <div className={styles.content}>
                      <span className={styles.label}>Thành toán</span>
                      <span className={styles.value}>
                        {booking.paymentMethod === 'credit_card'
                          ? 'Thẻ tín dụng'
                          : booking.paymentMethod === 'bank_transfer'
                            ? 'Chuyển khoản'
                            : booking.paymentMethod === 'cash'
                              ? 'Tiền mặt'
                              : booking.paymentMethod === 'vnpay'
                                ? 'VNPay'
                                : booking.paymentMethod === 'paypal'
                                  ? 'PayPal'
                                  : booking.paymentMethod}
                      </span>
                    </div>
                  </div>

                  <div className={styles.infoItem}>
                    <div className={styles.content}>
                      <span className={styles.label}>
                        Trạng thái thanh toán
                      </span>
                      <span
                        className={`${styles.value} ${styles[`paymentStatus${(booking.paymentStatus || 'pending').charAt(0).toUpperCase() + (booking.paymentStatus || 'pending').slice(1)}`]}`}
                      >
                        {booking.paymentStatus === 'completed'
                          ? 'Đã thanh toán'
                          : booking.paymentStatus === 'pending'
                            ? 'Chờ thanh toán'
                            : booking.paymentStatus === 'failed'
                              ? 'Thất bại'
                              : booking.paymentStatus || 'Chờ thanh toán'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {}
              <div className={styles.cardFooter}>
                <div className={styles.priceSection}>
                  <div className={styles.priceLabel}>Tổng cộng</div>
                  <div className={styles.priceValue}>
                    {formatCurrency(booking.totalPrice)}
                  </div>
                </div>

                <div className={styles.actionButtons}>
                  <button
                    className={styles.viewBtn}
                    onClick={() =>
                      navigate(`/profile/booking/${booking._id}`, {
                        state: { booking },
                      })
                    }
                  >
                    Chi tiết
                  </button>

                  {booking.status === 'pending' && (
                    <button
                      className={styles.cancelBtn}
                      onClick={() => handleCancelBooking(booking._id)}
                      disabled={cancellingId === booking._id}
                    >
                      {cancellingId === booking._id ? '...' : 'Hủy'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
