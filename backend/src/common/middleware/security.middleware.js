/**
 * Security Middleware
 * Enforces HTTPS, rate limiting, and other security measures
 */

import logger from '../utils/logger.js';

/**
 * 🔐 Enforce HTTPS for payment endpoints
 * Required for PCI compliance and security
 */
export const enforceHttps = (req, res, next) => {
  // In production, check actual protocol
  // In development, allow HTTP for testing
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

/**
 * 🔒 Validate payment request origin
 * Prevent CSRF attacks on payment endpoints
 */
export const validatePaymentOrigin = (req, res, next) => {
  const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:5173',
    'http://localhost:3000',
  ];

  const origin = req.header('origin') || req.header('referer');

  if (origin) {
    // Extract base URL from referer if needed
    const baseOrigin = origin.split('?')[0];
    const isAllowed = allowedOrigins.some((allowed) =>
      baseOrigin.includes(allowed)
    );

    if (!isAllowed && process.env.NODE_ENV === 'production') {
      logger.warn(`[Security] Request from invalid origin: ${origin}`);
      // Note: VNPay callback won't have referer, so be lenient with callbacks
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

/**
 * 💥 Rate limiting for payment endpoints
 * Prevent brute force and DDoS attacks
 */
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

    // Remove old attempts outside the window
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

/**
 * 🛡️ Validate payment request headers
 * Ensure request is properly formatted
 */
export const validatePaymentHeaders = (req, res, next) => {
  // Check Content-Type for POST requests
  if (req.method === 'POST') {
    const contentType = req.header('content-type') || '';

    if (
      !contentType.includes('application/json') &&
      !contentType.includes('application/x-www-form-urlencoded')
    ) {
      // VNPay callback uses form-encoded, so allow it
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

/**
 * 🔍 Log payment requests (without sensitive data)
 */
export const logPaymentRequest = (req, res, next) => {
  const sensitiveFields = ['card', 'token', 'secret', 'password', 'pin'];

  // Log request info (sanitized)
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
