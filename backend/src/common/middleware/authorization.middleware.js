

import AppError from '../errors/AppError.js';


export const authorizeAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    throw new AppError(
      'Access denied. Only admin can access this resource.',
      403
    );
  }
  next();
};


export const authorizeAdminOrStaff = (req, res, next) => {
  if (!['admin', 'staff'].includes(req.user?.role)) {
    throw new AppError(
      'Access denied. Only admin or staff can access this resource.',
      403
    );
  }
  next();
};


export const authorizeArtisan = (req, res, next) => {
  if (req.user?.role !== 'artisan') {
    throw new AppError(
      'Access denied. Only artisan can access this resource.',
      403
    );
  }
  next();
};


export const authorizeCustomer = (req, res, next) => {
  if (req.user?.role !== 'customer') {
    throw new AppError(
      'Access denied. Only customer can access this resource.',
      403
    );
  }
  next();
};


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
