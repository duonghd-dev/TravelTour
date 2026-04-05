import User from '../user/user.model.js';
import { hashPassword, comparePassword } from '../../common/utils/hash.js';
import { generateToken } from '../../common/utils/jwt.js';
import { generateOTP, getOTPExpiration } from '../../common/utils/otp.js';
import {
  sendOTPEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
} from '../../common/utils/email.js';
import * as authValidator from './auth.validator.js';
import { OTP_CONFIG } from '../../config/constants.js';

/**
 * Check OTP rate limiting - chống spam gửi OTP
 * @param {Object} user - User object
 * @param {string} type - OTP type: 'email', 'login', 'reset'
 * @throws {Error} nếu vượt quá limit
 */
const checkOTPRateLimit = (user, type = 'email') => {
  const now = Date.now();

  // Field names based on type
  const lastSentField = `${type}OTPLastSent`;
  const countField = `${type}OTPSendCount`;
  const windowField = `${type}OTPSendWindow`;

  // Initialize if not exists
  if (!user[lastSentField]) {
    user[lastSentField] = 0;
  }
  if (!user[countField]) {
    user[countField] = 0;
  }
  if (!user[windowField]) {
    user[windowField] = now;
  }

  const timeSinceLastSent = now - user[lastSentField];
  const timeSinceWindow = now - user[windowField];

  // Check cooldown: phải chờ ít nhất COOLDOWN_TIME giữa các lần gửi
  if (timeSinceLastSent < OTP_CONFIG.COOLDOWN_TIME) {
    const remainingSeconds = Math.ceil(
      (OTP_CONFIG.COOLDOWN_TIME - timeSinceLastSent) / 1000
    );
    throw new Error(
      `Please wait ${remainingSeconds} seconds before requesting OTP again`
    );
  }

  // Reset counter nếu window expired
  if (timeSinceWindow > OTP_CONFIG.RATE_LIMIT_WINDOW) {
    user[countField] = 0;
    user[windowField] = now;
  }

  // Check max attempts: vượt quá tối đa lần gửi trong time window
  if (user[countField] >= OTP_CONFIG.MAX_ATTEMPTS) {
    throw new Error(
      `Too many OTP requests. Please try again in ${Math.ceil(OTP_CONFIG.RATE_LIMIT_WINDOW / (60 * 1000))} minutes`
    );
  }
};

/**
 * Update OTP send tracking
 */
const updateOTPTracking = (user, type = 'email') => {
  const lastSentField = `${type}OTPLastSent`;
  const countField = `${type}OTPSendCount`;

  user[lastSentField] = Date.now();
  user[countField] = (user[countField] || 0) + 1;
};

// 📝 REGISTER - Tạo tài khoản mới và gửi OTP xác thực email
export const register = async (data) => {
  const { email, password, firstName, lastName, phone, gender } = data;

  // Validate input data
  authValidator.validateRegisterData(data);

  // Kiểm tra email đã tồn tại
  const existEmail = await User.findOne({ email });
  if (existEmail) throw new Error('Email already exists');

  // Kiểm tra phone đã tồn tại (nếu được provide)
  if (phone) {
    const existPhone = await User.findOne({ phone });
    if (existPhone) throw new Error('Phone number already exists');
  }

  // Tạo OTP
  const otp = generateOTP();
  const otpExpire = getOTPExpiration();

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Set default avatar based on gender
  const userGender = gender || 'other';
  let defaultAvatar = null;
  if (userGender === 'male') {
    defaultAvatar = 'assets/images/avatarDefault/maleAvatar.png';
  } else if (userGender === 'female') {
    defaultAvatar = 'assets/images/avatarDefault/femaleAvatar.png';
  }

  try {
    // Tạo user với trạng thái chưa verify email
    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone: phone || null,
      gender: userGender,
      avatar: defaultAvatar,
      emailOTP: otp,
      emailOTPExpire: otpExpire,
      isEmailVerified: false,
      role: 'customer',
    });

    // Gửi OTP qua email
    await sendOTPEmail(email, otp);

    return {
      message:
        'Registration successful. Please verify your email with the OTP sent.',
      userId: user._id,
      email: user.email,
    };
  } catch (error) {
    // Handle MongoDB unique constraint error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      if (field === 'email') {
        throw new Error('Email already exists');
      } else if (field === 'phone') {
        throw new Error('Phone number already exists');
      }
    }
    throw error;
  }
};

// ✅ VERIFY EMAIL - Xác thực email bằng OTP
export const verifyEmail = async (userId, otp) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  if (user.isEmailVerified) throw new Error('Email already verified');

  // Kiểm tra OTP (trim & convert to string for comparison)
  const otpString = String(otp).trim();
  const savedOtp = String(user.emailOTP || '').trim();

  console.log('🔍 OTP Verification Debug:');
  console.log('  Received OTP:', otpString);
  console.log('  Saved OTP:', savedOtp);
  console.log('  Match:', savedOtp === otpString);

  if (savedOtp !== otpString) throw new Error('Invalid OTP');

  // Kiểm tra OTP hết hạn
  if (new Date() > user.emailOTPExpire) throw new Error('OTP has expired');

  // Cập nhật trạng thái verify
  user.isEmailVerified = true;
  user.emailOTP = null;
  user.emailOTPExpire = null;
  await user.save();

  // Gửi email chào mừng
  await sendWelcomeEmail(user.email, user.firstName);

  // Tạo JWT token để tự động đăng nhập (convert ObjectId to string)
  const token = generateToken({ userId: user._id.toString(), role: user.role });

  return {
    message: 'Email verified successfully. You are now logged in.',
    token,
    user: {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar || null,
      gender: user.gender || 'other',
      role: user.role, // ✅ ADD ROLE
    },
  };
};

