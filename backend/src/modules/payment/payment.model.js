import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const paymentSchema = new Schema(
  {
    // 📌 REFERENCE
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

    // 💵 AMOUNT
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'USD', // or VND, depending on your market
    },

    // 💳 PAYMENT METHOD & GATEWAY
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'bank_transfer', 'cash', 'vnpay', 'paypal'],
      required: true,
    },
    paymentGateway: {
      type: String,
      enum: ['stripe', 'vnpay', 'paypal', 'manual', 'mock'],
      default: 'mock', // Changed to 'mock' for testing
    },

    // 🔐 TRANSACTION
    transactionId: {
      type: String,
      unique: true,
      sparse: true,
    },
    gatewayReference: {
      type: String, // For storing gateway's transaction ID
      sparse: true,
    },

    // 📊 STATUS
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },

    // 📝 DETAILS
    paymentDetails: {
      last4Digits: String, // For credit card
      cardBrand: String, // visa, mastercard, etc
      bankCode: String, // For bank transfer
      bankName: String,
      notes: String,
    },

    // ⏰ TIMESTAMPS
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

// Index for faster queries
paymentSchema.index({ bookingId: 1 });
paymentSchema.index({ userId: 1 });
paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ createdAt: -1 });

export default model('Payment', paymentSchema);
