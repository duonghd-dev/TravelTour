// Tạo file mới: modules/booking/booking.model.js
import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const bookingSchema = new Schema(
  {
    experienceId: {
      type: Schema.Types.ObjectId,
      ref: 'Experience',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    artisanId: {
      type: Schema.Types.ObjectId,
      ref: 'Artisan',
      required: true,
    },
    // Ngày khách chọn đi tour
    bookingDate: {
      type: Date,
      required: true,
    },
    // Khung giờ khách chọn (VD: '08:00 AM')
    timeSlot: {
      type: String,
      required: true,
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
  },
  { timestamps: true }
);

export default model('Booking', bookingSchema);
