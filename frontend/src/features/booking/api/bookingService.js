import apiService from '@/services/api/apiService.js';

const bookingAPI = '/api/v1/bookings';

export const createBooking = async (bookingData) => {
  try {
    const payload = {
      bookingDate: bookingData.bookingDate,
      guestsCount: bookingData.guestsCount,
      totalPrice: bookingData.totalPrice,
      paymentMethod: bookingData.paymentMethod,
      billingInfo: bookingData.billingInfo,
    };

    if (bookingData.itemType === 'experience' && bookingData.timeSlot) {
      payload.timeSlot = bookingData.timeSlot;
    }

    if (bookingData.itemType === 'tour') {
      payload.tourId = bookingData.itemId;
    } else if (bookingData.itemType === 'experience') {
      payload.experienceId = bookingData.itemId;
    } else if (bookingData.itemType === 'hotel') {
      payload.hotelId = bookingData.itemId;
      payload.checkoutDate = bookingData.checkoutDate;
    }

    console.log(
      '[bookingService] POST /api/v1/bookings with payload:',
      payload
    );

    const response = await apiService.post(bookingAPI, payload);
    return response.data;
  } catch (error) {
    console.error('Failed to create booking:', error);
    throw error;
  }
};

export const getBooking = async (bookingId) => {
  try {
    const response = await apiService.get(`${bookingAPI}/${bookingId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch booking:', error);
    throw error;
  }
};

export const getUserBookings = async () => {
  try {
    const response = await apiService.get(bookingAPI, {
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user bookings:', error);
    throw error;
  }
};

export const confirmBookingPayment = async (bookingId, paymentData) => {
  try {
    const response = await apiService.post(
      `${bookingAPI}/${bookingId}/confirm-payment`,
      {
        transactionId: paymentData.transactionId,
        paymentMethod: paymentData.paymentMethod,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to confirm payment:', error);
    throw error;
  }
};

export const cancelBooking = async (bookingId) => {
  try {
    const response = await apiService.post(`${bookingAPI}/${bookingId}/cancel`);
    return response.data;
  } catch (error) {
    console.error('Failed to cancel booking:', error);
    throw error;
  }
};

export default {
  createBooking,
  getBooking,
  getUserBookings,
  confirmBookingPayment,
  cancelBooking,
};
