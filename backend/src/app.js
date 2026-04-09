import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import session from 'express-session';
import passport from './config/passport.js';
import errorHandler from './common/middleware/errorHandler.middleware.js';
import { stripEmojiMiddleware } from './common/utils/emoji.js';
import {
  corsConfig,
  generalLimiter,
  authLimiter,
  otpLimiter,
} from './config/security.js';

import authRoutes from './modules/auth/index.js';
import userRoutes from './modules/user/index.js';
import artisanRoutes from './modules/artisan/index.js';
import experienceRoutes from './modules/experience/index.js';
import bookingRoutes from './modules/booking/index.js';
import paymentRoutes from './modules/payment/payment.routes.js';
import reviewRoutes from './modules/review/index.js';
import hotelRoutes from './modules/hotel/index.js';
import tourRoutes from './modules/tour/index.js';
import adminRoutes from './modules/admin/admin.routes.js';
import { chatRoutes } from './modules/chat/index.js';
import { aiRoutes } from './modules/ai/index.js';

const app = express();

app.use(cors(corsConfig));

app.use(morgan('dev'));

app.use(generalLimiter);

// Middleware để loại bỏ emoji từ request body
app.use(stripEmojiMiddleware);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/auth/verify-otp', otpLimiter);

app.use('/api/v1/users', userRoutes);

app.use('/api/v1/artisans', artisanRoutes);

app.use('/api/v1/experiences', experienceRoutes);

app.use('/api/v1/hotels', hotelRoutes);

app.use('/api/v1/tours', tourRoutes);

app.use('/api/v1/bookings', bookingRoutes);

app.use('/api/v1/payments', paymentRoutes);

app.use('/api/v1/reviews', reviewRoutes);

app.use('/api/v1/admin', adminRoutes);

app.use('/api/v1/chat', chatRoutes);

app.use('/api/v1/ai', aiRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: 'Route not found',
    code: 'NOT_FOUND',
  });
});

app.use(errorHandler);

export default app;
