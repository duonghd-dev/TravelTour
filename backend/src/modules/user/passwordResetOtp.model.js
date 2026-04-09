import mongoose from 'mongoose';

const { Schema, model } = mongoose;


const passwordResetOtpSchema = new Schema(
  {
    
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },

    
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },

    
    isUsed: {
      type: Boolean,
      default: false,
    },

    
    sentAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);


passwordResetOtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const PasswordResetOTP = model('PasswordResetOTP', passwordResetOtpSchema);
export default PasswordResetOTP;
