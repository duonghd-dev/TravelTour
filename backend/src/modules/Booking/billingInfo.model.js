import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const billingInfoSchema = new Schema(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      unique: true,
      index: true,
    },

    encryptedData: {
      type: String,
      required: true,
    },
    iv: {
      type: String,
      required: true,
    },
    authTag: {
      type: String,
      required: true,
    },
    isEncrypted: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Indexes
billingInfoSchema.index({ bookingId: 1 }, { unique: true });
billingInfoSchema.index({ createdAt: 1 });

export default model('BillingInfo', billingInfoSchema);
