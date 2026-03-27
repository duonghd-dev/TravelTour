import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const artisanSchema = new Schema(
  {
    // 🔗 Liên kết user
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },

    // 🎨 Nghề
    category: {
      type: String,
      required: true,
    },
    craft: {
      type: String,
      required: true,
    },

    // 🧾 Hồ sơ
    bio: {
      type: String,
      default: '',
    },
    experienceYears: {
      type: Number,
      default: 0,
    },

    // ✅ Xác minh
    isVerified: {
      type: Boolean,
      default: false,
    },

    // 📊 Trạng thái
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved',
    },

    // 📈 Thống kê
    totalBookings: {
      type: Number,
      default: 0,
    },
    ratingAverage: {
      type: Number,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },

    // 🖼️ Media
    avatar: {
      type: String,
      default: '',
    },
    images: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Artisan = model('Artisan', artisanSchema);
export default Artisan;
