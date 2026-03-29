import * as artisanService from './artisan.service.js';
import * as artisanValidator from './artisan.validator.js';
import logger from '../../common/utils/logger.js';

/**
 * GET /api/v1/artisans - Lấy danh sách tất cả nghệ nhân
 */
export const getAllArtisans = async (req, res) => {
  try {
    const { category, craft, province, isVerified } = req.query;
    const filters = {};

    if (category) filters.category = category;
    if (craft) filters.craft = craft;
    if (province) filters.province = province;
    if (isVerified !== undefined) filters.isVerified = isVerified === 'true';

    const result = await artisanService.getAllArtisans(filters);
    res.json(result);
  } catch (err) {
    logger.error('[getAllArtisans] Error:', err.message);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * GET /api/v1/artisans/:id - Lấy chi tiết nghệ nhân
 */
export const getArtisanDetail = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'ID không hợp lệ',
      });
    }

    const result = await artisanService.getArtisanDetail(id);
    res.json(result);
  } catch (err) {
    logger.error('[getArtisanDetail] Error:', err.message);
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * POST /api/v1/artisans/profile - Tạo hồ sơ nghệ nhân
 * Protected route - requires authentication
 */
export const createArtisanProfile = async (req, res) => {
  try {
    // Validate request body
    const validation = artisanValidator.validateCreateProfile(req.body);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.errors,
      });
    }

    const result = await artisanService.createArtisanProfile(
      req.user.userId,
      req.body
    );
    res.status(201).json(result);
  } catch (err) {
    logger.error('[createArtisanProfile] Error:', err.message);
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * PUT /api/v1/artisans/profile - Cập nhật hồ sơ nghệ nhân
 * Protected route - requires authentication
 */
export const updateArtisanProfile = async (req, res) => {
  try {
    // Validate request body
    const validation = artisanValidator.validateUpdateProfile(req.body);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.errors,
      });
    }

    const result = await artisanService.updateArtisanProfile(
      req.user.userId,
      req.body
    );
    res.json(result);
  } catch (err) {
    logger.error('[updateArtisanProfile] Error:', err.message);
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * GET /api/v1/artisans/:id/stats - Lấy thống kê hoạt động
 */
export const getArtisanStats = async (req, res) => {
  try {
    // Lấy userId từ artisanId (cần find artisan trước)
    const { id } = req.params;

    // Tìm artisan theo ID
    const Artisan = require('./artisan.model.js').default;
    const artisan = await Artisan.findById(id);
    if (!artisan) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nghệ nhân',
      });
    }

    const result = await artisanService.getArtisanStats(artisan.userId);
    res.json(result);
  } catch (err) {
    logger.error('[getArtisanStats] Error:', err.message);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * GET /api/v1/artisans/search - Tìm kiếm nghệ nhân
 */
export const searchArtisans = async (req, res) => {
  try {
    const { keyword, province } = req.query;

    if (!keyword) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp từ khóa tìm kiếm',
      });
    }

    const filters = {};
    if (province) filters.province = province;

    const result = await artisanService.searchArtisans(keyword, filters);
    res.json(result);
  } catch (err) {
    logger.error('[searchArtisans] Error:', err.message);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * GET /api/v1/artisans/profile - Lấy hồ sơ nghệ nhân của chính mình
 * Protected route - requires authentication
 */
export const getMyArtisanProfile = async (req, res) => {
  try {
    const Artisan = require('./artisan.model.js').default;
    const artisan = await Artisan.findOne({ userId: req.user.userId })
      .populate(
        'userId',
        'firstName lastName avatar email phone gender dateOfBirth address'
      )
      .lean();

    if (!artisan) {
      return res.status(404).json({
        success: false,
        message: 'Bạn chưa có hồ sơ nghệ nhân',
      });
    }

    res.json({
      success: true,
      message: 'Hồ sơ nghệ nhân của bạn',
      data: artisan,
    });
  } catch (err) {
    logger.error('[getMyArtisanProfile] Error:', err.message);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
