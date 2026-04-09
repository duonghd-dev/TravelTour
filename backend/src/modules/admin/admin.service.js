import Booking from '../booking/booking.model.js';
import User from '../user/user.model.js';
import Artisan from '../artisan/artisan.model.js';
import Payment from '../payment/payment.model.js';
import logger from '../../common/utils/logger.js';

/**
 * Lấy tất cả dashboard metrics
 */
export const getDashboardMetrics = async (timeRange = 'last-30-days') => {
  try {
    // Tính toán các metrics
    const totalRevenue = await getTotalRevenue(timeRange);
    const totalArtisans = await getTotalArtisans(timeRange);
    const heritageImpact = await getHeritageImpactFund(timeRange);
    const totalBookings = await getTotalBookings(timeRange);
    const activeTravelers = await getActiveTravelers(timeRange);

    return {
      revenue: totalRevenue,
      artisans: totalArtisans,
      impact: heritageImpact,
      bookings: totalBookings,
      travelers: activeTravelers,
    };
  } catch (error) {
    logger.error('[getDashboardMetrics] Error:', error.message);
    throw error;
  }
};

/**
 * Lấy doanh thu
 */
export const getRevenueMetrics = async () => {
  try {
    const revenue = await getTotalRevenue();
    return {
      success: true,
      data: revenue,
    };
  } catch (error) {
    logger.error('[getRevenueMetrics] Error:', error.message);
    throw error;
  }
};

/**
 * Lấy danh sách artisan chờ xác thực
 */
export const getPendingVerifications = async () => {
  try {
    const pendingArtisans = await Artisan.find({
      verificationStatus: { $ne: 'approved' },
    })
      .populate('userId', 'fullName email')
      .select('title craft category _id verificationStatus')
      .limit(5)
      .sort({ createdAt: -1 });

    return pendingArtisans.map((artisan) => ({
      id: artisan._id,
      name: artisan.userId?.fullName || artisan.craft || 'Unknown',
      role: artisan.title || artisan.craft,
      avatar: (artisan.userId?.fullName || 'A').charAt(0).toUpperCase(),
      status: artisan.verificationStatus,
    }));
  } catch (error) {
    logger.error('[getPendingVerifications] Error:', error.message);
    return [];
  }
};

/**
 * Lấy dữ liệu booking theo category (experience type)
 */
export const getBookingsByCategory = async () => {
  try {
    // Đếm bookings theo itemType (Tour, Experience, Hotel)
    const bookings = await Booking.aggregate([
      {
        $facet: {
          experiences: [
            { $match: { experienceId: { $ne: null } } },
            { $count: 'count' },
          ],
          tours: [{ $match: { tourId: { $ne: null } } }, { $count: 'count' }],
          hotels: [{ $match: { hotelId: { $ne: null } } }, { $count: 'count' }],
        },
      },
    ]);

    const categoryMap = {
      Tour: '#8c5f3c',
      Experience: '#944c3b',
      Hotel: '#9fb96f',
    };

    // Tạo array dữ liệu từ facet
    const data = [];
    if (bookings[0].experiences[0]?.count > 0) {
      data.push({
        _id: 'Experience',
        count: bookings[0].experiences[0].count,
      });
    }
    if (bookings[0].tours[0]?.count > 0) {
      data.push({
        _id: 'Tour',
        count: bookings[0].tours[0].count,
      });
    }
    if (bookings[0].hotels[0]?.count > 0) {
      data.push({
        _id: 'Hotel',
        count: bookings[0].hotels[0].count,
      });
    }

    const total = data.reduce((sum, b) => sum + b.count, 0);

    return data.map((item) => ({
      name: item._id || 'Other',
      value: total > 0 ? Math.round((item.count / total) * 100) : 0,
      color: categoryMap[item._id] || '#999',
      count: item.count,
    }));
  } catch (error) {
    logger.error('[getBookingsByCategory] Error:', error.message);
    return [];
  }
};

/**
 * Lấy dữ liệu doanh thu theo tháng (6 tháng gần nhất)
 */
export const getRevenueByMonth = async () => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyData = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
          $or: [{ status: 'confirmed' }, { paymentId: { $ne: null } }],
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          revenue: { $sum: '$totalPrice' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    // Ensure 6 months of data
    const result = monthlyData.map((item) => ({
      month: monthNames[item._id.month - 1],
      revenue: Math.round((item.revenue / 1000000) * 100), // in scale of 100
      impact: Math.round(((item.revenue * 0.1) / 1000000) * 100), // 10% impact
      bookings: item.count,
    }));

    // Fill missing months
    while (result.length < 6) {
      result.unshift({
        month: monthNames[new Date().getMonth() - result.length],
        revenue: 0,
        impact: 0,
        bookings: 0,
      });
    }

    return result.slice(-6);
  } catch (error) {
    logger.error('[getRevenueByMonth] Error:', error.message);
    return [];
  }
};

