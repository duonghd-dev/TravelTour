// Generate random 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Get OTP expiration time (10 minutes from now)
export const getOTPExpiration = () => {
  const now = new Date();
  return new Date(now.getTime() + 10 * 60000); // 10 minutes
};
