import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const hotelSchema = new Schema(
  {
    // 📝 Thông tin cơ bản
    name: {
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
    category: {
      type: String,
      enum: [
        'Heritage Hotel',
        'Mountain Resort',
        'Gallery Hotel',
        'Coastal Resort',
        'Eco-Lodge',
      ],
      default: 'Heritage Hotel',
    },

    // 💰 Giá
    price: {
      type: Number,
      required: true,
    },
    priceUnit: {
      type: String,
      default: 'night',
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

    // 🎯 Amenities
    amenities: [
      {
        icon: String,
        name: String,
        description: String,
      },
    ],

    // 🌍 Cultural Impact
    culturalImpact: {
      title: String,
      description: String,
      impact: String,
      artisans: String,
    },

    // 🎬 Hero Section
    hero: {
      title: String,
      subtitle: String,
    },

    // 📖 Story
    story: {
      title: String,
      content: String,
      details: String,
    },

    // 🖼️ Gallery
    gallery: [String],

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

const Hotel = model('Hotel', hotelSchema);

export default Hotel;