// ========== HELPER FUNCTIONS ==========

/**
 * Tính toán date range dựa trên timeRange parameter
 */
const getDateRange = (timeRange) => {
  const now = new Date();
  let startDate,
    endDate = now;

  switch (timeRange) {
    case 'last-30-days':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case 'quarterly':
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case 'yearly':
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  return { startDate, endDate };
};

/**
 * Tính tổng doanh thu từ bookings đã hoàn tất
 */
const getTotalRevenue = async (timeRange = 'last-30-days') => {
  try {
    const { startDate, endDate } = getDateRange(timeRange);

    // Tìm bookings đã confirmed hoặc có paymentId trong khoảng thời gian
    const bookings = await Booking.find({
      $or: [{ status: 'confirmed' }, { paymentId: { $ne: null } }],
      createdAt: { $gte: startDate, $lte: endDate },
    }).lean();

    const total = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    // Tính % thay đổi so sánh 2 period
    const midDate = new Date((startDate.getTime() + endDate.getTime()) / 2);

    const recentRevenue = bookings
      .filter((b) => new Date(b.createdAt) >= midDate)
      .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    const previousRevenue = bookings
      .filter((b) => new Date(b.createdAt) < midDate)
      .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    const changePercent =
      previousRevenue > 0
        ? Math.round(
            ((recentRevenue - previousRevenue) / previousRevenue) * 100
          )
        : recentRevenue > 0
          ? 100
          : 0;

    return {
      value: total,
      formatted: `$${(total / 1000000).toFixed(1)}M`,
      change: `${changePercent >= 0 ? '+' : ''}${changePercent}%`,
    };
  } catch (error) {
    logger.error('[getTotalRevenue] Error:', error.message);
    return { value: 0, formatted: '$0', change: '+0%' };
  }
};

/**
 * Tính số lượng nghệ nhân hoạt động
 */
const getTotalArtisans = async (timeRange = 'last-30-days') => {
  try {
    const count = await Artisan.countDocuments({
      verificationStatus: 'approved',
      isProfileVerified: true,
    });

    // Tính % thay đổi so sánh 2 tuần gần nhất
    const { startDate, endDate } = getDateRange(timeRange);
    const midDate = new Date((startDate.getTime() + endDate.getTime()) / 2);

    const recentNewArtisans = await Artisan.countDocuments({
      verificationStatus: 'approved',
      isProfileVerified: true,
      createdAt: { $gte: midDate },
    });

    const previousNewArtisans = await Artisan.countDocuments({
      verificationStatus: 'approved',
      isProfileVerified: true,
      createdAt: { $gte: startDate, $lt: midDate },
    });

    const changePercent =
      previousNewArtisans > 0
        ? Math.round(
            ((recentNewArtisans - previousNewArtisans) / previousNewArtisans) *
              100
          )
        : recentNewArtisans > 0
          ? 100
          : 0;

    return {
      value: count,
      formatted: count.toLocaleString(),
      change: `${changePercent >= 0 ? '+' : ''}${changePercent}%`,
    };
  } catch (error) {
    logger.error('[getTotalArtisans] Error:', error.message);
    return { value: 0, formatted: '0', change: '+0%' };
  }
};

/**
 * Tính Heritage Impact Fund (10% từ doanh thu)
 */
const getHeritageImpactFund = async (timeRange = 'last-30-days') => {
  try {
    const { startDate, endDate } = getDateRange(timeRange);

    // Tìm bookings đã confirmed hoặc có paymentId trong khoảng thời gian
    const bookings = await Booking.find({
      $or: [{ status: 'confirmed' }, { paymentId: { $ne: null } }],
      createdAt: { $gte: startDate, $lte: endDate },
    }).lean();

    const revenue = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    const impact = revenue * 0.1; // 10% of revenue

    // Tính % thay đổi dựa trên 2 period
    const midDate = new Date((startDate.getTime() + endDate.getTime()) / 2);

    const recentRevenue = bookings
      .filter((b) => new Date(b.createdAt) >= midDate)
      .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    const previousRevenue = bookings
      .filter((b) => new Date(b.createdAt) < midDate)
      .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    const changePercent =
      previousRevenue > 0
        ? Math.round(
            ((recentRevenue - previousRevenue) / previousRevenue) * 100
          )
        : recentRevenue > 0
          ? 100
          : 0;

    return {
      value: impact,
      formatted: `$${(impact / 1000000).toFixed(1)}M`,
      change: `${changePercent >= 0 ? '+' : ''}${changePercent}%`,
    };
  } catch (error) {
    logger.error('[getHeritageImpactFund] Error:', error.message);
    return { value: 0, formatted: '$0', change: '+0%' };
  }
};

/**
 * Tính tổng bookings
 */
const getTotalBookings = async (timeRange = 'last-30-days') => {
  try {
    const { startDate, endDate } = getDateRange(timeRange);
    const count = await Booking.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate },
    });

    // Tính % thay đổi so sánh 2 period
    const midDate = new Date((startDate.getTime() + endDate.getTime()) / 2);

    const recentCount = await Booking.countDocuments({
      createdAt: { $gte: midDate, $lte: endDate },
    });

    const previousCount = await Booking.countDocuments({
      createdAt: { $gte: startDate, $lt: midDate },
    });

    const changePercent =
      previousCount > 0
        ? Math.round(((recentCount - previousCount) / previousCount) * 100)
        : recentCount > 0
          ? 100
          : 0;

    return {
      value: count,
      formatted: count.toLocaleString(),
      change: `${changePercent >= 0 ? '+' : ''}${changePercent}%`,
    };
  } catch (error) {
    logger.error('[getTotalBookings] Error:', error.message);
    return { value: 0, formatted: '0', change: '+0%' };
  }
};

