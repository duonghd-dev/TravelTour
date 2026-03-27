/**
 * Utility functions to handle login attempt tracking and exponential backoff
 */

const LOGIN_ATTEMPTS_KEY = 'login_attempts';
const LOGIN_LOCKOUT_KEY = 'login_lockout';
const MAX_ATTEMPTS = 5;

/**
 * Get current login attempt data
 */
export const getLoginAttempts = () => {
  try {
    const data = localStorage.getItem(LOGIN_ATTEMPTS_KEY);
    return data ? JSON.parse(data) : { count: 0, firstAttemptTime: null };
  } catch (err) {
    return { count: 0, firstAttemptTime: null };
  }
};

/**
 * Get lockout info if user is locked out
 */
export const getLockoutInfo = () => {
  try {
    const data = localStorage.getItem(LOGIN_LOCKOUT_KEY);
    if (!data) return null;

    const lockoutData = JSON.parse(data);
    const now = Date.now();

    // Check if lockout period is over
    if (now > lockoutData.unlockTime) {
      // Lockout expired, clear it
      clearLoginAttempts();
      return null;
    }

    return {
      isLocked: true,
      remainingTime: Math.ceil((lockoutData.unlockTime - now) / 1000),
      unlockTime: lockoutData.unlockTime,
      failedAttempts: lockoutData.failedAttempts,
    };
  } catch (err) {
    return null;
  }
};

/**
 * Calculate lockout duration based on number of failed attempts
 * Uses exponential backoff: 60 * (2 ^ (attempts - 5))
 * - 5th attempt: 60 seconds (1 minute)
 * - 6th attempt: 120 seconds (2 minutes)
 * - 7th attempt: 240 seconds (4 minutes)
 * - 8th attempt: 480 seconds (8 minutes)
 */
export const calculateLockoutDuration = (failedAttempts) => {
  if (failedAttempts < MAX_ATTEMPTS) return 0;
  // Exponential: 60 * (2 ^ (attempts - 5))
  return 60 * Math.pow(2, failedAttempts - MAX_ATTEMPTS);
};

/**
 * Record a failed login attempt
 */
export const recordFailedAttempt = () => {
  const attempts = getLoginAttempts();
  const newCount = attempts.count + 1;
  const now = Date.now();

  // Update attempts
  localStorage.setItem(
    LOGIN_ATTEMPTS_KEY,
    JSON.stringify({
      count: newCount,
      firstAttemptTime: attempts.firstAttemptTime || now,
    })
  );

  // If reached max attempts, create lockout
  if (newCount >= MAX_ATTEMPTS) {
    const lockoutDuration = calculateLockoutDuration(newCount);
    const unlockTime = now + lockoutDuration * 1000;

    localStorage.setItem(
      LOGIN_LOCKOUT_KEY,
      JSON.stringify({
        failedAttempts: newCount,
        unlockTime,
        createdAt: now,
      })
    );

    return {
      isLocked: true,
      remainingTime: lockoutDuration,
      failedAttempts: newCount,
    };
  }

  return {
    isLocked: false,
    attemptsRemaining: MAX_ATTEMPTS - newCount,
    failedAttempts: newCount,
  };
};

/**
 * Clear login attempts (when login is successful)
 */
export const clearLoginAttempts = () => {
  localStorage.removeItem(LOGIN_ATTEMPTS_KEY);
  localStorage.removeItem(LOGIN_LOCKOUT_KEY);
};

/**
 * Format remaining lockout time as human readable
 */
export const formatLockoutTime = (seconds) => {
  if (seconds < 60) {
    return `${seconds} giây`;
  }
  const minutes = Math.ceil(seconds / 60);
  return `${minutes} phút`;
};
