import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { verifyResetPasswordOTP, resetPassword } from '../../api/authApi';
import { useToast } from '@/contexts/ToastContext';
import './VerifyResetPassword.scss';

const VerifyResetPassword = () => {
  const toast = useToast();
  const [step, setStep] = useState('verify-otp');
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('email');
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
  }, []);

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (!otp.trim()) {
      toast.error('Vui lòng nhập mã OTP');
      return;
    }

    setLoading(true);
    try {
      const result = await verifyResetPasswordOTP(email, otp);
      if (result.success) {
        setStep('reset-password');
        toast.success(
          'OTP được xác minh! Bây giờ hãy đặt lại mật khẩu của bạn.'
        );
      }
    } catch (err) {
      toast.error(err.message || 'Xác minh OTP thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword || newPassword.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu không khớp');
      return;
    }

    setLoading(true);
    try {
      const result = await resetPassword(email, otp, newPassword);
      if (result.success) {
        toast.success(
          'Đặt lại mật khẩu thành công! Chuyển hướng tới đăng nhập...'
        );
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      }
    } catch (err) {
      toast.error(err.message || 'Đặt lại mật khẩu thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-reset-password-page">
      <header className="header">
        <h1>Modern Heritage</h1>
      </header>

      <div className="form-container">
        {step === 'verify-otp' ? (
          <form className="verify-form" onSubmit={handleVerifyOTP}>
            <h2>Xác minh OTP</h2>
            <p className="subtitle">
              Nhập mã OTP được gửi tới <strong>{email}</strong>
            </p>

            <div className="form-group">
              <label htmlFor="verify-otp">Mã OTP</label>
              <input
                id="verify-otp"
                type="text"
                placeholder="Nhập mã OTP 6 chữ số"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                maxLength="6"
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? 'Đang xác minh...' : 'Xác minh OTP'}
            </button>

            <a href="/forgot-password" className="back-link">
              ← Quay lại Quên mật khẩu
            </a>
          </form>
        ) : (
          <form className="reset-form" onSubmit={handleResetPassword}>
            <h2>Đặt lại mật khẩu</h2>
            <p className="subtitle">Tạo mật khẩu mạnh cho tài khoản của bạn</p>

            <div className="form-group password-group">
              <label htmlFor="new-password">Mật khẩu mới</label>
              <div className="password-input">
                <input
                  id="new-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-visibility"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>

            <div className="form-group password-group">
              <label htmlFor="confirm-password">Xác nhận mật khẩu</label>
              <div className="password-input">
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-visibility"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <FontAwesomeIcon
                    icon={showConfirmPassword ? faEyeSlash : faEye}
                  />
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}>
              {loading ? 'Đang đặt lại...' : 'Đặt lại mật khẩu'}
            </button>

            <a href="/login" className="back-link">
              ← Quay lại Đăng nhập
            </a>
          </form>
        )}
      </div>

      <footer className="footer">
        <p>© 2026 MODERN HERITAGE. CURATING SUSTAINABLE JOURNEYS</p>
      </footer>
    </div>
  );
};

export default VerifyResetPassword;
