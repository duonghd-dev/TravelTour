/**
 * Booking API Service
 * Handle all booking-related API calls
 */

import apiService from '@/services/api/apiService.js';

const bookingAPI = '/api/v1/bookings';

/**
 * Create a new booking
 * @param {Object} bookingData - Booking details
 * @returns {Promise}
 */
export const createBooking = async (bookingData) => {
  try {
    // Map itemId to correct field name based on itemType
    const payload = {
      bookingDate: bookingData.bookingDate,
      guestsCount: bookingData.guestsCount,
      totalPrice: bookingData.totalPrice,
      paymentMethod: bookingData.paymentMethod,
      billingInfo: bookingData.billingInfo,
    };

    // Add timeSlot for experiences only
    if (bookingData.itemType === 'experience' && bookingData.timeSlot) {
      payload.timeSlot = bookingData.timeSlot;
    }

    // Add type-specific ID field
    if (bookingData.itemType === 'tour') {
      payload.tourId = bookingData.itemId;
    } else if (bookingData.itemType === 'experience') {
      payload.experienceId = bookingData.itemId;
    } else if (bookingData.itemType === 'hotel') {
      payload.hotelId = bookingData.itemId;
      payload.checkoutDate = bookingData.checkoutDate; // Hotels need checkout date
    }

    const response = await apiService.post(bookingAPI, payload);
    return response.data;
  } catch (error) {
    console.error('Failed to create booking:', error);
    throw error;
  }
};

/**
 * Get booking details
 * @param {string} bookingId - Booking ID
 * @returns {Promise}
 */
export const getBooking = async (bookingId) => {
  try {
    const response = await apiService.get(`${bookingAPI}/${bookingId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch booking:', error);
    throw error;
  }
};

/**
 * Get user's bookings
 * @returns {Promise}
 */
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

/**
 * Confirm payment for booking
 * @param {string} bookingId - Booking ID
 * @param {Object} paymentData - Payment details
 * @returns {Promise}
 */
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

/**
 * Cancel booking
 * @param {string} bookingId - Booking ID
 * @returns {Promise}
 */
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
