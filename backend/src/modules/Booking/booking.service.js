import Booking from './booking.model.js';
import BillingInfo from './billingInfo.model.js';
import Experience from '../experience/experience.model.js';
import User from '../user/user.model.js';
import Artisan from '../artisan/artisan.model.js';
import logger from '../../common/utils/logger.js';
import { encrypt, decrypt } from '../../common/utils/encryption.js';

const encryptBillingInfo = (billingInfo) => {
  if (!billingInfo) return null;

  try {
    return encrypt(JSON.stringify(billingInfo));
  } catch (error) {
    logger.error('Failed to encrypt billing info:', error.message);
    return billingInfo;
  }
};

const decryptBillingInfo = (encryptedData) => {
  if (!encryptedData || typeof encryptedData === 'string') {
    return encryptedData;
  }

  try {
    const decrypted = decrypt(encryptedData);
    return JSON.parse(decrypted);
  } catch (error) {
    logger.error('Failed to decrypt billing info:', error.message);
    return null;
  }
};

export const getUserBookings = async (userId) => {
  try {
    const bookings = await Booking.find({ userId })
      .populate('experienceId', 'title price duration')
      .populate('artisanId', 'userId')
      .populate('billingInfoId', 'encryptedData iv authTag')
      .sort({ createdAt: -1 })
      .lean();

    const decryptedBookings = bookings.map((booking) => {
      if (booking.billingInfoId && booking.billingInfoId.encryptedData) {
        const encryptedObj = booking.billingInfoId;
        const decrypted = decryptBillingInfo({
          encryptedData: encryptedObj.encryptedData,
          iv: encryptedObj.iv,
          authTag: encryptedObj.authTag,
        });

        if (decrypted && decrypted.phone) {
          decrypted.phone = decrypted.phone.slice(-4);
        }

        booking.billingInfo = decrypted || null;
      }
      delete booking.billingInfoId;
      return booking;
    });

    return {
      success: true,
      message: 'Danh sách bookings',
      data: decryptedBookings,
    };
  } catch (error) {
    logger.error('[getUserBookings] Error:', error.message);
    throw error;
  }
};

