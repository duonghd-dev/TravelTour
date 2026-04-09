import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const artisanSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },

    category: {
      type: String,
      required: true,
    },
    craft: {
      type: String,
      required: true,
    },

    slogan: {
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

    isProfileVerified: {
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

    verificationStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved',
    },

    responseRate: {
      type: Number,
      default: 100,
    },
    images: [
      {
        type: String,
      },
    ],
    generation: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
artisanSchema.index({ userId: 1 }, { unique: true });
artisanSchema.index({ verificationStatus: 1 });
artisanSchema.index({ category: 1 });
artisanSchema.index({ isProfileVerified: 1 });
artisanSchema.index({ 'location.coordinates': '2dsphere' }); // For geospatial queries
artisanSchema.index({ createdAt: -1 });

const Artisan = model('Artisan', artisanSchema);
export default Artisan;
