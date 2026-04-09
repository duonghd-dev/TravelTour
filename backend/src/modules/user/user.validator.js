
export const validateUpdateProfile = (data) => {
  const { firstName, lastName, email, phoneNumber, avatar, gender } = data;

  if (firstName && typeof firstName !== 'string') {
    throw new Error('firstName must be a string');
  }

  if (firstName && firstName.trim().length < 2) {
    throw new Error('firstName must be at least 2 characters');
  }

  if (lastName && typeof lastName !== 'string') {
    throw new Error('lastName must be a string');
  }

  if (lastName && lastName.trim().length < 2) {
    throw new Error('lastName must be at least 2 characters');
  }

  if (email && typeof email !== 'string') {
    throw new Error('email must be a string');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRegex.test(email)) {
    throw new Error('email is invalid');
  }

  if (phoneNumber && typeof phoneNumber !== 'string') {
    throw new Error('phoneNumber must be a string');
  }

  if (phoneNumber && phoneNumber.trim().length < 10) {
    throw new Error('phoneNumber must be at least 10 characters');
  }

  if (avatar && typeof avatar !== 'string') {
    throw new Error('avatar must be a string');
  }

  if (gender && !['male', 'female', 'other'].includes(gender)) {
    throw new Error('gender must be one of: male, female, other');
  }
};


export const validatePasswordUpdate = (data) => {
  const { currentPassword, newPassword } = data;

  if (!currentPassword || typeof currentPassword !== 'string') {
    throw new Error('currentPassword is required');
  }

  if (!newPassword || typeof newPassword !== 'string') {
    throw new Error('newPassword is required');
  }

  if (newPassword.length < 8) {
    throw new Error('newPassword must be at least 8 characters');
  }

  if (currentPassword === newPassword) {
    throw new Error('newPassword must be different from currentPassword');
  }
};


export const validateTwoFactorAuth = (data) => {
  const { enabled } = data;

  if (typeof enabled !== 'boolean') {
    throw new Error('enabled must be a boolean');
  }
};
