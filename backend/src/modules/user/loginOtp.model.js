import mongoose from 'mongoose';

const { Schema, model } = mongoose;

/**
 * LoginOTP Model - Quản lý OTP đăng nhập (2FA)
 * Tách từ User model để tuân thủ NF3
 */
const loginOtpSchema = new Schema(
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

    // 📊 Trạng thái
    isUsed: {
      type: Boolean,
      default: false,
    },

    // 📊 Tracking
    sentAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// TTL index - tự động xóa sau khi hết hạn
loginOtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const LoginOTP = model('LoginOTP', loginOtpSchema);
export default LoginOTP;
