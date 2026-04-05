import Review from './review.model.js';
import Artisan from '../artisan/artisan.model.js';
import Experience from '../experience/experience.model.js';
import logger from '../../common/utils/logger.js';

/**
 * Tạo review cho experience
 */
export const createReview = async (userId, experienceId, reviewData) => {
  try {
    // Kiểm tra experience có tồn tại không
    const experience = await Experience.findById(experienceId);
    if (!experience) {
      throw new Error('Không tìm thấy trải nghiệm');
    }

    // Lấy artisanId từ experience
    const artisanId = experience.artisanId;

    // Kiểm tra user đã review experience này chưa
    const existingReview = await Review.findOne({
      experienceId,
      userId,
    });

    if (existingReview) {
      throw new Error('Bạn đã review trải nghiệm này rồi');
    }

    // Tạo review mới
    const review = new Review({
      experienceId,
      artisanId,
      userId,
      ...reviewData,
    });

    await review.save();

    // Cập nhật rating của experience
    await updateExperienceRating(experienceId);

    // Cập nhật rating của artisan
    await updateArtisanRating(artisanId);

    return {
      success: true,
      message: 'Tạo review thành công',
      data: review,
    };
  } catch (error) {
    logger.error('[createReview] Error:', error.message);
    throw error;
  }
};

/**
 * Lấy reviews cho experience
 */
export const getExperienceReviews = async (experienceId) => {
  try {
    const reviews = await Review.find({ experienceId })
      .populate('userId', 'firstName lastName avatar')
      .sort({ createdAt: -1 })
      .lean();

    return {
      success: true,
      message: 'Danh sách reviews',
      data: reviews,
    };
  } catch (error) {
    logger.error('[getExperienceReviews] Error:', error.message);
    throw error;
  }
};

/**
 * Lấy reviews cho artisan
 */
export const getArtisanReviews = async (artisanId) => {
  try {
    const reviews = await Review.find({ artisanId })
      .populate('userId', 'firstName lastName avatar')
      .sort({ createdAt: -1 })
      .lean();

    return {
      success: true,
      message: 'Danh sách reviews',
      data: reviews,
    };
  } catch (error) {
    logger.error('[getArtisanReviews] Error:', error.message);
    throw error;
  }
};

/**
 * Cập nhật rating của experience
 */
export const updateExperienceRating = async (experienceId) => {
  try {
    const reviews = await Review.find({ experienceId }).lean();

    if (reviews.length === 0) {
      await Experience.findByIdAndUpdate(experienceId, {
        ratingAverage: 0,
        totalReviews: 0,
      });
      return;
    }

    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const ratingAverage = totalRating / reviews.length;

    await Experience.findByIdAndUpdate(experienceId, {
      ratingAverage: parseFloat(ratingAverage.toFixed(1)),
      totalReviews: reviews.length,
    });
  } catch (error) {
    logger.error('[updateExperienceRating] Error:', error.message);
    throw error;
  }
};

/**
 * Cập nhật rating của artisan từ tất cả experiences
 */
export const updateArtisanRating = async (artisanId) => {
  try {
    const experiences = await Experience.find({ artisanId }).lean();

    if (experiences.length === 0) {
      await Artisan.findByIdAndUpdate(artisanId, {
        ratingAverage: 0,
        totalReviews: 0,
      });
      return;
    }

    let totalRating = 0;
    let totalReviews = 0;

    experiences.forEach((exp) => {
      totalRating += exp.ratingAverage * (exp.totalReviews || 0);
      totalReviews += exp.totalReviews || 0;
    });

    const ratingAverage = totalReviews > 0 ? totalRating / totalReviews : 0;

    await Artisan.findByIdAndUpdate(artisanId, {
      ratingAverage: parseFloat(ratingAverage.toFixed(1)),
      totalReviews,
    });
  } catch (error) {
    logger.error('[updateArtisanRating] Error:', error.message);
    throw error;
  }
};

/**
 * Xóa review
 */
export const deleteReview = async (reviewId, userId) => {
  try {
    const review = await Review.findById(reviewId);

    if (!review) {
      throw new Error('Không tìm thấy review');
    }

    // Kiểm tra quyền (chỉ owner hoặc admin mới có thể xóa)
    if (review.userId.toString() !== userId.toString()) {
      throw new Error('Không có quyền xóa review này');
    }

    await Review.findByIdAndDelete(reviewId);

    // Cập nhật lại rating
    await updateExperienceRating(review.experienceId);
    await updateArtisanRating(review.artisanId);

    return {
      success: true,
      message: 'Xóa review thành công',
    };
  } catch (error) {
    logger.error('[deleteReview] Error:', error.message);
    throw error;
  }
};
