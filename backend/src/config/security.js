import rateLimit from 'express-rate-limit';


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
    maxAge: 24 * 60 * 60 * 1000, 
    sameSite: 'lax',
  },
};

export const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, 
  max: 100, 
};


export const otpLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 3, 
  message: 'Quá nhiều yêu cầu OTP, vui lòng thử lại sau.',
});


export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  message: 'Quá nhiều yêu cầu đăng nhập, vui lòng thử lại sau.',
  skipSuccessfulRequests: true,
});


export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: process.env.NODE_ENV === 'production' ? 500 : 10000, 
  message: 'Quá nhiều yêu cầu, vui lòng thử lại sau.',
  skip: (req, res) => process.env.NODE_ENV !== 'production', 
});
