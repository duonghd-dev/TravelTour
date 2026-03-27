import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, verifyLoginOTP } from '../../api/authApi';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/hooks/useAuth';
import {
  getLoginAttempts,
  getLockoutInfo,
  recordFailedAttempt,
  clearLoginAttempts,
  formatLockoutTime,
} from '@/utils/loginAttempts';
import './LoginForm.scss';

const LoginForm = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [step, setStep] = useState('login'); // login or verify-otp
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Lockout state
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTimeRemaining, setLockoutTimeRemaining] = useState(0);
  const [failedAttempts, setFailedAttempts] = useState(0);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [userId, setUserId] = useState('');

  // Check lockout status on mount and setup interval for countdown
  useEffect(() => {
    const checkLockoutStatus = () => {
      const lockoutInfo = getLockoutInfo();
      if (lockoutInfo) {
        setIsLocked(true);
        setLockoutTimeRemaining(lockoutInfo.remainingTime);
        setFailedAttempts(lockoutInfo.failedAttempts);
      } else {
        setIsLocked(false);
        setLockoutTimeRemaining(0);
        const attempts = getLoginAttempts();
        setFailedAttempts(attempts.count);
      }
    };

    checkLockoutStatus();

    // Setup interval to update remaining time
    if (isLocked) {
      const interval = setInterval(() => {
        checkLockoutStatus();
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isLocked]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    // Check if account is locked
    const lockoutInfo = getLockoutInfo();
    if (lockoutInfo) {
      toast.error(
        `Tài khoản bị khóa tạm thời. Vui lòng thử lại sau ${formatLockoutTime(lockoutInfo.remainingTime)}`
      );
      return;
    }

    if (!email.trim()) {
      toast.error('Email is required');
      return;
    }
    if (!password) {
      toast.error('Password is required');
      return;
    }

    setLoading(true);
    try {
      const result = await loginUser({ email, password });

      // Extract data from new response format: { success, message, data: { token, user, userId } }
      const { token, user, userId: newUserId } = result.data || result;

      // Login successful - clear failed attempts
      clearLoginAttempts();
      setFailedAttempts(0);

      // ✅ NẾU CÓ TOKEN (2FA DISABLED) - ĐĂNG NHẬP NGAY
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }

        // Update AuthContext
        setUser(user);

        toast.success('Login successful! Redirecting...');
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        // ⚠️ NẾU KHÔNG CÓ TOKEN (2FA ENABLED) - CHUYỂN VÀO OTP FORM
        setUserId(newUserId);
        setStep('verify-otp');
        toast.success(result.message || 'OTP sent to your email');
        setPassword(''); // Clear password for security
      }
    } catch (err) {
      // Track failed attempt and apply exponential backoff
      const failureInfo = recordFailedAttempt();

      if (failureInfo.isLocked) {
        // Account is now locked
        setIsLocked(true);
        setLockoutTimeRemaining(failureInfo.remainingTime);
        setFailedAttempts(failureInfo.failedAttempts);
        toast.error(
          `Quá nhiều lần thử đăng nhập thất bại. Tài khoản bị khóa ${formatLockoutTime(failureInfo.remainingTime)}`
        );
      } else {
        // Still allowed to try, but warn about remaining attempts
        const attemptsLeft = 5 - failureInfo.failedAttempts;
        setFailedAttempts(failureInfo.failedAttempts);
        // Handle error format: { message, status, code, details }
        const errorMsg = err.message || 'Login failed. Please try again.';
        if (attemptsLeft <= 2) {
          toast.error(`${errorMsg} (${attemptsLeft} lần thử còn lại)`);
        } else {
          toast.error(errorMsg);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (!otp.trim()) {
      toast.error('Please enter the OTP');
      return;
    }

    setLoading(true);
    try {
      const result = await verifyLoginOTP(userId, otp);

      // Extract data from new response format
      const { token, user } = result.data || result;

      // Save token and user to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }

      // Update AuthContext with user data
      setUser(user);

      toast.success('Login successful! Redirecting...');
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      const errorMsg =
        err.message || 'OTP verification failed. Please try again.';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (step === 'verify-otp') {
    return (
      <form className="login-form verify-otp" onSubmit={handleVerifyOTP}>
        <h2>Verify Your Login</h2>
        <p className="subtitle">
          We've sent an OTP to <strong>{email}</strong>. Enter it to complete
          your login.
        </p>

        <div className="form-group">
          <label htmlFor="otp">OTP Code</label>
          <input
            id="otp"
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            maxLength="6"
          />
        </div>

        <button type="submit" className="btn-signin" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify Login'}
        </button>

        <button
          type="button"
          className="btn-back"
          onClick={() => {
            setStep('login');
            setOtp('');
          }}
          disabled={loading}
        >
          ← Back to Login
        </button>
      </form>
    );
  }

  return (
    <form className="login-form" onSubmit={handleLoginSubmit}>
      {isLocked && (
        <div className="lockout-warning">
          <p className="lockout-title">🔒 Tài khoản bị khóa tạm thời</p>
          <p className="lockout-message">
            Vui lòng thử lại sau{' '}
            <strong>{formatLockoutTime(lockoutTimeRemaining)}</strong>
          </p>
          <div className="lockout-timer">
            Còn lại:{' '}
            <span className="timer-value">{lockoutTimeRemaining}s</span>
          </div>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          type="email"
          placeholder="curator@heritage.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLocked}
          required
          autoComplete="email"
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">
          Password
          <a href="/forgot-password" className="forgot-link">
            Forgot Password?
          </a>
        </label>
        <input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLocked}
          required
          autoComplete="current-password"
        />
      </div>

      <div className="form-group checkbox">
        <input
          id="remember"
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          disabled={isLocked}
        />
        <label htmlFor="remember">Remember this device</label>
      </div>

      <button
        type="submit"
        className="btn-signin"
        disabled={loading || isLocked}
      >
        {isLocked
          ? `Khóa ${formatLockoutTime(lockoutTimeRemaining)}`
          : loading
            ? 'Signing In...'
            : 'Sign In'}
      </button>

      {failedAttempts > 0 && !isLocked && (
        <p className="attempt-warning">
          ⚠️ Đã thử {failedAttempts}/5 lần. Cẩn thận: lần thứ 6 sẽ bị khóa 1
          phút
        </p>
      )}

      <p className="signup-text">
        Don't have an account? <a href="/register">Sign up</a>
      </p>
    </form>
  );
};

export default LoginForm;
