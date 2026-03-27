// OTP Configuration for anti-spam
export const OTP_CONFIG = {
  // Rate limiting: tối đa bao nhiêu lần gửi OTP trong time window
  MAX_ATTEMPTS: 5, // 5 lần gửi
  RATE_LIMIT_WINDOW: 60 * 60 * 1000, // 1 hour (ms)
  COOLDOWN_TIME: 2 * 60 * 1000, // 2 minutes (ms) - minimum time between sending
  OTP_EXPIRY: 10 * 60 * 1000, // 10 minutes (ms)
};

// User Roles
export const USER_ROLES = {
  CUSTOMER: 'customer',
  ARTISAN: 'artisan',
  ADMIN: 'admin',
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  RATE_LIMIT: 429,
  SERVER_ERROR: 500,
};
