import mongoose from 'mongoose';

const { Schema, model } = mongoose;


const emailOtpSchema = new Schema(
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

    
    sendCount: {
      type: Number,
      default: 1,
    },
    lastSentAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);


emailOtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const EmailOTP = model('EmailOTP', emailOtpSchema);
export default EmailOTP;
