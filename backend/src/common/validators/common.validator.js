/**
 * Common Validators
 * Các validator dùng chung cho toàn bộ ứng dụng
 */

// ✅ Email Validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// ✅ Phone Validation (10+ digits)
export const validatePhone = (phone) => {
  if (!phone) return true; // Phone is optional
  const phoneRegex = /^[0-9]{10,}$/;
  return phoneRegex.test(phone.replace(/[^0-9]/g, ''));
};

// ✅ Password Validation (min 6 characters)
export const validatePassword = (password) => {
  return password && password.length >= 6;
};

// ✅ Validate required fields
export const validateRequired = (fields, data) => {
  const missingFields = fields.filter(
    (field) =>
      !data[field] || (typeof data[field] === 'string' && !data[field].trim())
  );

  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }
};

// ✅ Validate enum values
export const validateEnum = (field, value, allowedValues) => {
  if (!allowedValues.includes(value)) {
    throw new Error(`${field} must be one of: ${allowedValues.join(', ')}`);
  }
};

// ✅ Validate string length
export const validateStringLength = (field, value, min, max) => {
  if (typeof value !== 'string') {
    throw new Error(`${field} must be a string`);
  }
  if (value.length < min) {
    throw new Error(`${field} must be at least ${min} characters`);
  }
  if (value.length > max) {
    throw new Error(`${field} must be at most ${max} characters`);
  }
};

// ✅ Validate number range
export const validateNumber = (field, value, min, max) => {
  if (typeof value !== 'number') {
    throw new Error(`${field} must be a number`);
  }
  if (value < min || value > max) {
    throw new Error(`${field} must be between ${min} and ${max}`);
  }
};
