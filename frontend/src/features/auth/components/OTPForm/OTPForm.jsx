import { useState, useRef, useEffect } from 'react';
import { verifyLoginOTP } from '../../api/authApi';
import './OTPForm.scss';

const OTPForm = ({ email = '', userId = '', onSuccess = () => {} }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(119); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleChange = (index, value) => {
    if (value.length > 1) return; 
    if (!/^\d*$/.test(value)) return; 

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const data = e.clipboardData.getData('text');
    if (!/^\d{6}$/.test(data)) return;

    const newOtp = data.split('');
    setOtp(newOtp);
    inputRefs.current[5]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) return;

    setLoading(true);
    setError('');
    try {
      const result = await verifyLoginOTP(userId, code);

      
      const { token, user } = result.data || result;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      onSuccess();
    } catch (err) {
      setError(err.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="otp-form" onSubmit={handleSubmit}>
      <div className="otp-icon">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <path
            d="M24 4C13.05 4 4 13.05 4 24s9.05 20 20 20 20-9.05 20-20S34.95 4 24 4zm0 36c-8.82 0-16-7.18-16-16s7.18-16 16-16 16 7.18 16 16-7.18 16-16 16z"
            fill="#9d5243"
          />
          <path
            d="M32 20H20c-2.21 0-4 1.79-4 4v8c0 2.21 1.79 4 4 4h12c2.21 0 4-1.79 4-4v-8c0-2.21-1.79-4-4-4zm-6 10c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"
            fill="#9d5243"
          />
        </svg>
      </div>

      <h1>OTP Verification</h1>
      <p className="subtitle">
        {email ? (
          <>
            Enter the 6-digit code sent to <strong>{email}</strong>
          </>
        ) : (
          'Enter the 6-digit code sent to your email'
        )}
      </p>

      {error && (
        <div
          className="error-message"
          style={{ color: '#d32f2f', marginBottom: '16px' }}
        >
          {error}
        </div>
      )}

      <div className="otp-inputs">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            type="text"
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className="otp-input"
            placeholder="•"
          />
        ))}
      </div>

      <button
        type="submit"
        className="btn-verify"
        disabled={otp.join('').length !== 6 || loading}
      >
        {loading ? 'Verifying...' : 'Verify OTP →'}
      </button>

      <div className="resend-section">
        <p className="resend-text">Didn't receive the code?</p>
        <div className="resend-link">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setTimeLeft(119);
            }}
          >
            Resend Code
          </a>
          <span className="timer">● Wait {formatTime(timeLeft)}</span>
        </div>
      </div>
    </form>
  );
};

export default OTPForm;
