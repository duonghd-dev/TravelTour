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

    // ℹ️ NOTE: OTP & OAuth data moved to separate collections:
    // - EmailOTP: for email verification OTP
    // - LoginOTP: for 2FA login OTP
    // - PasswordResetOTP: for password reset OTP
    // - OAuthProvider: for OAuth provider data (Google, Facebook, etc.)
    // This follows NF3 normalization to avoid data redundancy

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
