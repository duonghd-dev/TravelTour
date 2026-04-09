import User from '../user/user.model.js';
import { hashPassword, comparePassword } from '../../common/utils/hash.js';
import { generateToken } from '../../common/utils/jwt.js';
import { generateOTP, getOTPExpiration } from '../../common/utils/otp.js';
import {
  sendOTPEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
} from '../../common/utils/email.js';
import { hashData, verifyHash } from '../../common/utils/encryption.js';
import * as authValidator from './auth.validator.js';
import { OTP_CONFIG } from '../../config/constants.js';


const checkOTPRateLimit = (user, type = 'email') => {
  const now = Date.now();

  
  const lastSentField = `${type}OTPLastSent`;
  const countField = `${type}OTPSendCount`;
  const windowField = `${type}OTPSendWindow`;

  
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

  
  if (timeSinceLastSent < OTP_CONFIG.COOLDOWN_TIME) {
    const remainingSeconds = Math.ceil(
      (OTP_CONFIG.COOLDOWN_TIME - timeSinceLastSent) / 1000
    );
    throw new Error(
      `Please wait ${remainingSeconds} seconds before requesting OTP again`
    );
  }

  
  if (timeSinceWindow > OTP_CONFIG.RATE_LIMIT_WINDOW) {
    user[countField] = 0;
    user[windowField] = now;
  }

  
  if (user[countField] >= OTP_CONFIG.MAX_ATTEMPTS) {
    throw new Error(
      `Too many OTP requests. Please try again in ${Math.ceil(OTP_CONFIG.RATE_LIMIT_WINDOW / (60 * 1000))} minutes`
    );
  }
};


const updateOTPTracking = (user, type = 'email') => {
  const lastSentField = `${type}OTPLastSent`;
  const countField = `${type}OTPSendCount`;

  user[lastSentField] = Date.now();
  user[countField] = (user[countField] || 0) + 1;
};


export const register = async (data) => {
  const { email, password, firstName, lastName, phone, gender } = data;

  
  authValidator.validateRegisterData(data);

  
  const existEmail = await User.findOne({ email });
  if (existEmail) throw new Error('Email already exists');

  
  if (phone) {
    const existPhone = await User.findOne({ phone });
    if (existPhone) throw new Error('Phone number already exists');
  }

  
  const otp = generateOTP();
  const otpExpire = getOTPExpiration();

  
  const hashedOTP = hashData(otp);

  
  const hashedPassword = await hashPassword(password);

  
  const userGender = gender || 'other';
  
  const avatar = null;

  try {
    
    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone: phone || null,
      gender: userGender,
      avatar: avatar,
      emailOTP: hashedOTP, 
      emailOTPExpire: otpExpire,
      isEmailVerified: false,
      role: 'customer',
    });

    
    await sendOTPEmail(email, otp);

    return {
      message:
        'Registration successful. Please verify your email with the OTP sent.',
      userId: user._id,
      email: user.email,
    };
  } catch (error) {
    
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


export const verifyEmail = async (userId, otp) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  if (user.isEmailVerified) throw new Error('Email already verified');

  
  const otpString = String(otp).trim();
  const isValidOTP = verifyHash(otpString, user.emailOTP);

  
  const isValidDev =
    process.env.NODE_ENV === 'development' && otpString === '000000';

  if (!isValidOTP && !isValidDev) throw new Error('Invalid OTP');

  
  if (new Date() > user.emailOTPExpire) throw new Error('OTP has expired');

  
  user.isEmailVerified = true;
  user.emailOTP = null;
  user.emailOTPExpire = null;
  await user.save();

  
  await sendWelcomeEmail(user.email, user.firstName);

  
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
      role: user.role,
    },
  };
};


export const login = async (data) => {
  const { email, password } = data;

  const user = await User.findOne({ email });
  if (!user) throw new Error('Email not found');

  
  if (!user.isEmailVerified)
    throw new Error('Email not verified. Please verify your email first.');

  
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) throw new Error('Incorrect password');

  
  if (!user.twoFactorEnabled) {
    
    user.lastLoginAt = new Date();
    user.isFirstLogin = false;
    await user.save();

    
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

  
  
  checkOTPRateLimit(user, 'login');

  
  const otp = generateOTP();
  const otpExpire = getOTPExpiration();

  
  const hashedOTP = hashData(otp);

  user.loginOTP = hashedOTP; 
  user.loginOTPExpire = otpExpire;

  
  updateOTPTracking(user, 'login');

  await user.save();

  
  await sendOTPEmail(email, otp);

  return {
    message: 'OTP sent to your email. Please verify to complete login.',
    userId: user._id,
    email: user.email,
    requiresOTP: true,
  };
};


export const verifyLoginOTP = async (userId, otp) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  
  const otpString = String(otp).trim();
  const isValidOTP = verifyHash(otpString, user.loginOTP);

  if (!isValidOTP) throw new Error('Invalid OTP');

  
  if (new Date() > user.loginOTPExpire) throw new Error('OTP has expired');

  
  user.lastLoginAt = new Date();
  user.loginOTP = null;
  user.loginOTPExpire = null;
  user.isFirstLogin = false;
  await user.save();

  
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


export const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Email not found');

  
  checkOTPRateLimit(user, 'reset');

  
  const otp = generateOTP();
  const otpExpire = getOTPExpiration();

  
  const hashedOTP = hashData(otp);

  user.resetPasswordOTP = hashedOTP; 
  user.resetPasswordExpire = otpExpire;

  
  updateOTPTracking(user, 'reset');

  await user.save();

  
  await sendPasswordResetEmail(email, otp);

  return {
    message: 'OTP sent to your email. Please verify to reset password.',
    email: user.email,
  };
};


export const verifyResetPasswordOTP = async (email, otp) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found');

  
  const otpString = String(otp).trim();
  const isValidOTP = verifyHash(otpString, user.resetPasswordOTP);

  if (!isValidOTP) throw new Error('Invalid OTP');

  
  if (new Date() > user.resetPasswordExpire) throw new Error('OTP has expired');

  return {
    message: 'OTP verified. You can now reset your password.',
    userId: user._id,
  };
};


export const resetPassword = async (email, otp, newPassword) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found');

  
  const otpString = String(otp).trim();
  const isValidOTP = verifyHash(otpString, user.resetPasswordOTP);

  if (!isValidOTP) throw new Error('Invalid OTP');

  
  if (new Date() > user.resetPasswordExpire) throw new Error('OTP has expired');

  
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


export const oauthLogin = async (user) => {
  if (!user) throw new Error('User not found');

  
  if (!user.isEmailVerified) {
    user.isEmailVerified = true;
    await user.save();
  }

  
  user.lastLoginAt = new Date();
  user.isFirstLogin = false;
  await user.save();

  
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
