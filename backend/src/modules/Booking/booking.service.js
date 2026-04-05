import Booking from './booking.model.js';
import Experience from '../experience/experience.model.js';
import User from '../user/user.model.js';
import Artisan from '../artisan/artisan.model.js';
import logger from '../../common/utils/logger.js';

/**
 * Lấy danh sách bookings của user
 */
export const getUserBookings = async (userId) => {
  try {
    const bookings = await Booking.find({ userId })
      .populate('experienceId', 'title price duration')
      .populate('artisanId', 'userId')
      .sort({ createdAt: -1 })
      .lean();

    return {
      success: true,
      message: 'Danh sách bookings',
      data: bookings,
    };
  } catch (error) {
    logger.error('[getUserBookings] Error:', error.message);
    throw error;
  }
};

/**
 * Tạo booking mới
 */
export const createBooking = async (userId, bookingData) => {
  try {
    const { experienceId, bookingDate, timeSlot, guestsCount } = bookingData;

    // Kiểm tra experience tồn tại
    const experience = await Experience.findById(experienceId);
    if (!experience) {
      throw new Error('Experience not found');
    }

    // Kiểm tra số lượng khách hợp lệ
    if (
      guestsCount < experience.minGuests ||
      guestsCount > experience.maxGuests
    ) {
      throw new Error(
        `Guests must be between ${experience.minGuests} and ${experience.maxGuests}`
      );
    }

    // Tính tổng tiền
    const totalPrice = experience.price * guestsCount;

    // Tạo booking
    const booking = new Booking({
      userId,
      experienceId,
      artisanId: experience.artisanId,
      bookingDate,
      timeSlot,
      guestsCount,
      totalPrice,
      status: 'pending',
    });

    await booking.save();

    logger.info(`Booking ${booking._id} created by user ${userId}`);

    return {
      success: true,
      message: 'Booking created successfully',
      data: booking,
    };
  } catch (error) {
    logger.error('[createBooking] Error:', error.message);
    throw error;
  }
};

/**
 * Lấy chi tiết booking
 */
export const getBookingDetail = async (bookingId) => {
  try {
    const booking = await Booking.findById(bookingId)
      .populate('userId', 'firstName lastName email phone')
      .populate('experienceId', 'title description price duration')
      .populate('artisanId', 'userId title craft')
      .lean();

    if (!booking) {
      throw new Error('Booking not found');
    }

    return {
      success: true,
      message: 'Chi tiết booking',
      data: booking,
    };
  } catch (error) {
    logger.error('[getBookingDetail] Error:', error.message);
    throw error;
  }
};

/**
 * Cập nhật status booking
 */
export const updateBookingStatus = async (bookingId, status) => {
  try {
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];

    if (!validStatuses.includes(status)) {
      throw new Error(
        `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      );
    }

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true, runValidators: true }
    );

    if (!booking) {
      throw new Error('Booking not found');
    }

    logger.info(`Booking ${bookingId} status updated to ${status}`);

    return {
      success: true,
      message: 'Booking status updated',
      data: booking,
    };
  } catch (error) {
    logger.error('[updateBookingStatus] Error:', error.message);
    throw error;
  }
};

/**
 * Hủy booking
 */
export const cancelBooking = async (bookingId) => {
  try {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      throw new Error('Booking not found');
    }

    if (booking.status === 'completed') {
      throw new Error('Cannot cancel a completed booking');
    }

    booking.status = 'cancelled';
    await booking.save();

    logger.info(`Booking ${bookingId} cancelled`);

    return {
      success: true,
      message: 'Booking cancelled successfully',
      data: booking,
    };
  } catch (error) {
    logger.error('[cancelBooking] Error:', error.message);
    throw error;
  }
};
