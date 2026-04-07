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

    // 📈 Thống kê (Computed/Derived Data)
    // ⚠️ PURPOSE: Cache để tăng performance query
    // 🔄 UPDATE: Services sẽ recalculate từ Booking & Review collections
    // 💡 NOTE: Không phải source of truth - dùng cho display/sorting only
    // totalBookings: {
    //   type: Number,
    //   default: 0,
    // },
    // ratingAverage: {
    //   type: Number,
    //   default: 0,
    // },
    // totalReviews: {
    //   type: Number,
    //   default: 0,
    // },

    location: {
      type: String,
      required: true,
    },
    badge: {
      type: String,
      default: '',
    },

    quote: {
      type: String,
      default: '',
    },

    story: {
      type: String,
      default: '',
    },

    journey: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],

    timeSlots: [
      {
        time: {
          type: String,
          required: true,
        },
        capacity: {
          type: Number,
          required: true,
          default: 8,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Experience = model('Experience', experienceSchema);
export default Experience;
