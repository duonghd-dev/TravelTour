// Tạo file mới: modules/booking/booking.model.js
import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const bookingSchema = new Schema(
  {
    // Item references - support experiences, tours, hotels
    experienceId: {
      type: Schema.Types.ObjectId,
      ref: 'Experience',
      default: null, // Optional - can be null for tours/hotels
    },
    tourId: {
      type: Schema.Types.ObjectId,
      ref: 'Tour',
      default: null, // Optional - only for tour bookings
    },
    hotelId: {
      type: Schema.Types.ObjectId,
      ref: 'Hotel',
      default: null, // Optional - only for hotel bookings
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    artisanId: {
      type: Schema.Types.ObjectId,
      ref: 'Artisan',
      default: null, // Optional - only for experiences with artisans
    },
    // Ngày khách chọn đi tour
    bookingDate: {
      type: Date,
      required: true,
    },
    // Khung giờ khách chọn (VD: '08:00 AM') - only for experiences
    timeSlot: {
      type: String,
      default: null, // Optional - only required for experiences
      required: false,
    },
    // Số lượng khách
    guestsCount: {
      type: Number,
      required: true,
      min: 1,
    },
    // Tổng tiền
    totalPrice: {
      type: Number,
      required: true,
    },
    // Trạng thái đơn đặt chỗ
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    // 💳 PAYMENT FIELDS
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'bank_transfer', 'cash', 'vnpay', 'paypal'],
      required: true,
    },
    paymentId: {
      type: Schema.Types.ObjectId,
      ref: 'Payment',
      default: null,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    isPaid: {
      type: Boolean,
      default: false,
    },

    // 📋 BILLING INFO (mã hóa: fullName, email, phone, address)
    billingInfo: {
      type: mongoose.Schema.Types.Mixed, // { encryptedData, iv, authTag } - encrypted
      required: true,
    },
    // Flag để track nếu billingInfo đã encrypted
    isEncrypted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default model('Booking', bookingSchema);