// 🔐 LOGIN - Đăng nhập với xác thực 2FA tùy chọn
export const login = async (data) => {
  const { email, password } = data;

  const user = await User.findOne({ email });
  if (!user) throw new Error('Email not found');

  // Kiểm tra email verified
  if (!user.isEmailVerified)
    throw new Error('Email not verified. Please verify your email first.');

  // Kiểm tra password
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) throw new Error('Incorrect password');

  // ✅ NẾU 2FA KHÔNG BẬT - ĐĂNG NHẬP NGAY LẬP TỨC
  if (!user.twoFactorEnabled) {
    // Cập nhật lần login cuối và đánh dấu first login đã xong
    user.lastLoginAt = new Date();
    user.isFirstLogin = false;
    await user.save();

    // Tạo JWT token (convert ObjectId to string)
    const token = generateToken({
      userId: user._id.toString(),
      role: user.role,
    });

    return {
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        lastLoginAt: user.lastLoginAt,
        avatar: user.avatar || null,
        gender: user.gender || 'other',
      },
    };
  }

  // ⚠️ NẾU 2FA BẬT - GỬI OTP 2FA
  // Check OTP rate limit - chống spam 2FA
  checkOTPRateLimit(user, 'login');

  // Tạo OTP 2FA
  const otp = generateOTP();
  const otpExpire = getOTPExpiration();

  user.loginOTP = otp;
  user.loginOTPExpire = otpExpire;

  // Update OTP send tracking
  updateOTPTracking(user, 'login');

  await user.save();

  // Gửi OTP qua email
  await sendOTPEmail(email, otp);

  return {
    message: 'OTP sent to your email. Please verify to complete login.',
    userId: user._id,
    email: user.email,
    requiresOTP: true,
  };
};

// ✅ VERIFY LOGIN OTP - Xác thực 2FA
export const verifyLoginOTP = async (userId, otp) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  // Kiểm tra OTP (trim & convert to string for comparison)
  const otpString = String(otp).trim();
  const savedOtp = String(user.loginOTP).trim();
  if (savedOtp !== otpString) throw new Error('Invalid OTP');

  // Kiểm tra OTP hết hạn
  if (new Date() > user.loginOTPExpire) throw new Error('OTP has expired');

  // Cập nhật lần login cuối
  user.lastLoginAt = new Date();
  user.loginOTP = null;
  user.loginOTPExpire = null;
  user.isFirstLogin = false;
  await user.save();

  // Tạo JWT token (convert ObjectId to string)
  const token = generateToken({ userId: user._id.toString(), role: user.role });

  return {
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      lastLoginAt: user.lastLoginAt,
      avatar: user.avatar || null,
      gender: user.gender || 'other',
    },
  };
};

// 🔄 FORGOT PASSWORD - Gửi OTP reset password
export const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Email not found');

  // ⚠️ Check OTP rate limit - chống spam
  checkOTPRateLimit(user, 'reset');

  // Tạo OTP
  const otp = generateOTP();
  const otpExpire = getOTPExpiration();

  user.resetPasswordOTP = otp;
  user.resetPasswordExpire = otpExpire;

  // Update OTP send tracking
  updateOTPTracking(user, 'reset');

  await user.save();

  // Gửi OTP qua email
  await sendPasswordResetEmail(email, otp);

  return {
    message: 'OTP sent to your email. Please verify to reset password.',
    email: user.email,
  };
};

// ✅ VERIFY RESET PASSWORD OTP - Xác thực reset password
export const verifyResetPasswordOTP = async (email, otp) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found');

  // Kiểm tra OTP (trim & convert to string for comparison)
  const otpString = String(otp).trim();
  const savedOtp = String(user.resetPasswordOTP).trim();
  if (savedOtp !== otpString) throw new Error('Invalid OTP');

  // Kiểm tra OTP hết hạn
  if (new Date() > user.resetPasswordExpire) throw new Error('OTP has expired');

  return {
    message: 'OTP verified. You can now reset your password.',
    userId: user._id,
  };
};

// 🔑 RESET PASSWORD - Cập nhật mật khẩu mới
export const resetPassword = async (email, otp, newPassword) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found');

  // Kiểm tra OTP lại (security check - trim & convert to string)
  const otpString = String(otp).trim();
  const savedOtp = String(user.resetPasswordOTP).trim();
  if (savedOtp !== otpString) throw new Error('Invalid OTP');

  // Kiểm tra OTP hết hạn
  if (new Date() > user.resetPasswordExpire) throw new Error('OTP has expired');

  // Hash password mới
  const hashedPassword = await hashPassword(newPassword);

  user.password = hashedPassword;
  user.resetPasswordOTP = null;
  user.resetPasswordExpire = null;
  await user.save();

  return {
    message:
      'Password reset successfully. Please login with your new password.',
  };
};

// 🔐 OAUTH LOGIN - Đăng nhập bằng Google/Facebook
export const oauthLogin = async (user) => {
  if (!user) throw new Error('User not found');

  // Nếu user chưa verify email (dành cho Facebook không cung cấp email)
  if (!user.isEmailVerified) {
    user.isEmailVerified = true;
    await user.save();
  }

  // Cập nhật lần login cuối
  user.lastLoginAt = new Date();
  user.isFirstLogin = false;
  await user.save();

  // Tạo JWT token (convert ObjectId to string)
  const token = generateToken({ userId: user._id.toString(), role: user.role });

  return {
    message: 'OAuth login successful',
    token,
    user: {
      id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      lastLoginAt: user.lastLoginAt,
      avatar: user.avatar || null,
      gender: user.gender || 'other',
    },
  };
};
