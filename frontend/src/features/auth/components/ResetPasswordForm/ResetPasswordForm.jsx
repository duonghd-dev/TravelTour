import { useState } from 'react';
import { forgotPassword } from '../../api/authApi';
import { useToast } from '@/contexts/ToastContext';
import './ResetPasswordForm.scss';

const ResetPasswordForm = () => {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Email is required');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const result = await forgotPassword(email);
      setSubmitted(true);
      toast.success(result.message || 'Recovery code sent to your email!');
    } catch (err) {
      toast.error(
        err.message || 'Failed to send recovery code. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <form className="reset-password-form success">
        <div className="success-icon">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path
              d="M24 4C13.05 4 4 13.05 4 24s9.05 20 20 20 20-9.05 20-20S34.95 4 24 4zm-4 30l-8-8 2.83-2.83L20 28.34l10.17-10.17L33 21l-13 13z"
              fill="#9d5243"
            />
          </svg>
        </div>

        <h1>Check Your Email</h1>
        <p className="subtitle">
          We've sent a verification code to <strong>{email}</strong>. Enter it
          to reset your password.
        </p>

        <button
          type="button"
          className="btn-continue"
          onClick={() =>
            (window.location.href =
              '/verify-reset-password?email=' + encodeURIComponent(email))
          }
        >
          Enter Verification Code
        </button>

        <button
          type="button"
          className="btn-change-email"
          onClick={() => {
            setSubmitted(false);
            setEmail('');
          }}
        >
          Use a Different Email
        </button>
      </form>
    );
  }

  return (
    <form className="reset-password-form" onSubmit={handleSubmit}>
      <h1>Reset Password</h1>
      <p className="subtitle">
        Enter your email address and we'll send you a secure verification code
        (OTP) to reset your password.
      </p>

      <div className="form-group">
        <label htmlFor="email">EMAIL ADDRESS</label>
        <div className="input-wrapper">
          <input
            id="email"
            type="email"
            placeholder="name@heritage.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="email-icon"
          >
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        </div>
      </div>

      <button type="submit" className="btn-send" disabled={loading}>
        {loading ? 'Sending...' : 'SEND RECOVERY CODE'}
      </button>

      <a href="/login" className="back-link">
        ← BACK TO SIGN IN
      </a>
    </form>
  );
};

export default ResetPasswordForm;
