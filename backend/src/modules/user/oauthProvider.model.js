import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const oauthProviderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    provider: {
      type: String,
      enum: ['google', 'facebook', 'github'],
      required: true,
    },

    providerId: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
    },

    displayName: {
      type: String,
    },
    photoUrl: {
      type: String,
    },

    connectedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
oauthProviderSchema.index({ userId: 1, provider: 1 });
oauthProviderSchema.index({ userId: 1 });
oauthProviderSchema.index({ provider: 1, providerId: 1 }, { unique: true });
oauthProviderSchema.index({ email: 1 });

const OAuthProvider = model('OAuthProvider', oauthProviderSchema);
export default OAuthProvider;
