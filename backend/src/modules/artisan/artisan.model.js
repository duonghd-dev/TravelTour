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

    // 🧾 Hồ sơ chuyên nghiệp
    bio: {
      type: String,
      default: '',
    },
    storytelling: {
      type: String,
      default: '',
    },
    experienceYears: {
      type: Number,
      default: 0,
    },
    skills: [
      {
        type: String,
      },
    ],

    // 📍 Địa phương & văn hoá
    province: {
      type: String,
      default: '',
    },
    village: {
      type: String,
      default: '',
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    workshopLocation: {
      address: String,
      description: String,
    },

    // ✅ Xác minh & danh hiệu
    isVerified: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    certifyingOrganization: {
      type: String,
      default: '',
    },
    proofImages: [
      {
        type: String,
      },
    ],

    // 📊 Trạng thái
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved',
    },

    // 📈 Thống kê hoạt động
    totalBookings: {
      type: Number,
      default: 0,
    },
    totalGuests: {
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
    responseRate: {
      type: Number,
      default: 100,
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
