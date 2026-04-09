

import {
  validateEmail,
  validatePhone,
  validateRequired,
  validateEnum,
  validateStringLength,
} from '../validators/common.validator.js';
import AppError from '../errors/AppError.js';


export const validateUpdateProfileData = (data) => {
  const { firstName, lastName, phone, gender, slogan, address } = data;

  
  const updates = {};

  if (firstName !== undefined) {
    validateStringLength('firstName', firstName.trim(), 1, 50);
    updates.firstName = firstName.trim();
  }

  if (lastName !== undefined) {
    validateStringLength('lastName', lastName.trim(), 1, 50);
    updates.lastName = lastName.trim();
  }

  if (phone !== undefined && phone) {
    if (!validatePhone(phone)) {
      throw new AppError('Phone number must contain at least 10 digits', 400);
    }
    updates.phone = phone;
  }

  if (gender !== undefined && gender) {
    const validGenders = ['male', 'female', 'other'];
    validateEnum('gender', gender.toLowerCase(), validGenders);
    updates.gender = gender.toLowerCase();
  }

  if (slogan !== undefined) {
    if (slogan.length > 500) {
      throw new AppError('Slogan must be at most 500 characters', 400);
    }
    updates.slogan = slogan;
  }

  if (address !== undefined) {
    if (address.length > 200) {
      throw new AppError('Address must be at most 200 characters', 400);
    }
    updates.address = address;
  }

  return updates;
};


export const validateChangePasswordData = (data) => {
  const { oldPassword, newPassword, confirmPassword } = data;

  validateRequired(['oldPassword', 'newPassword', 'confirmPassword'], data);

  if (newPassword.length < 6) {
    throw new AppError('New password must be at least 6 characters', 400);
  }

  if (newPassword !== confirmPassword) {
    throw new AppError('Passwords do not match', 400);
  }

  if (oldPassword === newPassword) {
    throw new AppError('New password must be different from old password', 400);
  }

  return { oldPassword, newPassword };
};


export const validateAvatarData = (avatarData) => {
  if (!avatarData || typeof avatarData !== 'string') {
    throw new AppError('Avatar data is required', 400);
  }

  
  if (!avatarData.startsWith('data:image/')) {
    throw new AppError('Invalid image format', 400);
  }

  
  const sizeInBytes = Buffer.byteLength(avatarData, 'utf8');
  const maxSizeBytes = 5 * 1024 * 1024; 

  if (sizeInBytes > maxSizeBytes) {
    throw new AppError('Avatar size must be less than 5MB', 400);
  }

  return avatarData;
};
