import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const experienceSchema = new Schema(
  {
    artisanId: {
      type: Schema.Types.ObjectId,
      ref: 'Artisan',
      required: true,
    },

    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },
    duration: {
      value: Number,
      unit: {
        type: String,
        enum: ['hour', 'day', 'session'],
        default: 'hour',
      },
    },

    maxGuests: {
      type: Number,
      default: 1,
    },
    minGuests: {
      type: Number,
      default: 1,
    },

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

    publishStatus: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },

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
