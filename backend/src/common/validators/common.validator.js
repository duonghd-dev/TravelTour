


export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};


export const validatePhone = (phone) => {
  if (!phone) return true; 
  const phoneRegex = /^[0-9]{10,}$/;
  return phoneRegex.test(phone.replace(/[^0-9]/g, ''));
};


export const validatePassword = (password) => {
  return password && password.length >= 6;
};


export const validateRequired = (fields, data) => {
  const missingFields = fields.filter(
    (field) =>
      !data[field] || (typeof data[field] === 'string' && !data[field].trim())
  );

  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }
};


export const validateEnum = (field, value, allowedValues) => {
  if (!allowedValues.includes(value)) {
    throw new Error(`${field} must be one of: ${allowedValues.join(', ')}`);
  }
};


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


export const validateNumber = (field, value, min, max) => {
  if (typeof value !== 'number') {
    throw new Error(`${field} must be a number`);
  }
  if (value < min || value > max) {
    throw new Error(`${field} must be between ${min} and ${max}`);
  }
};
