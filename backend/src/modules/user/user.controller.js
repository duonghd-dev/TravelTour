import * as userService from './user.service.js';
import * as userValidator from './user.validator.js';
import logger from '../../common/utils/logger.js';

/**
 * POST /api/v1/users - Create new user (Admin only)
 */
export const createUser = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only admin can create users.',
      });
    }

    const result = await userService.createUser(req.body);
    res.status(201).json(result);
  } catch (err) {
    logger.error('[createUser] Error:', err.message);
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * PUT /api/v1/users/:id - Update user (Admin only)
 */
export const updateUserById = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only admin can update users.',
      });
    }

    const { id } = req.params;
    const result = await userService.updateUserById(id, req.body);
    res.json(result);
  } catch (err) {
    logger.error('[updateUserById] Error:', err.message);
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * DELETE /api/v1/users/:id - Delete user (Admin only)
 */
export const deleteUser = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only admin can delete users.',
      });
    }

    const { id } = req.params;
    const result = await userService.deleteUser(id);
    res.json(result);
  } catch (err) {
    logger.error('[deleteUser] Error:', err.message);
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * GET /api/v1/users/:id - Get user by ID (Admin only)
 */
export const getUserById = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only admin can view user details.',
      });
    }

    const { id } = req.params;
    const result = await userService.getUserById(id);
    res.json(result);
  } catch (err) {
    logger.error('[getUserById] Error:', err.message);
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * GET /api/v1/users/profile - Lấy thông tin profile của user
 */
export const getProfile = async (req, res) => {
  try {
    const result = await userService.getProfile(req.user.userId);
    res.json(result);
  } catch (err) {
    logger.error('[getUserProfile] Error:', err.message);
    res.status(400).json({ message: err.message });
  }
};

/**
 * PUT /api/v1/users/profile - Cập nhật thông tin profile
 */
export const updateProfile = async (req, res) => {
  try {
    userValidator.validateUpdateProfile(req.body);
    const result = await userService.updateProfile(req.user.userId, req.body);
    res.json(result);
  } catch (err) {
    logger.error('[updateProfile] Error:', err.message);
    res.status(400).json({ message: err.message });
  }
};

/**
 * PUT /api/v1/users/password - Cập nhật mật khẩu
 */
export const updatePassword = async (req, res) => {
  try {
    userValidator.validatePasswordUpdate(req.body);
    const { currentPassword, newPassword } = req.body;
    const result = await userService.updatePassword(
      req.user.userId,
      currentPassword,
      newPassword
    );
    res.json(result);
  } catch (err) {
    logger.error('[updatePassword] Error:', err.message);
    res.status(400).json({ message: err.message });
  }
};

/**
 * PUT /api/v1/users/two-factor-auth - Enable/Disable 2FA
 */
export const updateTwoFactorAuth = async (req, res) => {
  try {
    userValidator.validateTwoFactorAuth(req.body);
    const { enabled } = req.body;
    const result = await userService.updateTwoFactorAuth(
      req.user.userId,
      enabled
    );
    res.json(result);
  } catch (err) {
    logger.error('[updateTwoFactorAuth] Error:', err.message);
    res.status(400).json({ message: err.message });
  }
};

/**
 * GET /api/v1/users/activity-log - Lấy danh sách hoạt động
 */
export const getActivityLog = async (req, res) => {
  try {
    const result = await userService.getActivityLog(req.user.userId);
    res.json(result);
  } catch (err) {
    logger.error('[getActivityLog] Error:', err.message);
    res.status(400).json({ message: err.message });
  }
};

/**
 * GET /api/v1/users/heritage-journeys - Lấy danh sách heritage journeys
 */
export const getHeritageJourneys = async (req, res) => {
  try {
    const result = await userService.getHeritageJourneys(req.user.userId);
    res.json(result);
  } catch (err) {
    logger.error('[getHeritageJourneys] Error:', err.message);
    res.status(400).json({ message: err.message });
  }
};

/**
 * GET /api/v1/users/favorites - Lấy danh sách favorites
 */
export const getFavorites = async (req, res) => {
  try {
    const result = await userService.getFavorites(req.user.userId);
    res.json(result);
  } catch (err) {
    logger.error('[getFavorites] Error:', err.message);
    res.status(400).json({ message: err.message });
  }
};

/**
 * DELETE /api/v1/users/favorites/:id - Xóa favorite
 */
export const removeFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await userService.removeFavorite(req.user.userId, id);
    res.json(result);
  } catch (err) {
    logger.error('[removeFavorite] Error:', err.message);
    res.status(400).json({ message: err.message });
  }
};

/**
 * GET /api/users - Lấy danh sách tất cả users (cho admin)
 */
export const getAllUsers = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin' && req.user.role !== 'staff') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only admin can view all users.',
      });
    }

    const { page, limit, role, status, search, sort } = req.query;

    const result = await userService.getAllUsers({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
      role,
      status,
      search,
      sort: sort || '-createdAt',
    });

    res.json(result);
  } catch (err) {
    logger.error('[getAllUsers] Error:', err.message);
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * GET /api/v1/users/stats/overview - Lấy thống kê users cho dashboard
 */
export const getUserStats = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin' && req.user.role !== 'staff') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only admin can view stats.',
      });
    }

    const result = await userService.getUserStats();
    res.json(result.data);
  } catch (err) {
    logger.error('[getUserStats] Error:', err.message);
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * POST /api/v1/users/verify-email - Verify email with OTP
 */
export const verifyEmailOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required',
      });
    }

    const result = await userService.verifyEmailOTP(email, otp);
    res.json(result);
  } catch (err) {
    logger.error('[verifyEmailOTP] Error:', err.message);
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * GET /api/v1/users/admin - Lấy thông tin admin/staff cho chat support
 */
export const getAdminUser = async (req, res) => {
  try {
    const result = await userService.getAdminUser();
    res.json(result);
  } catch (err) {
    logger.error('[getAdminUser] Error:', err.message);
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
