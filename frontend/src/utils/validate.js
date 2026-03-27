/**
 * Object chứa các hàm validation
 */
const validate = {
  // Email validation
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Password validation (min 6 chars)
  password: (password) => {
    return password && password.length >= 6;
  },

  // Phone validation (Vietnamese)
  phone: (phone) => {
    const phoneRegex = /^(0|84)\d{9,10}$/;
    return phoneRegex.test(phone);
  },

  // Full name validation
  fullName: (name) => {
    return name && name.trim().length >= 2;
  },

  // URL validation
  url: (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  // Empty check
  isEmpty: (value) => {
    return (
      value === undefined ||
      value === null ||
      (typeof value === 'string' && value.trim() === '') ||
      (Array.isArray(value) && value.length === 0) ||
      (typeof value === 'object' && Object.keys(value).length === 0)
    );
  },

  // Min length
  minLength: (value, min) => {
    return value && value.length >= min;
  },

  // Max length
  maxLength: (value, max) => {
    return value && value.length <= max;
  },

  // Number validation
  isNumber: (value) => {
    return !isNaN(value) && isFinite(value);
  },

  // Positive number
  isPositive: (value) => {
    return validate.isNumber(value) && value > 0;
  },
};

export default validate;
