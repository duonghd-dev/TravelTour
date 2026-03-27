import passport from 'passport';
import LocalStrategy from 'passport-local';
import GoogleStrategy from 'passport-google-oauth20';
import FacebookStrategy from 'passport-facebook';
import User from '../modules/user/user.model.js';
import * as jwt from 'jsonwebtoken';
import logger from '../common/utils/logger.js';

/**
 * 🔐 Local Strategy - Email + Password
 */
passport.use(
  'local',
  new LocalStrategy.Strategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
          return done(null, false, { message: 'User not found' });
        }
        // In production, use bcrypt to compare passwords
        // For now, simple comparison (backend should handle password hashing)
        return done(null, user);
      } catch (err) {
        logger.error('Local strategy error:', err);
        return done(err);
      }
    }
  )
);

/**
 * 🔐 Google Strategy
 */
passport.use(
  'google',
  new GoogleStrategy.Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL || 'http://localhost:8080'}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Extract avatar from Google profile
        const profilePhoto = profile.photos && profile.photos[0]?.value;

        // Find or create user by Google ID
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // Check if user exists by email
          const existingUser = await User.findOne({
            email: profile.emails[0].value.toLowerCase(),
          });

          if (existingUser) {
            // Link Google account to existing user
            existingUser.googleId = profile.id;
            existingUser.googleEmail = profile.emails[0].value;
            if (!existingUser.firstName && profile.name.givenName) {
              existingUser.firstName = profile.name.givenName;
            }
            if (!existingUser.lastName && profile.name.familyName) {
              existingUser.lastName = profile.name.familyName;
            }
            // Set avatar from Google if not already set
            if (!existingUser.avatar && profilePhoto) {
              existingUser.avatar = profilePhoto;
            }
            await existingUser.save();
            user = existingUser;
          } else {
            // Create new user
            user = await User.create({
              googleId: profile.id,
              googleEmail: profile.emails[0].value,
              email: profile.emails[0].value.toLowerCase(),
              firstName: profile.name.givenName || 'User',
              lastName: profile.name.familyName || '',
              avatar: profilePhoto || null,
              gender: 'other', // Default gender for OAuth users
              isEmailVerified: true, // Google verified email
              role: 'customer',
            });
          }
        }

        // Store access token if needed
        done(null, user);
      } catch (err) {
        logger.error('Google strategy error:', err);
        done(err);
      }
    }
  )
);

/**
 * 🔐 Facebook Strategy
 */
passport.use(
  'facebook',
  new FacebookStrategy.Strategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL || 'http://localhost:8080'}/api/auth/facebook/callback`,
      profileFields: ['id', 'displayName', 'name', 'emails', 'picture'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Extract avatar from Facebook profile
        const profilePicture = profile.picture && profile.picture.data?.url;

        // Find or create user by Facebook ID
        let user = await User.findOne({ facebookId: profile.id });

        if (!user) {
          // Check if user exists by email
          const email = profile.emails && profile.emails[0]?.value;

          if (email) {
            const existingUser = await User.findOne({
              email: email.toLowerCase(),
            });

            if (existingUser) {
              // Link Facebook account to existing user
              existingUser.facebookId = profile.id;
              existingUser.facebookEmail = email;
              if (!existingUser.firstName && profile.name?.givenName) {
                existingUser.firstName = profile.name.givenName;
              }
              if (!existingUser.lastName && profile.name?.familyName) {
                existingUser.lastName = profile.name.familyName;
              }
              // Set avatar from Facebook if not already set
              if (!existingUser.avatar && profilePicture) {
                existingUser.avatar = profilePicture;
              }
              await existingUser.save();
              user = existingUser;
            }
          }

          // Create new user if no email or existing user
          if (!user) {
            user = await User.create({
              facebookId: profile.id,
              facebookEmail: email || null,
              email: email
                ? email.toLowerCase()
                : `fb_${profile.id}@example.com`,
              firstName:
                profile.name?.givenName || profile.displayName || 'User',
              lastName: profile.name?.familyName || '',
              avatar: profilePicture || null,
              gender: 'other', // Default gender for OAuth users
              isEmailVerified: !!email, // Only if Facebook provided email
              role: 'customer',
            });
          }
        }

        done(null, user);
      } catch (err) {
        logger.error('Facebook strategy error:', err);
        done(err);
      }
    }
  )
);

/**
 * Serialize user - store user ID in session
 */
passport.serializeUser((user, done) => {
  done(null, user._id);
});

/**
 * Deserialize user - retrieve user by ID from session
 */
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;