/**
 * Tính số lượng travelers hoạt động (users có bookings)
 */
const getActiveTravelers = async (timeRange = 'last-30-days') => {
  try {
    const { startDate, endDate } = getDateRange(timeRange);

    // Lấy distinct userId từ confirmed bookings hoặc bookings có paymentId
    const travelers = await Booking.distinct('userId', {
      $or: [{ status: 'confirmed' }, { paymentId: { $ne: null } }],
      createdAt: { $gte: startDate, $lte: endDate },
    });

    const count = travelers.length;
    const formatted =
      count > 1000 ? `${(count / 1000).toFixed(1)}k` : count.toString();

    // Tính % thay đổi dựa trên travelers so sánh 2 period
    const midDate = new Date((startDate.getTime() + endDate.getTime()) / 2);

    const recentTravelers = await Booking.distinct('userId', {
      $or: [{ status: 'confirmed' }, { paymentId: { $ne: null } }],
      createdAt: { $gte: midDate, $lte: endDate },
    });

    const previousTravelers = await Booking.distinct('userId', {
      $or: [{ status: 'confirmed' }, { paymentId: { $ne: null } }],
      createdAt: { $gte: startDate, $lt: midDate },
    });

    const changePercent =
      previousTravelers.length > 0
        ? Math.round(
            ((recentTravelers.length - previousTravelers.length) /
              previousTravelers.length) *
              100
          )
        : recentTravelers.length > 0
          ? 100
          : 0;

    return {
      value: count,
      formatted: formatted,
      change: `${changePercent >= 0 ? '+' : ''}${changePercent}%`,
    };
  } catch (error) {
    logger.error('[getActiveTravelers] Error:', error.message);
    return { value: 0, formatted: '0', change: '+0%' };
  }
};

/**
 * Lấy dữ liệu artisan theo vùng địa lý (province)
 */
export const getArtisansByRegion = async () => {
  try {
    // Lấy số lượng artisan theo province
    const artisansByProvince = await Artisan.aggregate([
      {
        $match: {
          verificationStatus: 'approved',
          isProfileVerified: true,
          province: { $ne: '', $exists: true },
        },
      },
      {
        $group: {
          _id: '$province',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 }, // Top 10 regions
    ]);

    // Lất 6 tháng trước để tính growth
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // Lấy artisan mới trong 6 tháng theo province
    const newArtisansByProvince = await Artisan.aggregate([
      {
        $match: {
          verificationStatus: 'approved',
          isProfileVerified: true,
          province: { $ne: '', $exists: true },
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: '$province',
          newCount: { $sum: 1 },
        },
      },
    ]);

    // Map data để tính growth %
    const newArtisanMap = Object.fromEntries(
      newArtisansByProvince.map((item) => [item._id, item.newCount])
    );

    const result = artisansByProvince.map((item) => {
      const totalCount = item.count;
      const newCount = newArtisanMap[item._id] || 0;
      const growthPercent =
        totalCount > newCount && totalCount - newCount > 0
          ? Math.round((newCount / (totalCount - newCount)) * 100)
          : newCount > 0
            ? 100
            : 0;

      return {
        name: item._id,
        capacity: totalCount,
        growth: growthPercent,
      };
    });

    return result;
  } catch (error) {
    logger.error('[getArtisansByRegion] Error:', error.message);
    return [];
  }
};
