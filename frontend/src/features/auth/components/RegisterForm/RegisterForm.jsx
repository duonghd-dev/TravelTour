import { useState } from 'react';
import { registerUser, verifyEmail } from '../../api/authApi';
import { useToast } from '@/contexts/ToastContext';
import './RegisterForm.scss';

const RegisterForm = () => {
  const toast = useToast();
  const [step, setStep] = useState('register'); 
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState('');
  const [otp, setOtp] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleNavigateLogin = () => {
    window.location.href = '/login';
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    
    if (!formData.firstName.trim()) {
      toast.error('First name is required');
      return;
    }
    if (!formData.lastName.trim()) {
      toast.error('Last name is required');
      return;
    }
    if (!formData.email.trim()) {
      toast.error('Email is required');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    if (formData.phone.trim()) {
      const phoneRegex = /^[0-9]{10,}$/;
      if (!phoneRegex.test(formData.phone.replace(/[^0-9]/g, ''))) {
        toast.error('Phone number must contain at least 10 digits');
        return;
      }
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (!formData.agreeTerms) {
      toast.error('You must agree to Terms and Privacy Policy');
      return;
    }

    setLoading(true);
    try {
      const result = await registerUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender,
        password: formData.password,
      });

      
      const { userId: newUserId } = result.data || result;

      setUserEmail(formData.email);
      setUserId(newUserId);
      setStep('verify-email');

      toast.success('Đăng ký thành công! Hãy check email để lấy OTP xác thực.');
    } catch (err) {
      toast.error(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmailSubmit = async (e) => {
    e.preventDefault();

    if (!otp.trim()) {
      toast.error('Please enter the OTP');
      return;
    }

    setLoading(true);
    try {
      const result = await verifyEmail(userId, otp);

      
      const { token, user } = result.data || result;

      
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        toast.success('Email verified successfully! Redirecting...');
        setTimeout(() => {
          
          window.location.href = '/';
        }, 1500);
      }
    } catch (err) {
      toast.error(err.message || 'OTP verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'verify-email') {
    return (
      <form
        className="register-form verify-email"
        onSubmit={handleVerifyEmailSubmit}
      >
        <h2>Verify Your Email</h2>
        <p className="subtitle">
          We've sent an OTP to <strong>{formData.email}</strong>. Please enter
          it to verify your email.
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

        <button type="submit" className="btn-create" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify Email'}
        </button>

        <button
          type="button"
          className="btn-back"
          onClick={() => setStep('register')}
          disabled={loading}
        >
          ← Back to Register
        </button>
      </form>
    );
  }

  return (
    <form className="register-form" onSubmit={handleRegisterSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            type="text"
            name="firstName"
            placeholder="Evelyn"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            type="text"
            name="lastName"
            placeholder="Thorne"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="evelyn@heritage.com"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="phone">Phone Number</label>
        <input
          id="phone"
          type="tel"
          name="phone"
          placeholder="+1 (555) 000-0000"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="gender">Gender</label>
        <select
          id="gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="form-group password-group">
        <label htmlFor="password">Password</label>
        <div className="password-input">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            className="toggle-visibility"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className="form-group password-group">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <div className="password-input">
          <input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            className="toggle-visibility"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className="form-group checkbox">
        <input
          id="agreeTerms"
          type="checkbox"
          name="agreeTerms"
          checked={formData.agreeTerms}
          onChange={handleChange}
          required
        />
        <label htmlFor="agreeTerms">
          I agree to the <a href="#">Terms</a> and{' '}
          <a href="#">Privacy Policy</a>
        </label>
      </div>

      <button type="submit" className="btn-create" disabled={loading}>
        {loading ? 'Creating Account...' : 'Create Account'}
      </button>

      <p className="signin-text" style={{ marginTop: '16px' }}>
        Already have an account? <a href="/login">Sign in</a>
      </p>
    </form>
  );
};

export default RegisterForm;
