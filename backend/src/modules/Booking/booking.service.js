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
    // Support both generic (itemId + itemType) and type-specific (tourId, experienceId, hotelId) formats
    let itemId, itemType;

    // Extract itemId and itemType from request
    if (bookingData.tourId) {
      itemId = bookingData.tourId;
      itemType = 'tour';
    } else if (bookingData.experienceId) {
      itemId = bookingData.experienceId;
      itemType = 'experience';
    } else if (bookingData.hotelId) {
      itemId = bookingData.hotelId;
      itemType = 'hotel';
    } else if (bookingData.itemId && bookingData.itemType) {
      // Fallback to generic format
      itemId = bookingData.itemId;
      itemType = bookingData.itemType;
    }

    const {
      bookingDate,
      timeSlot,
      guestsCount,
      totalPrice,
      paymentMethod,
      billingInfo,
      checkoutDate, // for hotels
    } = bookingData;

    // Validate required fields
    if (
      !itemId ||
      !itemType ||
      !bookingDate ||
      !guestsCount ||
      !paymentMethod ||
      !billingInfo
    ) {
      throw new Error(
        'Missing required fields: item ID, booking date, guests count, payment method, and billing info'
      );
    }

    // Validate timeSlot - only required for experiences
    if (itemType === 'experience' && !timeSlot) {
      throw new Error(
        'Missing required field: timeSlot (required for experiences)'
      );
    }

    // Validate timeSlot format if provided (only for experiences)
    if (itemType === 'experience' && timeSlot && typeof timeSlot !== 'string') {
      throw new Error('timeSlot must be a non-empty string (e.g., "08:00 AM")');
    }

    // For tours and hotels, ignore timeSlot if it's empty or undefined
    const finalTimeSlot = itemType === 'experience' ? timeSlot : undefined;

    // Handle different booking types
    if (itemType === 'experience') {
      // Kiểm tra experience tồn tại
      const experience = await Experience.findById(itemId);
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

      // Tạo booking
      const booking = new Booking({
        userId,
        experienceId: itemId,
        artisanId: experience.artisanId,
        bookingDate,
        timeSlot: finalTimeSlot,
        guestsCount,
        totalPrice: totalPrice || experience.price * guestsCount,
        status: 'pending',
        paymentMethod,
        paymentStatus: 'pending',
        isPaid: false,
        billingInfo,
      });

      await booking.save();

      logger.info(
        `Experience Booking ${booking._id} created by user ${userId}`
      );

      return {
        success: true,
        message: 'Booking created successfully',
        _id: booking._id,
        data: booking,
      };
    } else if (itemType === 'tour') {
      // For tours, we create a booking record
      // Note: Tour model might not exist yet, so we'll just store tourId as extra field
      const booking = new Booking({
        userId,
        // Store tour as experienceId for now (schema compatibility)
        experienceId: itemId,
        artisanId: null, // Tours might not have artisan
        bookingDate,
        // Don't include timeSlot for tours
        guestsCount,
        totalPrice: totalPrice || 3000000, // Default price for now
        status: 'pending',
        paymentMethod,
        paymentStatus: 'pending',
        isPaid: false,
        billingInfo,
      });

      await booking.save();

      logger.info(`Tour Booking ${booking._id} created by user ${userId}`);

      return {
        success: true,
        message: 'Booking created successfully',
        _id: booking._id,
        data: booking,
      };
    } else if (itemType === 'hotel') {
      // Hotel bookings need checkoutDate
      const booking = new Booking({
        userId,
        experienceId: itemId, // Store hotel as experienceId for schema compatibility
        artisanId: null,
        bookingDate,
        // Don't include timeSlot for hotels
        guestsCount,
        totalPrice: totalPrice || 2000000,
        status: 'pending',
        paymentMethod,
        paymentStatus: 'pending',
        isPaid: false,
        billingInfo,
      });

      // Store checkoutDate in custom field or metadata
      if (checkoutDate) {
        booking.metadata = { checkoutDate };
      }

      await booking.save();

      logger.info(`Hotel Booking ${booking._id} created by user ${userId}`);

      return {
        success: true,
        message: 'Booking created successfully',
        _id: booking._id,
        data: booking,
      };
    }

    throw new Error(`Unsupported item type: ${itemType}`);
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

/**
 * Confirm payment for booking
 */
export const confirmPayment = async (bookingId, userId, paymentData) => {
  try {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      throw new Error('Booking not found');
    }

    // Verify user owns this booking
    if (booking.userId.toString() !== userId.toString()) {
      throw new Error('Unauthorized: You do not own this booking');
    }

    // Update booking payment status
    booking.paymentStatus = 'completed';
    booking.isPaid = true;
    booking.status = 'confirmed';

    // Save transaction ID if provided
    if (paymentData.transactionId) {
      booking._id; // You might want to store this in a payment record
    }

    await booking.save();

    logger.info(`Payment confirmed for booking ${bookingId}`);

    return {
      success: true,
      message: 'Payment confirmed successfully',
      data: booking,
    };
  } catch (error) {
    logger.error('[confirmPayment] Error:', error.message);
    throw error;
  }
};

/**
 * Lấy số slot còn trống cho một ngày cụ thể
 * @param {string} experienceId - Experience ID
 * @param {string} date - Date in format YYYY-MM-DD (e.g., "2026-04-15")
 * @returns {Object} Available slots with capacity info
 */
export const getAvailableSlots = async (experienceId, date) => {
  try {
    // Lấy experience để có thông tin timeSlots
    const experience = await Experience.findById(experienceId);
    if (!experience) {
      throw new Error('Experience not found');
    }

    // Parse date string to Date object
    const bookingDate = new Date(date);
    if (isNaN(bookingDate.getTime())) {
      throw new Error('Invalid date format. Use YYYY-MM-DD');
    }

    // Set to start of day for query
    const startOfDay = new Date(bookingDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(bookingDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Lấy tất cả bookings cho ngày này
    const bookings = await Booking.find({
      experienceId,
      bookingDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      status: { $ne: 'cancelled' }, // Exclude cancelled bookings
    });

    // Group bookings by timeSlot
    const bookedBySlot = {};
    bookings.forEach((booking) => {
      if (!bookedBySlot[booking.timeSlot]) {
        bookedBySlot[booking.timeSlot] = 0;
      }
      bookedBySlot[booking.timeSlot] += booking.guestsCount;
    });

    // Calculate available slots for each timeSlot
    const slotsWithAvailability = experience.timeSlots.map((slot) => {
      const slotTime = typeof slot === 'string' ? slot : slot.time;
      const capacity = typeof slot === 'object' ? slot.capacity : 8;
      const booked = bookedBySlot[slotTime] || 0;
      const available = capacity - booked;

      return {
        time: slotTime,
        capacity,
        booked,
        available: Math.max(0, available),
      };
    });

    return {
      success: true,
      message: 'Available slots',
      data: slotsWithAvailability,
    };
  } catch (error) {
    logger.error('[getAvailableSlots] Error:', error.message);
    throw error;
  }
};
