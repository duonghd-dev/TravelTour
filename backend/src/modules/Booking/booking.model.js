import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const bookingSchema = new Schema(
  {
    experienceId: {
      type: Schema.Types.ObjectId,
      ref: 'Experience',
      default: null,
    },
    tourId: {
      type: Schema.Types.ObjectId,
      ref: 'Tour',
      default: null,
    },
    hotelId: {
      type: Schema.Types.ObjectId,
      ref: 'Hotel',
      default: null,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    artisanId: {
      type: Schema.Types.ObjectId,
      ref: 'Artisan',
      default: null,
    },

    bookingDate: {
      type: Date,
      required: true,
    },

    timeSlot: {
      type: String,
      default: null,
      required: false,
    },

    guestsCount: {
      type: Number,
      required: true,
      min: 1,
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },

    paymentId: {
      type: Schema.Types.ObjectId,
      ref: 'Payment',
      default: null,
    },

    billingInfoId: {
      type: Schema.Types.ObjectId,
      ref: 'BillingInfo',
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

    paymentMethod: {
      type: String,
      enum: ['vnpay', 'paypal', 'cash'],
      default: 'cash',
    },
  },
  { timestamps: true }
);

// Indexes for better query performance
bookingSchema.index({ userId: 1 });
bookingSchema.index({ experienceId: 1 });
bookingSchema.index({ tourId: 1 });
bookingSchema.index({ hotelId: 1 });
bookingSchema.index({ status: 1 });

bookingSchema.index({ userId: 1, createdAt: -1 });
bookingSchema.index({ billingInfoId: 1 });

export default model('Booking', bookingSchema);
