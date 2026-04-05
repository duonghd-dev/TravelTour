// Tạo file mới: modules/review/review.model.js
import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const reviewSchema = new Schema(
  {
    // Experience hoặc trải nghiệm được review
    experienceId: {
      type: Schema.Types.ObjectId,
      ref: 'Experience',
      required: true,
    },
    // Artisan được review (lưu để query dễ)
    artisanId: {
      type: Schema.Types.ObjectId,
      ref: 'Artisan',
      required: true,
    },
    // User review
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Đánh giá sao
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    // Nội dung review
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default model('Review', reviewSchema);
