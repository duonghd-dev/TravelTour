import mongoose from 'mongoose';

const { Schema, model } = mongoose;

/**
 * EmailOTP Model - Quản lý OTP xác thực email
 * Tách từ User model để tuân thủ NF3
 */
const emailOtpSchema = new Schema(
  {
    // 🔗 Liên kết user
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },

    // 🔐 OTP
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },

    // 📊 Tracking
    sendCount: {
      type: Number,
      default: 1,
    },
    lastSentAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// TTL index - tự động xóa sau khi hết hạn
emailOtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const EmailOTP = model('EmailOTP', emailOtpSchema);
export default EmailOTP;
