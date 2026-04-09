

import logger from '../utils/logger.js';


export const enforceHttps = (req, res, next) => {
  
  
  if (process.env.NODE_ENV === 'production') {
    if (
      req.header('x-forwarded-proto') !== 'https' &&
      req.protocol !== 'https'
    ) {
      logger.warn(
        `[Security] HTTP request to ${req.originalUrl} rejected in production`
      );
      return res.status(403).json({
        success: false,
        message: 'HTTPS required for payment endpoints',
      });
    }
  }

  next();
};


export const validatePaymentOrigin = (req, res, next) => {
  const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:5173',
    'http://localhost:3000',
  ];

  const origin = req.header('origin') || req.header('referer');

  if (origin) {
    
    const baseOrigin = origin.split('?')[0];
    const isAllowed = allowedOrigins.some((allowed) =>
      baseOrigin.includes(allowed)
    );

    if (!isAllowed && process.env.NODE_ENV === 'production') {
      logger.warn(`[Security] Request from invalid origin: ${origin}`);
      
      if (!req.path.includes('verify') && !req.path.includes('webhook')) {
        return res.status(403).json({
          success: false,
          message: 'Invalid origin',
        });
      }
    }
  }

  next();
};


const paymentAttempts = new Map();

export const rateLimitPayment = (
  maxAttempts = 10,
  windowMs = 15 * 60 * 1000
) => {
  return (req, res, next) => {
    const key = req.ip || req.socket.remoteAddress;
    const now = Date.now();

    if (!paymentAttempts.has(key)) {
      paymentAttempts.set(key, []);
    }

    const attempts = paymentAttempts.get(key);

    
    const recentAttempts = attempts.filter((time) => now - time < windowMs);

    if (recentAttempts.length >= maxAttempts) {
      logger.warn(
        `[Security] Rate limit exceeded for IP: ${key}, attempts: ${recentAttempts.length}`
      );
      return res.status(429).json({
        success: false,
        message: `Too many payment requests. Please try again in ${Math.ceil(windowMs / 1000 / 60)} minutes.`,
      });
    }

    recentAttempts.push(now);
    paymentAttempts.set(key, recentAttempts);

    next();
  };
};


export const validatePaymentHeaders = (req, res, next) => {
  
  if (req.method === 'POST') {
    const contentType = req.header('content-type') || '';

    if (
      !contentType.includes('application/json') &&
      !contentType.includes('application/x-www-form-urlencoded')
    ) {
      
      if (!req.path.includes('verify') && !req.path.includes('webhook')) {
        return res.status(400).json({
          success: false,
          message: 'Content-Type must be application/json',
        });
      }
    }
  }

  next();
};


export const logPaymentRequest = (req, res, next) => {
  const sensitiveFields = ['card', 'token', 'secret', 'password', 'pin'];

  
  const logData = {
    method: req.method,
    path: req.path,
    ip: req.ip,
    timestamp: new Date().toISOString(),
  };

  logger.info('[Payment Request]', logData);

  next();
};

export default {
  enforceHttps,
  validatePaymentOrigin,
  rateLimitPayment,
  validatePaymentHeaders,
  logPaymentRequest,
};
