import Artisan from './artisan.model.js';
import User from '../user/user.model.js';
import Experience from '../experience/experience.model.js';
import Review from '../review/review.model.js';
import Booking from '../booking/booking.model.js';
import logger from '../../common/utils/logger.js';

const computeArtisanStats = async (artisanId) => {
  try {
    const bookings = await Booking.find({ artisanId }).lean();
    const totalBookings = bookings.length;
    const totalGuests = bookings.reduce(
      (sum, b) => sum + (b.guestsCount || 0),
      0
    );

    const reviews = await Review.find({ artisanId }).lean();
    const totalReviews = reviews.length;
    const ratingAverage =
      reviews.length > 0
        ? (
            reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          ).toFixed(1)
        : 0;

    return {
      totalBookings,
      totalGuests,
      totalReviews,
      ratingAverage: parseFloat(ratingAverage),
    };
  } catch (error) {
    logger.error('[computeArtisanStats] Error:', error.message);

    return {
      totalBookings: 0,
      totalGuests: 0,
      totalReviews: 0,
      ratingAverage: 0,
    };
  }
};

export const getAllArtisans = async (filters = {}) => {
  try {
    const query = { verificationStatus: 'approved' };

    if (filters.category) {
      query.category = filters.category;
    }
    if (filters.craft) {
      query.craft = filters.craft;
    }
    if (filters.province) {
      query.province = filters.province;
    }
    if (filters.isVerified !== undefined) {
      query.isProfileVerified = filters.isVerified;
    }

    const artisans = await Artisan.find(query)
      .populate('userId', 'firstName lastName avatar email phone gender')
      .lean();

    const enrichedArtisans = await Promise.all(
      artisans.map(async (artisan) => {
        const stats = await computeArtisanStats(artisan._id);
        return { ...artisan, ...stats };
      })
    );

    enrichedArtisans.sort((a, b) => {
      if (b.ratingAverage !== a.ratingAverage) {
        return b.ratingAverage - a.ratingAverage;
      }
      return b.totalReviews - a.totalReviews;
    });

    return {
      success: true,
      message: 'Danh sách nghệ nhân',
      data: enrichedArtisans,
    };
  } catch (error) {
    logger.error('[getAllArtisans] Error:', error.message);
    throw error;
  }
};

export const getArtisanDetail = async (artisanId) => {
  try {
    const artisan = await Artisan.findById(artisanId)
      .populate(
        'userId',
        'firstName lastName avatar email phone gender dateOfBirth address'
      )
      .lean();

    if (!artisan) {
      throw new Error('Không tìm thấy nghệ nhân');
    }

    const stats = await computeArtisanStats(artisanId);

    const experiences = await Experience.find({
      artisanId: artisanId,
      publishStatus: 'active',
    })
      .populate('artisanId', 'userId title craft')
      .lean();

    const reviews = await Review.find({
      artisanId: artisanId,
    })
      .populate('userId', 'firstName lastName avatar')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const recommendedExperiences = await Experience.find({
      artisanId: { $ne: artisanId },
      publishStatus: 'active',
    })
      .populate('artisanId', 'userId title craft')
      .limit(3)
      .lean();

    return {
      success: true,
      message: 'Chi tiết nghệ nhân',
      data: {
        ...artisan,
        ...stats,
        experiences,
        reviews,
        recommendedExperiences,
      },
    };
  } catch (error) {
    logger.error('[getArtisanDetail] Error:', error.message);
    throw error;
  }
};

export const createArtisanProfile = async (userId, artisanData) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('Không tìm thấy người dùng');
    }

    const existingArtisan = await Artisan.findOne({ userId });
    if (existingArtisan) {
      throw new Error('Người dùng đã có hồ sơ nghệ nhân');
    }

    const artisan = new Artisan({
      userId,
      ...artisanData,
    });

    await artisan.save();

    return {
      success: true,
      message: 'Tạo hồ sơ nghệ nhân thành công',
      data: artisan,
    };
  } catch (error) {
    logger.error('[createArtisanProfile] Error:', error.message);
    throw error;
  }
};

export const updateArtisanProfile = async (userId, updates) => {
  try {
    const artisan = await Artisan.findOne({ userId });
    if (!artisan) {
      throw new Error('Không tìm thấy hồ sơ nghệ nhân');
    }

    delete updates.userId;

    const updatedArtisan = await Artisan.findByIdAndUpdate(
      artisan._id,
      updates,
      { new: true, runValidators: true }
    ).populate('userId', 'firstName lastName avatar email phone');

    return {
      success: true,
      message: 'Cập nhật hồ sơ nghệ nhân thành công',
      data: updatedArtisan,
    };
  } catch (error) {
    logger.error('[updateArtisanProfile] Error:', error.message);
    throw error;
  }
};

export const getArtisanStats = async (userId) => {
  try {
    const artisan = await Artisan.findOne({ userId }).lean();
    if (!artisan) {
      throw new Error('Không tìm thấy hồ sơ nghệ nhân');
    }

    const stats = await computeArtisanStats(artisan._id);

    return {
      success: true,
      message: 'Thống kê hoạt động',
      data: {
        ...stats,
        responseRate: artisan.responseRate || 100,
      },
    };
  } catch (error) {
    logger.error('[getArtisanStats] Error:', error.message);
    throw error;
  }
};

export const searchArtisans = async (keyword, filters = {}) => {
  try {
    const searchQuery = {
      status: 'approved',
      $or: [
        { craft: { $regex: keyword, $options: 'i' } },
        { category: { $regex: keyword, $options: 'i' } },
        { slogan: { $regex: keyword, $options: 'i' } },
        { province: { $regex: keyword, $options: 'i' } },
        { village: { $regex: keyword, $options: 'i' } },
      ],
    };

    if (filters.province) {
      searchQuery.province = filters.province;
    }

    const artisans = await Artisan.find(searchQuery)
      .populate('userId', 'firstName lastName avatar email')
      .sort({ ratingAverage: -1 })
      .limit(20)
      .lean();

    return {
      success: true,
      message: 'Kết quả tìm kiếm',
      data: artisans,
    };
  } catch (error) {
    logger.error('[searchArtisans] Error:', error.message);
    throw error;
  }
};
