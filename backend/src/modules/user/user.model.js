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

    // 🔐 OAuth Providers
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    facebookId: {
      type: String,
      unique: true,
      sparse: true,
    },
    googleEmail: {
      type: String,
    },
    facebookEmail: {
      type: String,
    },

    // 🔐 Xác thực email
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailOTP: {
      type: String,
    },
    emailOTPExpire: {
      type: Date,
    },

    // 🔐 OTP đăng nhập (2FA)
    loginOTP: {
      type: String,
    },
    loginOTPExpire: {
      type: Date,
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },

    // 🔁 Quên mật khẩu
    resetPasswordOTP: {
      type: String,
    },
    resetPasswordExpire: {
      type: Date,
    },

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
