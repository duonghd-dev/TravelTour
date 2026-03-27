/**
 * Role-Based Authorization Middleware
 * Kiểm tra quyền người dùng theo role
 */

import AppError from '../errors/AppError.js';

// ✅ Check if user is admin
export const authorizeAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    throw new AppError(
      'Access denied. Only admin can access this resource.',
      403
    );
  }
  next();
};

// ✅ Check if user is admin or staff
export const authorizeAdminOrStaff = (req, res, next) => {
  if (!['admin', 'staff'].includes(req.user?.role)) {
    throw new AppError(
      'Access denied. Only admin or staff can access this resource.',
      403
    );
  }
  next();
};

// ✅ Check if user is artisan
export const authorizeArtisan = (req, res, next) => {
  if (req.user?.role !== 'artisan') {
    throw new AppError(
      'Access denied. Only artisan can access this resource.',
      403
    );
  }
  next();
};

// ✅ Check if user is customer
export const authorizeCustomer = (req, res, next) => {
  if (req.user?.role !== 'customer') {
    throw new AppError(
      'Access denied. Only customer can access this resource.',
      403
    );
  }
  next();
};

// ✅ Check if user owns the resource
export const authorizeOwner = (req, res, next) => {
  const resourceOwnerId = req.body.userId || req.params.userId;

  if (req.user.userId !== resourceOwnerId && req.user.role !== 'admin') {
    throw new AppError(
      'Access denied. You can only access your own resources.',
      403
    );
  }
  next();
};

// ✅ Allow multiple roles
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user?.role)) {
      throw new AppError(
        `Access denied. Required role: ${allowedRoles.join(' or ')}`,
        403
      );
    }
    next();
  };
};
