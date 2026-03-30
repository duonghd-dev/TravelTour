// Tạo file mới: modules/review/review.model.js
import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const reviewSchema = new Schema(
  {
    experienceId: {
      type: Schema.Types.ObjectId,
      ref: 'Experience',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default model('Review', reviewSchema);
