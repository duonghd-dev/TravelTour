import * as userService from './user.service.js';
import * as userValidator from './user.validator.js';
import logger from '../../common/utils/logger.js';


export const createUser = async (req, res) => {
  try {
    
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


export const updateUserById = async (req, res) => {
  try {
    
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


export const deleteUser = async (req, res) => {
  try {
    
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


export const getUserById = async (req, res) => {
  try {
    
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


export const getProfile = async (req, res) => {
  try {
    const result = await userService.getProfile(req.user.userId);
    res.json(result);
  } catch (err) {
    logger.error('[getUserProfile] Error:', err.message);
    res.status(400).json({ message: err.message });
  }
};


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


export const getActivityLog = async (req, res) => {
  try {
    const result = await userService.getActivityLog(req.user.userId);
    res.json(result);
  } catch (err) {
    logger.error('[getActivityLog] Error:', err.message);
    res.status(400).json({ message: err.message });
  }
};


export const getHeritageJourneys = async (req, res) => {
  try {
    const result = await userService.getHeritageJourneys(req.user.userId);
    res.json(result);
  } catch (err) {
    logger.error('[getHeritageJourneys] Error:', err.message);
    res.status(400).json({ message: err.message });
  }
};


export const getFavorites = async (req, res) => {
  try {
    const result = await userService.getFavorites(req.user.userId);
    res.json(result);
  } catch (err) {
    logger.error('[getFavorites] Error:', err.message);
    res.status(400).json({ message: err.message });
  }
};


export const addFavorite = async (req, res) => {
  try {
    const { itemId, itemType } = req.body;

    if (!itemId || !itemType) {
      return res.status(400).json({
        success: false,
        message: 'itemId và itemType là bắt buộc',
      });
    }

    const result = await userService.addFavorite(
      req.user.userId,
      itemId,
      itemType
    );
    res.status(201).json(result);
  } catch (err) {
    logger.error('[addFavorite] Error:', err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};


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


export const getAllUsers = async (req, res) => {
  try {
    
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


export const getUserStats = async (req, res) => {
  try {
    
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
