import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const paymentSchema = new Schema(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'USD',
    },

    paymentMethod: {
      type: String,
      enum: ['credit_card', 'bank_transfer', 'cash', 'vnpay', 'paypal'],
      required: true,
    },
    paymentGateway: {
      type: String,
      enum: ['stripe', 'vnpay', 'paypal', 'manual', 'mock'],
      default: 'mock',
    },

    transactionId: {
      type: String,
      unique: true,
      sparse: true,
    },
    gatewayReference: {
      type: String,
      sparse: true,
    },

    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },

    paymentDetails: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    isEncrypted: {
      type: Boolean,
      default: false,
    },

    completedAt: {
      type: Date,
      default: null,
    },
    failureReason: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// Indexes for better query performance
paymentSchema.index({ bookingId: 1 }, { unique: true });
paymentSchema.index({ userId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ paymentMethod: 1 });
paymentSchema.index({ transactionId: 1 }, { sparse: true });
paymentSchema.index({ gatewayReference: 1 }, { sparse: true });
paymentSchema.index({ createdAt: -1 });

export default model('Payment', paymentSchema);
