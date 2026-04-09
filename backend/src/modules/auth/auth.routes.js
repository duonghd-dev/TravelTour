import express from 'express';
import passport from 'passport';
import * as authController from './auth.controller.js';
import { otpLimiter } from '../../config/security.js';
import asyncHandler from '../../common/utils/asyncHandler.js';

const router = express.Router();





router.post('/register', asyncHandler(authController.handleRegister));


router.post(
  '/verify-email',
  otpLimiter,
  asyncHandler(authController.handleVerifyEmail)
);



router.post('/login', asyncHandler(authController.handleLogin));


router.post(
  '/verify-login-otp',
  otpLimiter,
  asyncHandler(authController.handleVerifyLoginOTP)
);



router.post(
  '/forgot-password',
  asyncHandler(authController.handleForgotPassword)
);


router.post(
  '/verify-reset-password-otp',
  otpLimiter,
  asyncHandler(authController.handleVerifyResetPasswordOTP)
);


router.post(
  '/reset-password',
  asyncHandler(authController.handleResetPassword)
);



router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/login' }),
  asyncHandler(authController.handleGoogleCallback)
);


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
