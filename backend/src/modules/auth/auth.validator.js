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

// ✅ Password Validation
export const validatePassword = (password) => {
  return password && password.length >= 6;
};

// ✅ Register Data Validation
export const validateRegisterData = (data) => {
  const { email, password, firstName, lastName, phone, gender } = data;

  // Check required fields
  if (!firstName || !firstName.trim()) {
    throw new Error('First name is required');
  }
  if (!lastName || !lastName.trim()) {
    throw new Error('Last name is required');
  }
  if (!email || !email.trim()) {
    throw new Error('Email is required');
  }
  if (!password) {
    throw new Error('Password is required');
  }

  // Validate email format
  if (!validateEmail(email)) {
    throw new Error('Please enter a valid email address');
  }

  // Validate password length
  if (!validatePassword(password)) {
    throw new Error('Password must be at least 6 characters');
  }

  // Validate phone format if provided
  if (phone && !validatePhone(phone)) {
    throw new Error('Phone number must contain at least 10 digits');
  }

  // Validate gender if provided
  if (gender && !['male', 'female', 'other'].includes(gender)) {
    throw new Error('Gender must be one of: male, female, other');
  }

  return true;
};
