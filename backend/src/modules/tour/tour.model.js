import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const tourSchema = new Schema(
  {
    // 📝 Thông tin cơ bản
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    region: {
      type: String,
      enum: ['North', 'Central', 'South'],
      default: 'Central',
    },

    // 💰 Giá
    price: {
      type: Number,
      required: true,
    },
    priceUnit: {
      type: String,
      default: 'per person',
    },

    // ⏱️ Thời gian
    duration: {
      value: Number, // Số lượng
      unit: {
        type: String,
        enum: ['hour', 'day', 'week'],
        default: 'day',
      },
    },

    // 👥 Số lượng
    maxParticipants: {
      type: Number,
      default: 20,
    },
    minParticipants: {
      type: Number,
      default: 1,
    },

    // ⭐ Đánh giá
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 4.5,
    },
    reviews: {
      type: Number,
      default: 0,
    },

    // 📸 Hình ảnh
    images: [
      {
        type: String,
      },
    ],

    // 🏷️ Badge
    badge: String,

    // 🎯 Highlights/Attractions
    highlights: [
      {
        icon: String,
        title: String,
        description: String,
      },
    ],

    // 📖 Itinerary
    itinerary: [
      {
        day: Number,
        title: String,
        description: String,
        activities: [String],
        meals: [String], // breakfast, lunch, dinner
      },
    ],

    // 🌍 Included Services
    included: [String], // meals, transport, guide, etc

    // 📋 What to Bring
    whatToBring: [String],

    // 👤 Admin
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },

    // 📊 Status
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

const Tour = model('Tour', tourSchema);

export default Tour;
