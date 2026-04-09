const validate = {
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  password: (password) => {
    return password && password.length >= 6;
  },

  phone: (phone) => {
    const phoneRegex = /^(0|84)\d{9,10}$/;
    return phoneRegex.test(phone);
  },

  fullName: (name) => {
    return name && name.trim().length >= 2;
  },

  url: (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  isEmpty: (value) => {
    return (
      value === undefined ||
      value === null ||
      (typeof value === 'string' && value.trim() === '') ||
      (Array.isArray(value) && value.length === 0) ||
      (typeof value === 'object' && Object.keys(value).length === 0)
    );
  },

  minLength: (value, min) => {
    return value && value.length >= min;
  },

  maxLength: (value, max) => {
    return value && value.length <= max;
  },

  isNumber: (value) => {
    return !isNaN(value) && isFinite(value);
  },

  isPositive: (value) => {
    return validate.isNumber(value) && value > 0;
  },
};

export default validate;
