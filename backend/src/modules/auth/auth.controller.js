import * as authService from './auth.service.js';
import asyncHandler from '../../common/utils/asyncHandler.js';
import AppError from '../../common/errors/AppError.js';




export const handleRegister = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  res.status(201).json({
    success: true,
    message: 'Registration successful. Please verify your email.',
    data: result,
  });
});


export const handleVerifyEmail = asyncHandler(async (req, res) => {
  const { userId, otp } = req.body;

  if (!userId || !otp) {
    throw new AppError('userId and otp are required', 400);
  }

  const result = await authService.verifyEmail(userId, otp);
  res.json({
    success: true,
    message: 'Email verified successfully.',
    data: result,
  });
});


export const handleLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }

  const result = await authService.login(req.body);
  res.json({
    success: true,
    message: 'Login successful. Please verify OTP.',
    data: result,
  });
});


export const handleVerifyLoginOTP = asyncHandler(async (req, res) => {
  const { userId, otp } = req.body;

  if (!userId || !otp) {
    throw new AppError('userId and otp are required', 400);
  }

  const result = await authService.verifyLoginOTP(userId, otp);
  res.json({
    success: true,
    message: 'Login verified successfully.',
    data: result,
  });
});


export const handleForgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new AppError('Email is required', 400);
  }

  const result = await authService.forgotPassword(email);
  res.json({
    success: true,
    message: 'OTP sent to your email.',
    data: result,
  });
});


export const handleVerifyResetPasswordOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new AppError('Email and otp are required', 400);
  }

  const result = await authService.verifyResetPasswordOTP(email, otp);
  res.json({
    success: true,
    message: 'OTP verified. You can now reset your password.',
    data: result,
  });
});


export const handleResetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    throw new AppError('Email, otp, and newPassword are required', 400);
  }

  if (newPassword.length < 6) {
    throw new AppError('Password must be at least 6 characters', 400);
  }

  const result = await authService.resetPassword(email, otp, newPassword);
  res.json({
    success: true,
    message: 'Password reset successfully.',
    data: result,
  });
});


export const handleGoogleCallback = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new AppError('Authentication failed', 401);
  }

  const result = await authService.oauthLogin(req.user);

  
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  res.redirect(
    `${frontendUrl}/auth/oauth-success?token=${result.token}&role=${result.user.role}`
  );
});


export const handleFacebookCallback = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new AppError('Authentication failed', 401);
  }

  const result = await authService.oauthLogin(req.user);

  
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  res.redirect(
    `${frontendUrl}/auth/oauth-success?token=${result.token}&role=${result.user.role}`
  );
});
