import OTPForm from '../../components/OTPForm/OTPForm';
import VerificationCard from '../../components/VerificationCard/VerificationCard';
import './OTPVerification.scss';

const OTPVerification = () => {
  return (
    <div className="otp-page">
      <header className="otp-header">
        <h1>Modern Heritage</h1>
      </header>

      <div className="otp-container">
        <div className="otp-form-section">
          <OTPForm />
        </div>
        <VerificationCard />
      </div>

      <footer className="otp-footer">
        <div className="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Contact Support</a>
        </div>
        <p className="copyright">
          © 2026 MODERN HERITAGE. CURATING SUSTAINABLE JOURNEYS
        </p>
      </footer>
    </div>
  );
};

export default OTPVerification;
