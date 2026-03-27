import Banner from '../../components/Banner/Banner';
import LoginForm from '../../components/LoginForm/LoginForm';
import SocialLogin from '../../components/SocialLogin/SocialLogin';
import './LoginPage.scss';

const LoginPage = () => {
  return (
    <div className="login-page">
      <Banner
        subtitle="THE DIGITAL CURATORSHIP"
        title="Preserving the"
        titleHighlight="soul of every journey."
        description="Tradition is not the worship of ashes, but the preservation of fire."
        author="— Gustave Mahler"
      />
      <div className="login-form-container">
        <div className="login-form-wrapper">
          <div className="brand">
            <h1>Modern Heritage</h1>
            <p>Welcome back. Your curated archive awaits.</p>
          </div>

          <LoginForm />
          <SocialLogin />

          <p className="invite-text">
            New to Modern Heritage? <a href="#">Request an Invite</a>
          </p>

          <div className="footer-links">
            <a href="#">PRIVACY</a>
            <a href="#">TERMS</a>
            <a href="#">ARCHIVE ACCESS</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
