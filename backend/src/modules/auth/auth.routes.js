import express from 'express';
import passport from 'passport';
import * as authController from './auth.controller.js';
import { otpLimiter } from '../../config/security.js';
import asyncHandler from '../../common/utils/asyncHandler.js';

const router = express.Router();

/**
 * Auth Routes
 * Protected with rate limiting and async error handling
 */

// ==================== REGISTRATION & EMAIL VERIFICATION ====================
// 📝 Register (rate limited in app.js)
router.post('/register', asyncHandler(authController.handleRegister));

// ✅ Verify email (OTP rate limited)
router.post(
  '/verify-email',
  otpLimiter,
  asyncHandler(authController.handleVerifyEmail)
);

// ==================== LOGIN WITH 2FA ====================
// 🔐 Login (rate limited in app.js)
router.post('/login', asyncHandler(authController.handleLogin));

// ✅ Verify login OTP (OTP rate limited)
router.post(
  '/verify-login-otp',
  otpLimiter,
  asyncHandler(authController.handleVerifyLoginOTP)
);

// ==================== PASSWORD RESET ====================
// 🔄 Forgot password
router.post(
  '/forgot-password',
  asyncHandler(authController.handleForgotPassword)
);

// ✅ Verify reset password OTP
router.post(
  '/verify-reset-password-otp',
  otpLimiter,
  asyncHandler(authController.handleVerifyResetPasswordOTP)
);

// 🔑 Reset password
router.post(
  '/reset-password',
  asyncHandler(authController.handleResetPassword)
);

// ==================== OAUTH ====================
// 🔐 Google OAuth
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/login' }),
  asyncHandler(authController.handleGoogleCallback)
);

// 🔐 Facebook OAuth
router.get(
  '/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/auth/login' }),
  asyncHandler(authController.handleFacebookCallback)
);

export default router;
