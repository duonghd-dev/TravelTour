

const LOGIN_ATTEMPTS_KEY = 'login_attempts';
const LOGIN_LOCKOUT_KEY = 'login_lockout';
const MAX_ATTEMPTS = 5;


export const getLoginAttempts = () => {
  try {
    const data = localStorage.getItem(LOGIN_ATTEMPTS_KEY);
    return data ? JSON.parse(data) : { count: 0, firstAttemptTime: null };
  } catch (err) {
    return { count: 0, firstAttemptTime: null };
  }
};


export const getLockoutInfo = () => {
  try {
    const data = localStorage.getItem(LOGIN_LOCKOUT_KEY);
    if (!data) return null;

    const lockoutData = JSON.parse(data);
    const now = Date.now();

    
    if (now > lockoutData.unlockTime) {
      
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


export const calculateLockoutDuration = (failedAttempts) => {
  if (failedAttempts < MAX_ATTEMPTS) return 0;
  
  return 60 * Math.pow(2, failedAttempts - MAX_ATTEMPTS);
};


export const recordFailedAttempt = () => {
  const attempts = getLoginAttempts();
  const newCount = attempts.count + 1;
  const now = Date.now();

  
  localStorage.setItem(
    LOGIN_ATTEMPTS_KEY,
    JSON.stringify({
      count: newCount,
      firstAttemptTime: attempts.firstAttemptTime || now,
    })
  );

  
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


export const clearLoginAttempts = () => {
  localStorage.removeItem(LOGIN_ATTEMPTS_KEY);
  localStorage.removeItem(LOGIN_LOCKOUT_KEY);
};


export const formatLockoutTime = (seconds) => {
  if (seconds < 60) {
    return `${seconds} giây`;
  }
  const minutes = Math.ceil(seconds / 60);
  return `${minutes} phút`;
};
