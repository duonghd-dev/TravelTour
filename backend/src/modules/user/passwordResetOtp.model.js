import mongoose from 'mongoose';

const { Schema, model } = mongoose;

/**
 * PasswordResetOTP Model - Quản lý OTP khôi phục mật khẩu
 * Tách từ User model để tuân thủ NF3
 */
const passwordResetOtpSchema = new Schema(
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
passwordResetOtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const PasswordResetOTP = model('PasswordResetOTP', passwordResetOtpSchema);
export default PasswordResetOTP;
