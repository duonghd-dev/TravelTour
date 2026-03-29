import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const experienceSchema = new Schema(
  {
    // 🔗 Liên kết artisan
    artisanId: {
      type: Schema.Types.ObjectId,
      ref: 'Artisan',
      required: true,
    },

    // 📝 Thông tin cơ bản
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },

    // 💰 Giá và thời gian
    price: {
      type: Number,
      required: true,
    },
    duration: {
      value: Number, // Số lượng
      unit: {
        type: String,
        enum: ['hour', 'day', 'session'],
        default: 'hour',
      },
    },

    // 👥 Số lượng khách
    maxGuests: {
      type: Number,
      default: 1,
    },
    minGuests: {
      type: Number,
      default: 1,
    },

    // 📅 Lịch hoạt động
    schedule: {
      type: String,
      default: '',
    },
    availableDays: [
      {
        type: String,
        enum: [
          'monday',
          'tuesday',
          'wednesday',
          'thursday',
          'friday',
          'saturday',
          'sunday',
        ],
      },
    ],

    // 🖼️ Media
    images: [
      {
        type: String,
      },
    ],
    videos: [
      {
        type: String,
      },
    ],

    // 📊 Trạng thái
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
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
  },
  {
    timestamps: true,
  }
);

const Experience = model('Experience', experienceSchema);
export default Experience;
