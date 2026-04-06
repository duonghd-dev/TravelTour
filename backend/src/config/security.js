import rateLimit from 'express-rate-limit';

// Security configuration
export const corsConfig = {
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:3000',
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

export const sessionConfig = {
  secret:
    process.env.SESSION_SECRET || 'your-session-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax',
  },
};

export const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
};

// OTP Rate Limiter
export const otpLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3, // max 3 requests per minute
  message: 'Quá nhiều yêu cầu OTP, vui lòng thử lại sau.',
});

// Auth Rate Limiter
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // max 5 requests per windowMs
  message: 'Quá nhiều yêu cầu đăng nhập, vui lòng thử lại sau.',
  skipSuccessfulRequests: true,
});

// General Rate Limiter
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max requests per windowMs
  message: 'Quá nhiều yêu cầu, vui lòng thử lại sau.',
});
