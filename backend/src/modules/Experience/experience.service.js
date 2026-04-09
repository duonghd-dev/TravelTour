import Experience from './experience.model.js';
import Artisan from '../artisan/artisan.model.js';
import Review from '../review/review.model.js';
import Booking from '../booking/booking.model.js';
import logger from '../../common/utils/logger.js';

export const listExperiences = async (filters = {}) => {
  try {
    const query = { publishStatus: 'active' };

    if (filters.artisanId) {
      query.artisanId = filters.artisanId;
    }
    if (filters.category) {
      query.category = filters.category;
    }
    if (filters.minPrice || filters.maxPrice) {
      query.price = {};
      if (filters.minPrice) query.price.$gte = filters.minPrice;
      if (filters.maxPrice) query.price.$lte = filters.maxPrice;
    }

    const experiences = await Experience.find(query)
      .populate('artisanId', 'userId title craft ratingAverage')
      .sort({ createdAt: -1 })
      .lean();

    return {
      success: true,
      message: 'Danh sách trải nghiệm',
      data: experiences,
    };
  } catch (error) {
    logger.error('[listExperiences] Error:', error.message);
    throw error;
  }
};

export const searchExperiences = async (keyword) => {
  try {
    const experiences = await Experience.find({
      publishStatus: 'active',
      $or: [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
      ],
    })
      .populate('artisanId', 'userId title craft')
      .lean();

    return {
      success: true,
      message: 'Kết quả tìm kiếm',
      data: experiences,
    };
  } catch (error) {
    logger.error('[searchExperiences] Error:', error.message);
    throw error;
  }
};

export const createExperience = async (artisanId, experienceData) => {
  try {
    const artisan = await Artisan.findById(artisanId);
    if (!artisan) {
      throw new Error('Artisan not found');
    }

    const experience = new Experience({
      artisanId,
      ...experienceData,
    });

    await experience.save();

    logger.info(`Experience ${experience._id} created by artisan ${artisanId}`);

    return {
      success: true,
      message: 'Experience created successfully',
      data: experience,
    };
  } catch (error) {
    logger.error('[createExperience] Error:', error.message);
    throw error;
  }
};

export const updateExperience = async (experienceId, updateData) => {
  try {
    delete updateData.artisanId;

    const experience = await Experience.findByIdAndUpdate(
      experienceId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!experience) {
      throw new Error('Experience not found');
    }

    logger.info(`Experience ${experienceId} updated`);

    return {
      success: true,
      message: 'Experience updated successfully',
      data: experience,
    };
  } catch (error) {
    logger.error('[updateExperience] Error:', error.message);
    throw error;
  }
};

export const deleteExperience = async (experienceId) => {
  try {
    const experience = await Experience.findByIdAndDelete(experienceId);

    if (!experience) {
      throw new Error('Experience not found');
    }

    logger.info(`Experience ${experienceId} deleted`);

    return {
      success: true,
      message: 'Experience deleted successfully',
    };
  } catch (error) {
    logger.error('[deleteExperience] Error:', error.message);
    throw error;
  }
};

const computeExperienceStats = async (experienceId) => {
  try {
    const bookings = await Booking.find({ experienceId }).lean();
    const totalBookings = bookings.length;

    const reviews = await Review.find({ experienceId }).lean();
    const totalReviews = reviews.length;
    const ratingAverage =
      reviews.length > 0
        ? (
            reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          ).toFixed(1)
        : 0;

    return {
      totalBookings,
      totalReviews,
      ratingAverage: parseFloat(ratingAverage),
    };
  } catch (error) {
    logger.error('[computeExperienceStats] Error:', error.message);
    return {
      totalBookings: 0,
      totalReviews: 0,
      ratingAverage: 0,
    };
  }
};

export const getExperienceWithStats = async (experienceId) => {
  try {
    const User = (await import('../user/user.model.js')).default;

    const experience = await Experience.findById(experienceId)
      .populate({
        path: 'artisanId',
        select: 'userId title storytelling experienceYears generation avatar',
        populate: {
          path: 'userId',
          select: 'firstName lastName avatar',
        },
      })
      .lean();

    if (!experience) {
      throw new Error('Experience not found');
    }

    const stats = await computeExperienceStats(experienceId);

    const reviews = await Review.find({ experienceId })
      .populate({
        path: 'userId',
        select: 'firstName lastName avatar',
      })
      .lean();

    let guide = null;
    if (experience.artisanId && experience.artisanId.userId) {
      const artisan = experience.artisanId;
      const user = artisan.userId;
      guide = {
        name: artisan.title || `${user.firstName} ${user.lastName}`,
        desc: artisan.storytelling || '',
        years: artisan.experienceYears || 0,
        generation: artisan.generation || 0,
        image: user.avatar || '',
        artisanId: experience.artisanId._id,
      };
    }

    const formattedReviews = reviews.map((r) => ({
      name: r.userId
        ? `${r.userId.firstName} ${r.userId.lastName}`
        : 'Anonymous',
      avatar: r.userId?.avatar || '',
      content: r.content,
      rating: r.rating,
    }));

    const gallery = experience.images || [];

    return {
      success: true,
      message: 'Chi tiết trải nghiệm',
      data: {
        ...experience,
        ...stats,
        guide,
        gallery,
        reviews: formattedReviews,
      },
    };
  } catch (error) {
    logger.error('[getExperienceWithStats] Error:', error.message);
    throw error;
  }
};
