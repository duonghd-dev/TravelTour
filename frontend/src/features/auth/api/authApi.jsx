/**
 * Authentication API Service
 * Handle all auth-related API calls
 * Uses centralized apiService for consistency
 */

import apiService from '../../../services/api/apiService.js';

/**
 * Register new user
 */
export const registerUser = async (userData) => {
  return apiService.post('/auth/register', {
    email: userData.email,
    password: userData.password,
    firstName: userData.firstName,
    lastName: userData.lastName,
    phone: userData.phone,
  });
};

/**
 * Verify email with OTP
 */
export const verifyEmail = async (userId, otp) => {
  return apiService.post('/auth/verify-email', {
    userId,
    otp,
  });
};

/**
 * Login with email and password
 */
export const loginUser = async (credentials) => {
  return apiService.post('/auth/login', {
    email: credentials.email,
    password: credentials.password,
  });
};

/**
 * Verify login OTP (2FA)
 */
export const verifyLoginOTP = async (userId, otp) => {
  return apiService.post('/auth/verify-login-otp', {
    userId,
    otp,
  });
};

/**
 * Request password reset OTP
 */
export const forgotPassword = async (email) => {
  return apiService.post('/auth/forgot-password', {
    email,
  });
};

/**
 * Verify reset password OTP
 */
export const verifyResetPasswordOTP = async (email, otp) => {
  return apiService.post('/auth/verify-reset-password-otp', {
    email,
    otp,
  });
};

/**
 * Reset password
 */
export const resetPassword = async (email, otp, newPassword) => {
  return apiService.post('/auth/reset-password', {
    email,
    otp,
    newPassword,
  });
};

/**
 * Get authenticated user profile
 */
export const getCurrentUser = async () => {
  return apiService.get('/v1/users/profile');
};

/**
 * Update user profile
 */
export const updateUserProfile = async (profileData) => {
  return apiService.put('/v1/users/profile', profileData);
};

/**
 * Change password
 */
export const changePassword = async (oldPassword, newPassword) => {
  return apiService.put('/v1/users/password', {
    oldPassword,
    newPassword,
  });
};

/**
 * Verify email from verification link (non-registration flow)
 */
export const verifyEmailPage = async (email, otp) => {
  return apiService.post('/v1/users/verify-email', {
    email,
    otp,
  });
};
