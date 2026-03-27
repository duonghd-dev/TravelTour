import Banner from '../../components/Banner/Banner';
import RegisterForm from '../../components/RegisterForm/RegisterForm';
import './RegisterPage.scss';

const RegisterPage = () => {
  return (
    <div className="register-page">
      <Banner
        title="Begin Your Own"
        titleHighlight="Legacy."
        description="Join a community dedicated to the preservation of culture, the appreciation of craft, and the pursuit of meaningful travel."
      />
      <div className="register-form-container">
        <div className="register-form-wrapper">
          <div className="brand">
            <h1>Register</h1>
            <p>Create your account to start curating your journey.</p>
          </div>

          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
