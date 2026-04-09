/**
 * Updated Booking Service - Uses separated BillingInfo collection
 * This file shows the changes needed for booking.service.js
 */

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
      .populate('billingInfoId', 'encryptedData iv authTag') // NEW: populate BillingInfo
      .sort({ createdAt: -1 })
      .lean();

    const decryptedBookings = bookings.map((booking) => {
      // NEW: Decrypt from billingInfoId instead of billingInfo
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

        // Include decrypted billing info in response
        booking.billingInfo = decrypted || null;
      }
      // Remove the raw encryptedData from response
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

    // NEW: Encrypt billing info and save to separate collection
    const encryptedBillingData = encryptBillingInfo(billingInfo);

    // Create booking document WITHOUT billingInfo
    let bookingDocument = null;

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

      bookingDocument = new Booking({
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
        // NO billingInfo here anymore
      });

      await bookingDocument.save();

      // NEW: Save billing info to separate collection
      const billingInfoDoc = new BillingInfo({
        bookingId: bookingDocument._id,
        encryptedData: encryptedBillingData.encryptedData,
        iv: encryptedBillingData.iv,
        authTag: encryptedBillingData.authTag,
        isEncrypted: true,
      });

      await billingInfoDoc.save();

      // Update booking with reference
      bookingDocument.billingInfoId = billingInfoDoc._id;
      await bookingDocument.save();

      logger.info(
        `Experience Booking ${bookingDocument._id} created by user ${userId}`
      );

      return {
        success: true,
        message: 'Booking created successfully',
        _id: bookingDocument._id,
        data: bookingDocument,
      };
    } else if (itemType === 'tour') {
      bookingDocument = new Booking({
        userId,
        tourId: itemId,
        artisanId: null,
        bookingDate,
        guestsCount,
        totalPrice: totalPrice || 3000000,
        status: 'pending',
        paymentMethod,
        paymentStatus: 'pending',
        isPaid: false,
        // NO billingInfo here anymore
      });

      await bookingDocument.save();

      // NEW: Save billing info to separate collection
      const billingInfoDoc = new BillingInfo({
        bookingId: bookingDocument._id,
        encryptedData: encryptedBillingData.encryptedData,
        iv: encryptedBillingData.iv,
        authTag: encryptedBillingData.authTag,
        isEncrypted: true,
      });

      await billingInfoDoc.save();

      // Update booking with reference
      bookingDocument.billingInfoId = billingInfoDoc._id;
      await bookingDocument.save();

      logger.info(
        `Tour Booking ${bookingDocument._id} created by user ${userId}`
      );

      return {
        success: true,
        message: 'Booking created successfully',
        _id: bookingDocument._id,
        data: bookingDocument,
      };
    } else if (itemType === 'hotel') {
      bookingDocument = new Booking({
        userId,
        hotelId: itemId,
        artisanId: null,
        bookingDate,
        guestsCount,
        totalPrice: totalPrice || 2000000,
        status: 'pending',
        paymentMethod,
        paymentStatus: 'pending',
        isPaid: false,
        // NO billingInfo here anymore
      });

      if (checkoutDate) {
        bookingDocument.metadata = { checkoutDate };
      }

      await bookingDocument.save();

      // NEW: Save billing info to separate collection
      const billingInfoDoc = new BillingInfo({
        bookingId: bookingDocument._id,
        encryptedData: encryptedBillingData.encryptedData,
        iv: encryptedBillingData.iv,
        authTag: encryptedBillingData.authTag,
        isEncrypted: true,
      });

      await billingInfoDoc.save();

      // Update booking with reference
      bookingDocument.billingInfoId = billingInfoDoc._id;
      await bookingDocument.save();

      logger.info(
        `Hotel Booking ${bookingDocument._id} created by user ${userId}`
      );

      return {
        success: true,
        message: 'Booking created successfully',
        _id: bookingDocument._id,
        data: bookingDocument,
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

// Other functions like updateBookingStatus, cancelBooking, confirmPayment remain the same
// They don't need changes as they don't access billingInfo
