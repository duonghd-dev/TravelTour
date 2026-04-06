import passport from 'passport';
import LocalStrategy from 'passport-local';
import GoogleStrategy from 'passport-google-oauth20';
import FacebookStrategy from 'passport-facebook';
import User from '../modules/user/user.model.js';
import OAuthProvider from '../modules/user/oauthProvider.model.js';
import { comparePassword } from '../common/utils/hash.js';
import logger from '../common/utils/logger.js';

// Local Strategy for email/password login
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });

        if (!user) {
          return done(null, false, { message: 'Email không tồn tại' });
        }

        const isPasswordValid = await comparePassword(password, user.password);

        if (!isPasswordValid) {
          return done(null, false, { message: 'Mật khẩu không đúng' });
        }

        return done(null, user);
      } catch (error) {
        logger.error('[Passport LocalStrategy] Error:', error.message);
        return done(error);
      }
    }
  )
);

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    logger.error('[Passport deserializeUser] Error:', error.message);
    done(error);
  }
});

// Google OAuth Strategy
passport.use(
  new GoogleStrategy.Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Tìm OAuth provider record
        let oauthProvider = await OAuthProvider.findOne({
          provider: 'google',
          providerId: profile.id,
        });

        let user;

        if (oauthProvider) {
          // OAuth provider đã tồn tại, lấy user
          user = await User.findById(oauthProvider.userId);
        } else {
          // OAuth provider chưa tồn tại, tìm hoặc tạo user
          user = await User.findOne({ email: profile.emails?.[0]?.value });

          if (!user) {
            // Tạo user mới
            user = await User.create({
              firstName:
                profile.given_name ||
                profile.displayName?.split(' ')[0] ||
                'User',
              lastName:
                profile.family_name || profile.displayName?.split(' ')[1] || '',
              email: profile.emails?.[0]?.value,
              avatar: profile.photos?.[0]?.value,
              isEmailVerified: true,
              role: 'customer',
            });
          }

          // Tạo OAuth provider record
          oauthProvider = await OAuthProvider.create({
            userId: user._id,
            provider: 'google',
            providerId: profile.id,
            email: profile.emails?.[0]?.value,
            displayName: profile.displayName,
            photoUrl: profile.photos?.[0]?.value,
          });
        }

        return done(null, user);
      } catch (error) {
        logger.error('[Passport GoogleStrategy] Error:', error.message);
        return done(error);
      }
    }
  )
);

// Facebook OAuth Strategy
passport.use(
  new FacebookStrategy.Strategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/api/auth/facebook/callback`,
      profileFields: [
        'id',
        'displayName',
        'name',
        'emails',
        'picture.type(large)',
      ],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Tìm OAuth provider record
        let oauthProvider = await OAuthProvider.findOne({
          provider: 'facebook',
          providerId: profile.id,
        });

        let user;

        if (oauthProvider) {
          // OAuth provider đã tồn tại, lấy user
          user = await User.findById(oauthProvider.userId);
        } else {
          // OAuth provider chưa tồn tại, tìm hoặc tạo user
          user = await User.findOne({ email: profile.emails?.[0]?.value });

          if (!user) {
            // Tạo user mới
            user = await User.create({
              firstName:
                profile.name?.givenName ||
                profile.displayName?.split(' ')[0] ||
                'User',
              lastName:
                profile.name?.familyName ||
                profile.displayName?.split(' ')[1] ||
                '',
              email: profile.emails?.[0]?.value,
              avatar: profile.photos?.[0]?.value,
              isEmailVerified: true,
              role: 'customer',
            });
          }

          // Tạo OAuth provider record
          oauthProvider = await OAuthProvider.create({
            userId: user._id,
            provider: 'facebook',
            providerId: profile.id,
            email: profile.emails?.[0]?.value,
            displayName: profile.displayName,
            photoUrl: profile.photos?.[0]?.value,
          });
        }

        return done(null, user);
      } catch (error) {
        logger.error('[Passport FacebookStrategy] Error:', error.message);
        return done(error);
      }
    }
  )
);

export default passport;
