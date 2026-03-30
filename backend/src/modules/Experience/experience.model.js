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

    location: {
      type: String,
      required: true,
    },
    // 🏷️ Phân loại/Series (Ví dụ: 'HERITAGE REVIVAL SERIES')
    badge: {
      type: String,
      default: '',
    },

    // 💬 Câu quote truyền cảm hứng
    quote: {
      type: String,
      default: '',
    },

    // 🗺️ Lộ trình trải nghiệm (The Curated Journey)
    journey: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],

    // ⏰ Danh sách các khung giờ cố định trong ngày (Ví dụ: ['08:00 AM', '02:00 PM'])
    // Dùng cái này thay thế cho chuỗi `schedule: String` cũ để dễ query
    timeSlots: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Experience = model('Experience', experienceSchema);
export default Experience;
