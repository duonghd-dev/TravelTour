import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import session from 'express-session';
import passport from './config/passport.js';
import errorHandler from './common/middleware/errorHandler.middleware.js';
import {
  corsConfig,
  generalLimiter,
  authLimiter,
  otpLimiter,
} from './config/security.js';

import authRoutes from './modules/auth/index.js';
import userRoutes from './modules/user/index.js';
import artisanRoutes from './modules/artisan/index.js';
import { chatRoutes } from './modules/chat/index.js';

const app = express();

// ==================== SECURITY & LOGGING ====================
// CORS Configuration
app.use(cors(corsConfig));

// Logging (Morgan)
app.use(morgan('dev'));

// Rate Limiting - Apply to all routes
app.use(generalLimiter);

// ==================== BODY PARSER ====================
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ==================== SESSION & AUTHENTICATION ====================
// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// ==================== API ROUTES ====================
// Auth routes (with rate limiting)
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/auth/verify-otp', otpLimiter); // Extra OTP rate limiting

// User routes
app.use('/api/v1/users', userRoutes);

// Artisan routes
app.use('/api/v1/artisans', artisanRoutes);

// Chat routes
app.use('/api/v1/chat', chatRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: 'Route not found',
    code: 'NOT_FOUND',
  });
});

// Global Error Handler (phải đặt sau tất cả routes)
app.use(errorHandler);

export default app;
