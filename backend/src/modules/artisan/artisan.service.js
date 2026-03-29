import Artisan from './artisan.model.js';
import User from '../user/user.model.js';
import Experience from '../Experience/experience.model.js';
import logger from '../../common/utils/logger.js';

/**
 * Lấy danh sách tất cả nghệ nhân
 */
export const getAllArtisans = async (filters = {}) => {
  try {
    const query = { status: 'approved' };

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
      query.isVerified = filters.isVerified;
    }

    const artisans = await Artisan.find(query)
      .populate('userId', 'firstName lastName avatar email phone gender')
      .sort({ ratingAverage: -1, totalReviews: -1 })
      .lean();

    return {
      success: true,
      message: 'Danh sách nghệ nhân',
      data: artisans,
    };
  } catch (error) {
    logger.error('[getAllArtisans] Error:', error.message);
    throw error;
  }
};

/**
 * Lấy chi tiết nghệ nhân theo ID
 */
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

    // Lấy danh sách trải nghiệm
    const experiences = await Experience.find({
      artisanId: artisanId,
      status: 'active',
    }).lean();

    // Lấy danh sách reviews từ Review model (nếu có)
    // Tạm thời trả về dữ liệu mẫu
    const reviews = [];

    return {
      success: true,
      message: 'Chi tiết nghệ nhân',
      data: {
        ...artisan,
        experiences,
        reviews,
      },
    };
  } catch (error) {
    logger.error('[getArtisanDetail] Error:', error.message);
    throw error;
  }
};

/**
 * Tạo hồ sơ nghệ nhân (sau khi user đăng ký)
 */
export const createArtisanProfile = async (userId, artisanData) => {
  try {
    // Kiểm tra user tồn tại
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('Không tìm thấy người dùng');
    }

    // Kiểm tra xem user đã có hồ sơ nghệ nhân chưa
    const existingArtisan = await Artisan.findOne({ userId });
    if (existingArtisan) {
      throw new Error('Người dùng đã có hồ sơ nghệ nhân');
    }

    // Tạo hồ sơ nghệ nhân mới
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

/**
 * Cập nhật hồ sơ nghệ nhân
 */
export const updateArtisanProfile = async (userId, updates) => {
  try {
    const artisan = await Artisan.findOne({ userId });
    if (!artisan) {
      throw new Error('Không tìm thấy hồ sơ nghệ nhân');
    }

    // Không cho phép cập nhật userId
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

/**
 * Lấy thống kê hoạt động của nghệ nhân
 */
export const getArtisanStats = async (userId) => {
  try {
    const artisan = await Artisan.findOne({ userId }).lean();
    if (!artisan) {
      throw new Error('Không tìm thấy hồ sơ nghệ nhân');
    }

    return {
      success: true,
      message: 'Thống kê hoạt động',
      data: {
        totalBookings: artisan.totalBookings,
        totalGuests: artisan.totalGuests,
        ratingAverage: artisan.ratingAverage,
        totalReviews: artisan.totalReviews,
        responseRate: artisan.responseRate,
      },
    };
  } catch (error) {
    logger.error('[getArtisanStats] Error:', error.message);
    throw error;
  }
};

/**
 * Tìm kiếm nghệ nhân theo keyword
 */
export const searchArtisans = async (keyword, filters = {}) => {
  try {
    const searchQuery = {
      status: 'approved',
      $or: [
        { craft: { $regex: keyword, $options: 'i' } },
        { category: { $regex: keyword, $options: 'i' } },
        { bio: { $regex: keyword, $options: 'i' } },
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
