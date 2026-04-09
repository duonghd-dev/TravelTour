import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CreditCard, DollarSign, Trash2, Plus } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMapPin,
  faClock,
  faMap,
  faGraduationCap,
  faBuilding,
  faBox,
  faLightbulb,
  faStar,
  faUsers,
  faTag,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import { createBooking } from '@/features/booking/api/bookingService.js';
import {
  createVNPayPayment,
  createPayPalPayment,
} from '@/features/booking/api/paymentService.js';
import { useAuth } from '@/hooks/useAuth';
import { getExperienceDetail } from '@/services/api/experienceService.js';
import { hotelService } from '@/features/hotel/api/hotelService.js';
import { tourService } from '@/features/explore/api/tourService.js';
import { formatCurrency } from '@/utils';
import styles from './CheckoutPage.module.scss';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const initialBookingData = location.state?.bookingData;
  const addToCart = location.state?.addToCart || false;
  const currentItems = location.state?.currentItems || [];
  const [showAddMoreOptions, setShowAddMoreOptions] = useState(false);

  const [cartItems, setCartItems] = useState(() => {
    if (!initialBookingData) return [];

    // Khởi tạo ngày đặt mặc định (hôm nay)
    const today = new Date().toISOString().split('T')[0];
    // Khởi tạo ngày trả mặc định (ngày hôm sau)
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    const newItem = {
      ...initialBookingData,
      id: Date.now(),
      guestsCount: initialBookingData.guestsCount || 1,
      bookingDate: initialBookingData.bookingDate || today,
      checkoutDate:
        initialBookingData.checkoutDate ||
        (initialBookingData.itemType === 'hotel' ? tomorrow : undefined),
      totalPrice:
        initialBookingData.totalPrice ||
        (initialBookingData.price || 0) * (initialBookingData.guestsCount || 1),
    };

    if (initialBookingData.itemType === 'tour') {
      newItem.minParticipants =
        typeof initialBookingData.minParticipants === 'number' &&
        initialBookingData.minParticipants > 0
          ? initialBookingData.minParticipants
          : 1;
      newItem.maxParticipants =
        typeof initialBookingData.maxParticipants === 'number' &&
        initialBookingData.maxParticipants > 0
          ? initialBookingData.maxParticipants
          : 20;
    }

    // Tính lại giá cho hotel với booking dates
    if (
      initialBookingData.itemType === 'hotel' &&
      newItem.bookingDate &&
      newItem.checkoutDate &&
      newItem.price
    ) {
      const checkin = new Date(newItem.bookingDate);
      const checkout = new Date(newItem.checkoutDate);
      const nights = Math.max(
        1,
        Math.floor((checkout - checkin) / (1000 * 60 * 60 * 24))
      );
      newItem.totalPrice = newItem.price * nights * newItem.guestsCount;
    }

    if (addToCart && currentItems && currentItems.length > 0) {
      return [...currentItems, newItem];
    } else {
      return [newItem];
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    paymentMethod: 'cash',
  });

  const [timeSlots, setTimeSlots] = useState({});
  const [itemDetails, setItemDetails] = useState({});
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName:
          user.firstName && user.lastName
            ? `${user.firstName} ${user.lastName}`
            : prev.fullName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        address: user.address || prev.address,
      }));
    }
  }, [user]);

  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (cartItems.length === 0) return;

      setLoadingDetails(true);
      try {
        const newTimeSlots = {};
        const newItemDetails = {};
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

        for (let item of cartItems) {
          if (item.itemType === 'hotel' && item.itemId) {
            try {
              const hotelDetail = await hotelService.getHotelDetail(
                item.itemId
              );
              if (hotelDetail) {
                newItemDetails[item.itemId] = {
                  location: hotelDetail.location || 'Chưa xác định',
                  address:
                    hotelDetail.address ||
                    hotelDetail.location ||
                    'Chưa xác định',
                  category: hotelDetail.category || 'Heritage Hotel',
                  amenities: hotelDetail.amenities || [],
                  rating: hotelDetail.rating || 4.5,
                };
              }
            } catch (err) {
              console.error('Error fetching hotel detail:', err);
            }
          } else if (item.itemType === 'experience' && item.itemId) {
            const detail = await getExperienceDetail(item.itemId);

            newItemDetails[item.itemId] = {
              location: detail?.location || 'Chưa xác định',
              duration: detail?.duration
                ? `${detail.duration.value} ${
                    detail.duration.unit === 'day'
                      ? 'Ngày'
                      : detail.duration.unit === 'hour'
                        ? 'Giờ'
                        : 'Buổi'
                  }`
                : 'Chưa xác định',
            };

            if (detail && detail.timeSlots) {
              if (item.bookingDate) {
                try {
                  const availableSlotsRes = await fetch(
                    `${apiUrl}/api/v1/bookings/available-slots/${item.itemId}/${item.bookingDate}`
                  );
                  if (availableSlotsRes.ok) {
                    const slotsData = await availableSlotsRes.json();
                    newTimeSlots[item.itemId] =
                      slotsData.data || detail.timeSlots;
                  } else {
                    newTimeSlots[item.itemId] = detail.timeSlots;
                  }
                } catch (err) {
                  console.error('Error fetching available slots:', err);
                  newTimeSlots[item.itemId] = detail.timeSlots;
                }
              } else {
                const formattedSlots = (detail.timeSlots || []).map((slot) => {
                  if (typeof slot === 'string') {
                    return { time: slot, capacity: 8 };
                  }
                  return slot;
                });
                newTimeSlots[item.itemId] = formattedSlots;
              }
            }
          } else if (item.itemType === 'tour' && item.itemId) {
            try {
              const tourDetail = await tourService.getTourDetail(item.itemId);
              if (tourDetail) {
                newItemDetails[item.itemId] = {
                  location: tourDetail.location || 'Chưa xác định',
                  region: tourDetail.region || 'Chưa xác định',
                  duration: tourDetail.duration
                    ? `${tourDetail.duration.value} ${tourDetail.duration.unit}`
                    : 'Chưa xác định',
                  itinerary: tourDetail.itinerary || [],
                  highlights: tourDetail.highlights || [],
                  included: tourDetail.included || [],
                  whatToBring: tourDetail.whatToBring || [],
                  rating: tourDetail.rating || 4.5,
                  minParticipants: tourDetail.minParticipants || 1,
                  maxParticipants: tourDetail.maxParticipants || 20,
                };
              }
            } catch (err) {
              console.error('Error fetching tour detail:', err);
            }
          }
        }

        setTimeSlots(newTimeSlots);
        setItemDetails(newItemDetails);
      } catch (err) {
        console.error('Error fetching item details:', err);
      } finally {
        setLoadingDetails(false);
      }
    };

    fetchTimeSlots();
  }, [cartItems]);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item.totalPrice || 0),
    0
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemChange = (id, field, value) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };

          // Tính lại giá cho experience/tour khi guestsCount thay đổi
          if (field === 'guestsCount') {
            const numValue = parseInt(value);

            if (
              item.itemType === 'tour' &&
              item.minParticipants &&
              item.maxParticipants
            ) {
              if (numValue < item.minParticipants) {
                alert(`Tối thiểu ${item.minParticipants} khách mỗi tour`);
                return item;
              }
              if (numValue > item.maxParticipants) {
                alert(`Tối đa ${item.maxParticipants} khách mỗi tour`);
                return item;
              }
            }

            const basePrice = item.price || item.totalPrice / item.guestsCount;
            updated.totalPrice = basePrice * numValue;
          }

          // Tính lại giá cho hotel khi checkoutDate hoặc guestsCount thay đổi
          if (
            item.itemType === 'hotel' &&
            (field === 'checkoutDate' || field === 'guestsCount')
          ) {
            const bookingDate =
              field === 'checkoutDate' ? item.bookingDate : updated.bookingDate;
            const checkoutDate =
              field === 'checkoutDate' ? value : item.checkoutDate;
            const guestsCount =
              field === 'guestsCount' ? parseInt(value) : item.guestsCount;

            if (bookingDate && checkoutDate) {
              // Tính số đêm
              const checkin = new Date(bookingDate);
              const checkout = new Date(checkoutDate);
              const nights = Math.max(
                1,
                Math.floor((checkout - checkin) / (1000 * 60 * 60 * 24))
              );

              // Giá mỗi phòng/đêm
              const pricePerNight = item.price || 0;
              // Tính tổng: pricePerNight * nights * numberOfRooms
              updated.totalPrice = pricePerNight * nights * guestsCount;
            }
          }

          return updated;
        }
        return item;
      })
    );
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleRemoveItem = (id) => {
    removeItem(id);
  };

  const handleAddMore = () => {
    setShowAddMoreOptions(true);
  };

  const handleAddExperience = () => {
    setShowAddMoreOptions(false);
    navigate('/experiences', {
      state: {
        fromCheckout: true,
        currentItems: cartItems,
      },
    });
  };

  const handleAddHotel = () => {
    setShowAddMoreOptions(false);
    navigate('/hotels', {
      state: {
        fromCheckout: true,
        currentItems: cartItems,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (cartItems.length === 0) {
        throw new Error('Vui lòng thêm ít nhất một sản phẩm');
      }

      for (let item of cartItems) {
        if (!item.bookingDate) {
          throw new Error('Vui lòng chọn ngày đặt cho tất cả sản phẩm');
        }
        if (item.itemType === 'hotel' && !item.checkoutDate) {
          throw new Error('Vui lòng chọn ngày trả cho khách sạn');
        }
        if (
          item.itemType === 'hotel' &&
          item.bookingDate &&
          item.checkoutDate &&
          item.bookingDate >= item.checkoutDate
        ) {
          throw new Error('Ngày trả phải sau ngày đặt');
        }
        if (item.itemType === 'experience' && !item.timeSlot) {
          throw new Error('Vui lòng chọn khung giờ cho các trải nghiệm');
        }
        if (!item.guestsCount || item.guestsCount < 1) {
          throw new Error('Vui lòng chọn số lượng khách hợp lệ');
        }
        if (
          item.itemType === 'tour' &&
          item.minParticipants &&
          item.guestsCount < item.minParticipants
        ) {
          throw new Error(
            `Tối thiểu ${item.minParticipants} khách cho tour này`
          );
        }
        if (
          item.itemType === 'tour' &&
          item.maxParticipants &&
          item.guestsCount > item.maxParticipants
        ) {
          throw new Error(`Tối đa ${item.maxParticipants} khách cho tour này`);
        }
      }

      if (!formData.fullName || !formData.email || !formData.phone) {
        throw new Error('Vui lòng điền tất cả thông tin bắt buộc');
      }

      const mainItem = cartItems[0];
      const bookingPayload = {
        itemId: mainItem.itemId,
        itemType: mainItem.itemType,
        bookingDate: mainItem.bookingDate,
        guestsCount: mainItem.guestsCount,
        totalPrice: totalPrice,
        paymentMethod: formData.paymentMethod,
        billingInfo: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
        },
      };

      if (mainItem.itemType === 'experience' && mainItem.timeSlot) {
        bookingPayload.timeSlot = mainItem.timeSlot;
      }

      if (mainItem.itemType === 'hotel') {
        bookingPayload.checkoutDate = mainItem.checkoutDate;
      }

      const response = await createBooking(bookingPayload);

      if (response.success || response._id) {
        const bookingId = response._id || response.id;

        if (formData.paymentMethod === 'vnpay') {
          try {
            const vnpayResponse = await createVNPayPayment(
              bookingId,
              totalPrice
            );
            if (vnpayResponse && vnpayResponse.paymentUrl) {
              window.location.href = vnpayResponse.paymentUrl;
            } else {
              throw new Error('VNPay payment URL not received');
            }
          } catch (paymentError) {
            console.warn(
              'VNPay payment failed, falling back to cash payment:',
              paymentError
            );
            // Fallback to cash payment if VNPay is unavailable
            navigate('/payment-success', {
              state: {
                bookingId: bookingId,
                items: cartItems,
                totalPrice: totalPrice,
                paymentMethod: 'cash',
                fallbackMessage:
                  'Phương thức VNPay tạm thời không khả dụng. Chúng tôi sẽ liên hệ bạn để xác nhận thanh toán.',
              },
            });
          }
        } else if (formData.paymentMethod === 'paypal') {
          try {
            const paypalResponse = await createPayPalPayment(
              bookingId,
              totalPrice,
              'VND'
            );

            if (paypalResponse && paypalResponse.approvalUrl) {
              window.location.href = paypalResponse.approvalUrl;
            } else {
              throw new Error(
                `PayPal approval URL not received. Response: ${JSON.stringify(paypalResponse)}`
              );
            }
          } catch (paymentError) {
            console.warn(
              'PayPal payment failed, falling back to cash payment:',
              paymentError
            );
            // Fallback to cash payment if PayPal is unavailable
            navigate('/payment-success', {
              state: {
                bookingId: bookingId,
                items: cartItems,
                totalPrice: totalPrice,
                paymentMethod: 'cash',
                fallbackMessage:
                  'Phương thức PayPal tạm thời không khả dụng. Chúng tôi sẽ liên hệ bạn để xác nhận thanh toán.',
              },
            });
          }
        } else {
          navigate('/payment-success', {
            state: {
              bookingId: bookingId,
              items: cartItems,
              totalPrice: totalPrice,
              paymentMethod: formData.paymentMethod,
            },
          });
        }
      } else {
        throw new Error(response.message || 'Tạo booking thất bại');
      }
    } catch (err) {
      setError(err.message || 'Có lỗi khi xử lý booking');
      console.error('Booking error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <button onClick={() => navigate(-1)} className={styles.backBtn}>
            <ArrowLeft size={20} />
            Quay lại
          </button>
          <h1>Thanh Toán</h1>
        </div>

        <div className={styles.emptyCart}>
          <p>Giỏ hàng của bạn trống. Vui lòng thêm sản phẩm.</p>
          <button onClick={handleAddMore} className={styles.addBtn}>
            <Plus size={20} />
            Thêm sản phẩm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {}
      <div className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backBtn}>
          <ArrowLeft size={20} />
          Quay lại
        </button>
        <h1>Thanh Toán</h1>
      </div>

      <div className={styles.content}>
        {}
        <div className={styles.cartSection}>
          <h2>Các sản phẩm được chọn ({cartItems.length})</h2>

          {cartItems.map((item) => (
            <div key={item.id} className={styles.cartItem}>
              {}
              <div className={styles.itemTitleRow}>
                <div className={styles.titleSection}>
                  <h3>{item.itemName}</h3>
                  <div className={styles.quickInfo}>
                    <span className={styles.badge}>
                      {item.itemType === 'experience'
                        ? 'Trải nghiệm'
                        : item.itemType === 'hotel'
                          ? 'Khách sạn'
                          : 'Tour'}
                    </span>

                    {item.itemType === 'experience' &&
                      itemDetails[item.itemId] && (
                        <>
                          <span className={styles.infoItem}>
                            <FontAwesomeIcon
                              icon={faMapPin}
                              className={styles.icon}
                            />
                            {itemDetails[item.itemId].location}
                          </span>
                          <span className={styles.infoItem}>
                            <FontAwesomeIcon
                              icon={faClock}
                              className={styles.icon}
                            />
                            {itemDetails[item.itemId].duration}
                          </span>
                        </>
                      )}

                    {item.itemType === 'hotel' && itemDetails[item.itemId] && (
                      <>
                        <span className={styles.infoItem}>
                          <FontAwesomeIcon
                            icon={faMapPin}
                            className={styles.icon}
                          />
                          {itemDetails[item.itemId].location}
                        </span>
                        <span className={styles.infoItem}>
                          <FontAwesomeIcon
                            icon={faStar}
                            className={styles.icon}
                          />
                          {itemDetails[item.itemId].rating} (
                          {itemDetails[item.itemId].category})
                        </span>
                      </>
                    )}

                    {item.itemType === 'tour' && itemDetails[item.itemId] && (
                      <>
                        <span className={styles.infoItem}>
                          <FontAwesomeIcon
                            icon={faMapPin}
                            className={styles.icon}
                          />
                          {itemDetails[item.itemId].location}
                        </span>
                        <span className={styles.infoItem}>
                          <FontAwesomeIcon
                            icon={faClock}
                            className={styles.icon}
                          />
                          {itemDetails[item.itemId].duration}
                        </span>
                        <span className={styles.infoItem}>
                          <FontAwesomeIcon
                            icon={faMap}
                            className={styles.icon}
                          />
                          {itemDetails[item.itemId].region}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className={styles.priceSection}>
                  <span className={styles.priceValue}>
                    {formatCurrency(item.totalPrice || 0)}
                  </span>
                  <button
                    className={styles.removeBtn}
                    onClick={() => handleRemoveItem(item.id)}
                    type="button"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {}
              <div className={styles.formFieldsRow}>
                <div className={styles.formField}>
                  <label>NGÀY ĐẶT (Check-in)</label>
                  <input
                    type="date"
                    value={item.bookingDate || ''}
                    onChange={(e) =>
                      handleItemChange(item.id, 'bookingDate', e.target.value)
                    }
                  />
                </div>

                {item.itemType === 'hotel' && (
                  <div className={styles.formField}>
                    <label>NGÀY TRẢ (Check-out)</label>
                    <input
                      type="date"
                      value={item.checkoutDate || ''}
                      onChange={(e) =>
                        handleItemChange(
                          item.id,
                          'checkoutDate',
                          e.target.value
                        )
                      }
                      min={item.bookingDate || ''}
                    />
                  </div>
                )}

                {item.itemType === 'experience' && (
                  <div className={styles.formField}>
                    <label>KHUNG GIỜ</label>
                    <select
                      value={item.timeSlot || ''}
                      onChange={(e) =>
                        handleItemChange(item.id, 'timeSlot', e.target.value)
                      }
                      disabled={
                        !timeSlots[item.itemId] ||
                        timeSlots[item.itemId].length === 0
                      }
                    >
                      <option value="">
                        {loadingDetails
                          ? 'Đang tải...'
                          : !timeSlots[item.itemId] ||
                              timeSlots[item.itemId].length === 0
                            ? 'Không có giờ trống'
                            : '-- Chọn --'}
                      </option>
                      {(timeSlots[item.itemId] || []).map((slot, index) => {
                        let slotTime, slotCapacity, slotBooked, slotAvailable;

                        if (typeof slot === 'string') {
                          slotTime = slot;
                          slotCapacity = 8;
                          slotBooked = 0;
                          slotAvailable = 8;
                        } else if (slot.time) {
                          slotTime = slot.time;
                          slotCapacity = slot.capacity || 8;
                          slotBooked = slot.booked || 0;
                          slotAvailable =
                            slot.available ?? slotCapacity - slotBooked;
                        } else {
                          slotTime = String(slot);
                          slotCapacity = 8;
                          slotBooked = 0;
                          slotAvailable = 8;
                        }

                        return (
                          <option
                            key={`${slotTime}-${index}`}
                            value={slotTime}
                            disabled={slotAvailable === 0}
                          >
                            {slotTime} ({slotBooked}/{slotCapacity})
                          </option>
                        );
                      })}
                    </select>
                  </div>
                )}

                {item.itemType === 'hotel' ? (
                  <div className={styles.formField}>
                    <label>SỐ PHÒNG / KHÁCH</label>
                    <div className={styles.counterInput}>
                      <button
                        type="button"
                        onClick={() =>
                          handleItemChange(
                            item.id,
                            'guestsCount',
                            Math.max(1, item.guestsCount - 1)
                          )
                        }
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={item.guestsCount || 1}
                        onChange={(e) =>
                          handleItemChange(
                            item.id,
                            'guestsCount',
                            parseInt(e.target.value) || 1
                          )
                        }
                        readOnly
                      />
                      <button
                        type="button"
                        onClick={() =>
                          handleItemChange(
                            item.id,
                            'guestsCount',
                            Math.min(10, item.guestsCount + 1)
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={styles.formField}>
                    <label>
                      KHÁCH
                      {item.minParticipants && item.maxParticipants
                        ? ` (${item.minParticipants}-${item.maxParticipants})`
                        : ''}
                    </label>
                    <div className={styles.counterInput}>
                      <button
                        type="button"
                        onClick={() =>
                          handleItemChange(
                            item.id,
                            'guestsCount',
                            Math.max(
                              item.minParticipants || 1,
                              item.guestsCount - 1
                            )
                          )
                        }
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min={item.minParticipants || 1}
                        max={item.maxParticipants || 20}
                        value={item.guestsCount || 1}
                        onChange={(e) =>
                          handleItemChange(
                            item.id,
                            'guestsCount',
                            parseInt(e.target.value) || 1
                          )
                        }
                        readOnly
                      />
                      <button
                        type="button"
                        onClick={() =>
                          handleItemChange(
                            item.id,
                            'guestsCount',
                            Math.min(
                              item.maxParticipants || 20,
                              item.guestsCount + 1
                            )
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {}
              {item.itemType === 'hotel' && itemDetails[item.itemId] && (
                <div className={styles.hotelDetailsSection}>
                  <h4 className={styles.detailsTitle}>Thông tin khách sạn</h4>
                  <div className={styles.hotelInfo}>
                    <div className={styles.infoBlock}>
                      <span className={styles.label}>
                        <FontAwesomeIcon icon={faMapPin} /> Địa chỉ
                      </span>
                      <span className={styles.value}>
                        {itemDetails[item.itemId].address}
                      </span>
                    </div>
                    <div className={styles.infoBlock}>
                      <span className={styles.label}>
                        <FontAwesomeIcon icon={faStar} /> Loại
                      </span>
                      <span className={styles.value}>
                        {itemDetails[item.itemId].category}
                      </span>
                    </div>
                    <div className={styles.infoBlock}>
                      <span className={styles.label}>⭐ Đánh giá</span>
                      <span className={styles.value}>
                        {itemDetails[item.itemId].rating}/5
                      </span>
                    </div>
                  </div>
                  {itemDetails[item.itemId].amenities &&
                    itemDetails[item.itemId].amenities.length > 0 && (
                      <div className={styles.amenitiesBlock}>
                        <span className={styles.label}>
                          <FontAwesomeIcon icon={faLightbulb} /> Tiện nghi
                        </span>
                        <div className={styles.amenitiesList}>
                          {itemDetails[item.itemId].amenities
                            .slice(0, 3)
                            .map((amenity, idx) => (
                              <span key={idx} className={styles.amenityTag}>
                                {amenity.icon} {amenity.name}
                              </span>
                            ))}
                          {itemDetails[item.itemId].amenities.length > 3 && (
                            <span className={styles.amenityTag}>
                              +{itemDetails[item.itemId].amenities.length - 3}{' '}
                              khác
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                </div>
              )}

              {}
              {item.itemType === 'tour' && itemDetails[item.itemId] && (
                <div className={styles.tourDetailsSection}>
                  <h4 className={styles.detailsTitle}>Thông tin hành trình</h4>

                  {}
                  <div className={styles.tourOverview}>
                    <div className={styles.overviewItem}>
                      <span className={styles.overviewLabel}>
                        <FontAwesomeIcon icon={faMapPin} /> Địa điểm
                      </span>
                      <span className={styles.overviewValue}>
                        {itemDetails[item.itemId].location}
                      </span>
                    </div>
                    <div className={styles.overviewItem}>
                      <span className={styles.overviewLabel}>
                        <FontAwesomeIcon icon={faMap} /> Khu vực
                      </span>
                      <span className={styles.overviewValue}>
                        {itemDetails[item.itemId].region}
                      </span>
                    </div>
                    <div className={styles.overviewItem}>
                      <span className={styles.overviewLabel}>
                        <FontAwesomeIcon icon={faClock} /> Thời lượng
                      </span>
                      <span className={styles.overviewValue}>
                        {itemDetails[item.itemId].duration}
                      </span>
                    </div>
                    <div className={styles.overviewItem}>
                      <span className={styles.overviewLabel}>
                        <FontAwesomeIcon icon={faUsers} /> Kích thước nhóm
                      </span>
                      <span className={styles.overviewValue}>
                        {itemDetails[item.itemId].minParticipants}-
                        {itemDetails[item.itemId].maxParticipants} người
                      </span>
                    </div>
                  </div>

                  {}
                  {itemDetails[item.itemId].highlights &&
                    itemDetails[item.itemId].highlights.length > 0 && (
                      <div className={styles.highlightsBlock}>
                        <h5 className={styles.blockTitle}>✨ Điểm nổi bật</h5>
                        <div className={styles.highlightsList}>
                          {itemDetails[item.itemId].highlights
                            .slice(0, 4)
                            .map((highlight, idx) => (
                              <div key={idx} className={styles.highlightItem}>
                                <span className={styles.highlightIcon}>
                                  {highlight.icon}
                                </span>
                                <div>
                                  <span className={styles.highlightName}>
                                    {highlight.title}
                                  </span>
                                  <span className={styles.highlightDesc}>
                                    {highlight.description}
                                  </span>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                  {}
                  {itemDetails[item.itemId].itinerary &&
                    itemDetails[item.itemId].itinerary.length > 0 && (
                      <div className={styles.itineraryBlock}>
                        <h5 className={styles.blockTitle}>
                          📋 Chi tiết hành trình
                        </h5>
                        <div className={styles.itineraryList}>
                          {itemDetails[item.itemId].itinerary
                            .slice(0, 2)
                            .map((day, idx) => (
                              <div key={idx} className={styles.itineraryDay}>
                                <span className={styles.dayNumber}>
                                  Ngày {day.day}
                                </span>
                                <span className={styles.dayTitle}>
                                  {day.title}
                                </span>
                                <p className={styles.dayDesc}>
                                  {day.description}
                                </p>
                                {day.activities &&
                                  day.activities.length > 0 && (
                                    <ul className={styles.activitiesList}>
                                      {day.activities
                                        .slice(0, 3)
                                        .map((activity, aIdx) => (
                                          <li key={aIdx}>{activity}</li>
                                        ))}
                                      {day.activities.length > 3 && (
                                        <li>...</li>
                                      )}
                                    </ul>
                                  )}
                              </div>
                            ))}
                          {itemDetails[item.itemId].itinerary.length > 2 && (
                            <div className={styles.moreItinerary}>
                              +{itemDetails[item.itemId].itinerary.length - 2}{' '}
                              ngày khác
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                  {}
                  {itemDetails[item.itemId].included &&
                    itemDetails[item.itemId].included.length > 0 && (
                      <div className={styles.includedBlock}>
                        <h5 className={styles.blockTitle}>✅ Bao gồm</h5>
                        <ul className={styles.includedList}>
                          {itemDetails[item.itemId].included
                            .slice(0, 5)
                            .map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          {itemDetails[item.itemId].included.length > 5 && (
                            <li>...</li>
                          )}
                        </ul>
                      </div>
                    )}

                  {}
                  {itemDetails[item.itemId].whatToBring &&
                    itemDetails[item.itemId].whatToBring.length > 0 && (
                      <div className={styles.bringBlock}>
                        <h5 className={styles.blockTitle}>
                          <FontAwesomeIcon icon={faBox} /> Cần chuẩn bị
                        </h5>
                        <ul className={styles.bringList}>
                          {itemDetails[item.itemId].whatToBring
                            .slice(0, 5)
                            .map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          {itemDetails[item.itemId].whatToBring.length > 5 && (
                            <li>...</li>
                          )}
                        </ul>
                      </div>
                    )}
                </div>
              )}
            </div>
          ))}

          {!cartItems.some((i) => i.itemType === 'tour') && (
            <button
              type="button"
              className={styles.addMoreBtn}
              onClick={handleAddMore}
            >
              <Plus size={16} />
              Thêm sản phẩm khác
            </button>
          )}

          {}
          {showAddMoreOptions && (
            <div className={styles.modal}>
              <div className={styles.modalContent}>
                <h3>Chọn loại sản phẩm muốn thêm</h3>
                <div className={styles.modalOptions}>
                  <button
                    type="button"
                    className={styles.optionBtn}
                    onClick={handleAddExperience}
                  >
                    <FontAwesomeIcon
                      icon={faGraduationCap}
                      className={styles.optionIcon}
                    />
                    <div className={styles.optionLabel}>Trải nghiệm</div>
                    <div className={styles.optionDesc}>
                      Lớp học, workshop, hoạt động
                    </div>
                  </button>
                  <button
                    type="button"
                    className={styles.optionBtn}
                    onClick={handleAddHotel}
                  >
                    <FontAwesomeIcon
                      icon={faBuilding}
                      className={styles.optionIcon}
                    />
                    <div className={styles.optionLabel}>Khách sạn</div>
                    <div className={styles.optionDesc}>
                      Nơi lưu trú, phòng ở
                    </div>
                  </button>
                </div>
                <button
                  type="button"
                  className={styles.modalClose}
                  onClick={() => setShowAddMoreOptions(false)}
                >
                  Đóng
                </button>
              </div>
              <div
                className={styles.modalOverlay}
                onClick={() => setShowAddMoreOptions(false)}
              />
            </div>
          )}
        </div>

        {}
        <div className={styles.formSection}>
          <form onSubmit={handleSubmit}>
            {}
            <div className={styles.billSection}>
              <h2>Thông tin khách hàng</h2>

              {error && (
                <div className={styles.errorBox}>
                  <span>{error}</span>
                </div>
              )}

              <div className={styles.formGroup}>
                <label>Họ và tên *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Nhập họ và tên"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Nhập email"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Số điện thoại *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Nhập số điện thoại"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Địa chỉ</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Nhập địa chỉ (tùy chọn)"
                />
              </div>
            </div>

            {}
            <div className={styles.paymentSection}>
              <h2>Phương thức thanh toán</h2>

              <div className={styles.paymentMethods}>
                <label className={styles.paymentOption}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="vnpay"
                    checked={formData.paymentMethod === 'vnpay'}
                    onChange={handleInputChange}
                  />
                  <span>
                    <CreditCard size={20} />
                    VNPay
                  </span>
                </label>

                <label className={styles.paymentOption}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={formData.paymentMethod === 'paypal'}
                    onChange={handleInputChange}
                  />
                  <span>
                    <CreditCard size={20} />
                    PayPal
                  </span>
                </label>

                <label className={styles.paymentOption}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={formData.paymentMethod === 'cash'}
                    onChange={handleInputChange}
                  />
                  <span>
                    <CreditCard size={20} />
                    Thanh toán khi nhận dịch vụ
                  </span>
                </label>
              </div>
            </div>

            {}
            <div className={styles.totalSection}>
              <div className={styles.totalRow}>
                <span>Tổng tiền:</span>
                <span className={styles.totalAmount}>
                  {formatCurrency(totalPrice)}
                </span>
              </div>

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading || cartItems.length === 0}
              >
                {loading ? 'Đang xử lý...' : 'Tiếp tục thanh toán'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
