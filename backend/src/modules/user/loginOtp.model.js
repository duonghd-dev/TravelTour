import mongoose from 'mongoose';

const { Schema, model } = mongoose;


const loginOtpSchema = new Schema(
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


loginOtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const LoginOTP = model('LoginOTP', loginOtpSchema);
export default LoginOTP;
