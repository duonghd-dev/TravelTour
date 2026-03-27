import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { verifyEmailPage } from '../../api/authApi';
import './VerifyEmail.scss';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get('email');

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError('Email không tìm thấy. Vui lòng kiểm tra lại link xác nhận.');
      return;
    }

    if (!otp || otp.length !== 6) {
      setError('Vui lòng nhập mã OTP 6 chữ số');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await verifyEmailPage(email, otp);

      if (result.success) {
        setSuccess(true);

        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login', {
            state: { message: 'Email đã xác nhận! Vui lòng đăng nhập.' },
          });
        }, 2000);
      }
    } catch (err) {
      setError(err.message || 'Xác nhận email thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="verify-email-page">
        <div className="verify-container">
          <div className="error-box">
            <h2>❌ Lỗi</h2>
            <p>Email không tìm thấy. Link xác nhận có thể đã hết hạn.</p>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/login')}
            >
              Quay lại Đăng nhập
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="verify-email-page">
      <div className="verify-container">
        {success ? (
          <div className="success-box">
            <div className="success-icon">✓</div>
            <h2>Xác nhận email thành công!</h2>
            <p>Tài khoản của bạn đã được kích hoạt.</p>
            <p className="redirect-text">Chuyển hướng tới trang đăng nhập...</p>
          </div>
        ) : (
          <>
            <div className="verify-header">
              <h1>Xác nhận Email</h1>
              <p>Vui lòng nhập mã OTP được gửi tới email:</p>
              <p className="email-display">{email}</p>
            </div>

            <form onSubmit={handleSubmit} className="verify-form">
              {error && <div className="form-error">{error}</div>}

              <div className="form-group">
                <label htmlFor="otp">Mã OTP (6 chữ số)</label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={handleOtpChange}
                  placeholder="000000"
                  maxLength="6"
                  disabled={loading}
                  className="otp-input"
                  inputMode="numeric"
                />
                <small>Mã OTP có hiệu lực trong 10 phút</small>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || otp.length !== 6}
              >
                {loading ? 'Đang xác nhận...' : 'Xác nhận Email'}
              </button>
            </form>

            <div className="verify-info">
              <p>Chưa nhận được mã OTP?</p>
              <button
                type="button"
                className="link-btn"
                onClick={() => navigate('/login')}
              >
                Quay lại đăng nhập
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
