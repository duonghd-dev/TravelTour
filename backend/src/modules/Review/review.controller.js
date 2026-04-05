import * as reviewService from './review.service.js';
import logger from '../../common/utils/logger.js';

/**
 * POST /api/v1/reviews - Tạo review
 * Protected route - requires authentication
 */
export const createReview = async (req, res) => {
  try {
    const { experienceId, rating, content } = req.body;
    const userId = req.user.userId;

    // Validate dữ liệu
    if (!experienceId || !rating || !content) {
      return res.status(400).json({
        success: false,
        message: 'experienceId, rating, content là bắt buộc',
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating phải từ 1 đến 5',
      });
    }

    const result = await reviewService.createReview(userId, experienceId, {
      rating,
      content,
    });

    res.status(201).json(result);
  } catch (err) {
    logger.error('[createReview] Error:', err.message);
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * GET /api/v1/reviews/experience/:experienceId - Lấy reviews của experience
 */
export const getExperienceReviews = async (req, res) => {
  try {
    const { experienceId } = req.params;

    const result = await reviewService.getExperienceReviews(experienceId);
    res.json(result);
  } catch (err) {
    logger.error('[getExperienceReviews] Error:', err.message);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * GET /api/v1/reviews/artisan/:artisanId - Lấy reviews của artisan
 */
export const getArtisanReviews = async (req, res) => {
  try {
    const { artisanId } = req.params;

    const result = await reviewService.getArtisanReviews(artisanId);
    res.json(result);
  } catch (err) {
    logger.error('[getArtisanReviews] Error:', err.message);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * DELETE /api/v1/reviews/:reviewId - Xóa review
 * Protected route - requires authentication
 */
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.userId;

    const result = await reviewService.deleteReview(reviewId, userId);
    res.json(result);
  } catch (err) {
    logger.error('[deleteReview] Error:', err.message);
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
