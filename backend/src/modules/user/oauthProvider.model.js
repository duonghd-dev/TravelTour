import mongoose from 'mongoose';

const { Schema, model } = mongoose;

/**
 * OAuthProvider Model - Quản lý OAuth providers (Google, Facebook, etc.)
 * Tách từ User model để tuân thủ NF3
 */
const oauthProviderSchema = new Schema(
  {
    // 🔗 Liên kết user
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // 🔐 Provider
    provider: {
      type: String,
      enum: ['google', 'facebook', 'github'],
      required: true,
    },

    // 🆔 Provider ID
    providerId: {
      type: String,
      required: true,
      unique: true,
    },

    // 📧 Provider Email
    email: {
      type: String,
      required: true,
    },

    // 🧑 Provider Profile Info
    displayName: {
      type: String,
    },
    photoUrl: {
      type: String,
    },

    // 🕒 Kết nối ngày
    connectedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index cho tìm kiếm nhanh
oauthProviderSchema.index({ userId: 1, provider: 1 });

const OAuthProvider = model('OAuthProvider', oauthProviderSchema);
export default OAuthProvider;
