import ForgotPasswordBanner from '../../components/ForgotPasswordBanner/ForgotPasswordBanner';
import ResetPasswordForm from '../../components/ResetPasswordForm/ResetPasswordForm';
import './ForgotPassword.scss';

const ForgotPassword = () => {
  return (
    <div className="forgot-password-page">
      <ForgotPasswordBanner />
      <div className="reset-form-container">
        <div className="reset-form-wrapper">
          <ResetPasswordForm />
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
