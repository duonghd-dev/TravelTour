

import apiService from '../../../services/api/apiService.js';


export const registerUser = async (userData) => {
  return apiService.post('/api/auth/register', {
    email: userData.email,
    password: userData.password,
    firstName: userData.firstName,
    lastName: userData.lastName,
    phone: userData.phone,
  });
};


export const verifyEmail = async (userId, otp) => {
  return apiService.post('/api/auth/verify-email', {
    userId,
    otp,
  });
};


export const loginUser = async (credentials) => {
  return apiService.post('/api/auth/login', {
    email: credentials.email,
    password: credentials.password,
  });
};


export const verifyLoginOTP = async (userId, otp) => {
  return apiService.post('/api/auth/verify-login-otp', {
    userId,
    otp,
  });
};


export const forgotPassword = async (email) => {
  return apiService.post('/api/auth/forgot-password', {
    email,
  });
};


export const verifyResetPasswordOTP = async (email, otp) => {
  return apiService.post('/api/auth/verify-reset-password-otp', {
    email,
    otp,
  });
};


export const resetPassword = async (email, otp, newPassword) => {
  return apiService.post('/api/auth/reset-password', {
    email,
    otp,
    newPassword,
  });
};


export const getCurrentUser = async () => {
  return apiService.get('/api/v1/users/profile');
};


export const updateUserProfile = async (profileData) => {
  return apiService.put('/api/v1/users/profile', profileData);
};


export const changePassword = async (oldPassword, newPassword) => {
  return apiService.put('/api/v1/users/password', {
    oldPassword,
    newPassword,
  });
};


export const verifyEmailPage = async (email, otp) => {
  return apiService.post('/api/v1/users/verify-email', {
    email,
    otp,
  });
};
