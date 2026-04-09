import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const hotelSchema = new Schema(
  {
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

    price: {
      type: Number,
      required: true,
    },
    priceUnit: {
      type: String,
      default: 'night',
    },

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

    images: [
      {
        type: String,
      },
    ],

    badge: String,

    amenities: [
      {
        icon: String,
        name: String,
        description: String,
      },
    ],

    culturalImpact: {
      title: String,
      description: String,
      impact: String,
      artisans: String,
    },

    hero: {
      title: String,
      subtitle: String,
    },

    story: {
      title: String,
      content: String,
      details: String,
    },

    gallery: [String],

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },

    publishStatus: {
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
