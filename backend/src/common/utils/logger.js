/**
 * Logger Utility
 * Simple logger with timestamps and levels
 * In production, should be upgraded to Winston or Pino
 */

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

const LOG_COLORS = {
  DEBUG: '\x1b[36m', // Cyan
  INFO: '\x1b[32m', // Green
  WARN: '\x1b[33m', // Yellow
  ERROR: '\x1b[31m', // Red
  RESET: '\x1b[0m', // Reset
};

const getCurrentTimestamp = () => {
  return new Date().toISOString();
};

const shouldLog = (level) => {
  const currentLevel = process.env.LOG_LEVEL || 'INFO';
  return LOG_LEVELS[level] >= LOG_LEVELS[currentLevel];
};

const formatLog = (level, message, data) => {
  const timestamp = getCurrentTimestamp();
  const color = LOG_COLORS[level];
  const reset = LOG_COLORS.RESET;

  const baseMessage = `${color}[${timestamp}] [${level}] ${message}${reset}`;

  if (data) {
    try {
      const dataStr = typeof data === 'string' ? data : JSON.stringify(data);
      return `${baseMessage} | ${dataStr}`;
    } catch (err) {
      return `${baseMessage} | [Unable to stringify data]`;
    }
  }

  return baseMessage;
};

export const logger = {
  // 🔵 Debug level
  debug: (message, data) => {
    if (shouldLog('DEBUG')) {
      console.log(formatLog('DEBUG', message, data));
    }
  },

  // 🟢 Info level
  info: (message, data) => {
    if (shouldLog('INFO')) {
      console.log(formatLog('INFO', message, data));
    }
  },

  // 🟡 Warn level
  warn: (message, data) => {
    if (shouldLog('WARN')) {
      console.warn(formatLog('WARN', message, data));
    }
  },

  // 🔴 Error level
  error: (message, data) => {
    if (shouldLog('ERROR')) {
      console.error(formatLog('ERROR', message, data));
    }
  },

  // 📊 Request logging middleware
  logRequest: (req, res, next) => {
    const start = Date.now();
    const method = req.method;
    const path = req.path;

    res.on('finish', () => {
      const duration = Date.now() - start;
      const status = res.statusCode;
      const statusColor = status >= 400 ? LOG_COLORS.ERROR : LOG_COLORS.INFO;

      const logMessage = `${statusColor}${method} ${path} - ${status}${LOG_COLORS.RESET} (${duration}ms)`;
      console.log(logMessage);
    });

    next();
  },
};

export default logger;
