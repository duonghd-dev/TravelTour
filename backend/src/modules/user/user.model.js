import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    // 🧑 Thông tin cá nhân
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
      default: null,
      sparse: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      default: 'other',
    },
    dateOfBirth: {
      type: Date,
    },
    address: {
      type: String,
      default: '',
    },

    // 📧 Đăng nhập
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      sparse: true,
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
    },

    // 🔐 Xác thực email
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailOTP: {
      type: String,
      default: null,
    },
    emailOTPExpire: {
      type: Date,
      default: null,
    },

    // 🔐 2FA Status
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },

    // 🔐 Reset Password OTP
    resetPasswordOTP: {
      type: String,
      default: null,
    },
    resetPasswordExpire: {
      type: Date,
      default: null,
    },

    // ℹ️ NOTE: OTP & OAuth data architecture:
    // - EmailOTP/EmailOTPExpire: for email verification OTP (stored on User)
    // - resetPasswordOTP/resetPasswordExpire: for password reset OTP (stored on User)
    // - LoginOTP: for 2FA login OTP (can be moved to separate collection if needed)
    // - OAuthProvider: for OAuth provider data (Google, Facebook, etc.) (can be moved if needed)

    // 👤 Role
    role: {
      type: String,
      enum: ['admin', 'staff', 'artisan', 'customer'],
      default: 'customer',
    },

    // 👑 Admin tạo tài khoản
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },

    // 🟡 Lần login đầu
    isFirstLogin: {
      type: Boolean,
      default: true,
    },

    // 📊 Trạng thái
    isActive: {
      type: Boolean,
      default: true,
    },

    // ❤️ Favorites
    favorites: [
      {
        itemId: {
          type: Schema.Types.ObjectId,
          required: true,
        },
        itemType: {
          type: String,
          enum: ['experience', 'hotel', 'tour', 'artisan'],
          required: true,
        },
        savedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // 🕒 Tracking
    lastLoginAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const User = model('User', userSchema);
export default User;
