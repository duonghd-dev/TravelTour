import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const tourSchema = new Schema(
  {
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

    price: {
      type: Number,
      required: true,
    },
    priceUnit: {
      type: String,
      default: 'per person',
    },

    duration: {
      value: Number,
      unit: {
        type: String,
        enum: ['hour', 'day', 'week'],
        default: 'day',
      },
    },

    maxParticipants: {
      type: Number,
      default: 20,
    },
    minParticipants: {
      type: Number,
      default: 1,
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

    highlights: [
      {
        icon: String,
        title: String,
        description: String,
      },
    ],

    itinerary: [
      {
        day: Number,
        title: String,
        description: String,
        activities: [String],
        meals: [String],
      },
    ],

    included: [String],

    whatToBring: [String],

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

const Tour = model('Tour', tourSchema);

export default Tour;
