/**
 * OAuth utility functions for Google and Facebook login
 */

// Initialize Facebook SDK
export const initializeFacebook = () => {
  if (window.facebookSdkInitialized) return;

  window.fbAsyncInit = function () {
    FB.init({
      appId: '2114288385984509', // From your .env
      xfbml: true,
      version: 'v18.0',
      cookie: true,
      status: true,
    });
  };

  // Load the SDK
  const script = document.createElement('script');
  script.src = 'https://connect.facebook.net/en_US/sdk.js';
  script.async = true;
  script.defer = true;
  document.body.appendChild(script);

  window.facebookSdkInitialized = true;
};

// Handle Google OAuth callback
export const handleGoogleCallback = (credentialResponse) => {
  // credentialResponse contains the JWT token
  return credentialResponse.credential;
};

// Handle Facebook login
export const handleFacebookLogin = (callback) => {
  if (!window.FB) {
    console.error('Facebook SDK not initialized');
    return;
  }

  FB.login(
    (response) => {
      if (response.authResponse) {
        callback(response.authResponse);
      } else {
        callback(null);
      }
    },
    { scope: 'email,public_profile' }
  );
};

// Get Facebook user info after login
export const getFacebookUserInfo = (accessToken) => {
  return new Promise((resolve, reject) => {
    if (!window.FB) {
      reject(new Error('Facebook SDK not initialized'));
      return;
    }

    FB.api(
      '/me',
      { fields: 'id,name,email,picture', access_token: accessToken },
      (response) => {
        if (response.error) {
          reject(response.error);
        } else {
          resolve(response);
        }
      }
    );
  });
};

// Logout from OAuth
export const logoutFromOAuth = () => {
  if (window.FB) {
    FB.logout();
  }
};