export const createBooking = async (userId, bookingData) => {
  try {
    let itemId, itemType;

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
      checkoutDate,
    } = bookingData;

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

    if (itemType === 'experience' && !timeSlot) {
      throw new Error(
        'Missing required field: timeSlot (required for experiences)'
      );
    }

    if (itemType === 'experience' && timeSlot && typeof timeSlot !== 'string') {
      throw new Error('timeSlot must be a non-empty string (e.g., "08:00 AM")');
    }

    const finalTimeSlot = itemType === 'experience' ? timeSlot : undefined;

    const encryptedBillingData = encryptBillingInfo(billingInfo);

    let booking = null;

    if (itemType === 'experience') {
      const experience = await Experience.findById(itemId);
      if (!experience) {
        throw new Error('Experience not found');
      }

      if (
        guestsCount < experience.minGuests ||
        guestsCount > experience.maxGuests
      ) {
        throw new Error(
          `Guests must be between ${experience.minGuests} and ${experience.maxGuests}`
        );
      }

      booking = new Booking({
        userId,
        experienceId: itemId,
        artisanId: experience.artisanId,
        bookingDate,
        timeSlot: finalTimeSlot,
        guestsCount,
        totalPrice: totalPrice || experience.price * guestsCount,
        status: 'pending',
        paymentMethod,
      });

      await booking.save();

      // Create billing info document
      const billingInfoDoc = new BillingInfo({
        bookingId: booking._id,
        encryptedData: encryptedBillingData.encryptedData,
        iv: encryptedBillingData.iv,
        authTag: encryptedBillingData.authTag,
        isEncrypted: true,
      });

      await billingInfoDoc.save();
      booking.billingInfoId = billingInfoDoc._id;
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
      booking = new Booking({
        userId,
        tourId: itemId,
        artisanId: null,
        bookingDate,
        guestsCount,
        totalPrice: totalPrice || 3000000,
        status: 'pending',
        paymentMethod,
      });

      await booking.save();

      // Create billing info document
      const billingInfoDoc = new BillingInfo({
        bookingId: booking._id,
        encryptedData: encryptedBillingData.encryptedData,
        iv: encryptedBillingData.iv,
        authTag: encryptedBillingData.authTag,
        isEncrypted: true,
      });

      await billingInfoDoc.save();
      booking.billingInfoId = billingInfoDoc._id;
      await booking.save();

      logger.info(`Tour Booking ${booking._id} created by user ${userId}`);

      return {
        success: true,
        message: 'Booking created successfully',
        _id: booking._id,
        data: booking,
      };
    } else if (itemType === 'hotel') {
      booking = new Booking({
        userId,
        hotelId: itemId,
        artisanId: null,
        bookingDate,
        guestsCount,
        totalPrice: totalPrice || 2000000,
        status: 'pending',
        paymentMethod,
      });

      if (checkoutDate) {
        booking.metadata = { checkoutDate };
      }

      await booking.save();

      // Create billing info document
      const billingInfoDoc = new BillingInfo({
        bookingId: booking._id,
        encryptedData: encryptedBillingData.encryptedData,
        iv: encryptedBillingData.iv,
        authTag: encryptedBillingData.authTag,
        isEncrypted: true,
      });

      await billingInfoDoc.save();
      booking.billingInfoId = billingInfoDoc._id;
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

export const getBookingDetail = async (bookingId) => {
  try {
    const booking = await Booking.findById(bookingId)
      .populate('userId', 'firstName lastName email phone')
      .populate('experienceId', 'title description price duration')
      .populate('artisanId', 'userId title craft')
      .populate('billingInfoId', 'encryptedData iv authTag')
      .lean();

    if (!booking) {
      throw new Error('Booking not found');
    }

    // Decrypt billing info
    if (booking.billingInfoId) {
      const decrypted = decryptBillingInfo(booking.billingInfoId);
      booking.billingInfo = decrypted;
      delete booking.billingInfoId;
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

export const confirmPayment = async (bookingId, userId, paymentData) => {
  try {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      throw new Error('Booking not found');
    }

    if (booking.userId.toString() !== userId.toString()) {
      throw new Error('Unauthorized: You do not own this booking');
    }

    booking.paymentStatus = 'completed';
    booking.isPaid = true;
    booking.status = 'confirmed';

    if (paymentData.transactionId) {
      booking._id;
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

export const getAvailableSlots = async (experienceId, date) => {
  try {
    const experience = await Experience.findById(experienceId);
    if (!experience) {
      throw new Error('Experience not found');
    }

    // Kiểm tra xem experience có timeSlots không
    let timeSlots = experience.timeSlots || [];

    // Nếu không có timeSlots, dùng default
    if (!timeSlots || timeSlots.length === 0) {
      timeSlots = [
        { time: '08:00', capacity: 8 },
        { time: '10:00', capacity: 8 },
        { time: '14:00', capacity: 8 },
        { time: '16:00', capacity: 8 },
      ];
    }

    const bookingDate = new Date(date);
    if (isNaN(bookingDate.getTime())) {
      throw new Error('Invalid date format. Use YYYY-MM-DD');
    }

    const startOfDay = new Date(bookingDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(bookingDate);
    endOfDay.setHours(23, 59, 59, 999);

    const bookings = await Booking.find({
      experienceId,
      bookingDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      status: { $ne: 'cancelled' },
    });

    const bookedBySlot = {};
    bookings.forEach((booking) => {
      if (!bookedBySlot[booking.timeSlot]) {
        bookedBySlot[booking.timeSlot] = 0;
      }
      bookedBySlot[booking.timeSlot] += booking.guestsCount;
    });

    const slotsWithAvailability = timeSlots
      .filter((slot) => {
        const slotTime = typeof slot === 'string' ? slot : slot?.time;
        return (
          slotTime && typeof slotTime === 'string' && slotTime.trim() !== ''
        );
      })
      .map((slot) => {
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
