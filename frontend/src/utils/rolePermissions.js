/**
 * Role-based authorization utilities
 */

// Định nghĩa roles và permissions
export const ROLES = {
  ADMIN: 'admin',
  STAFF: 'staff',
  ARTISAN: 'artisan',
  CUSTOMER: 'customer',
};

// Định nghĩa permission cho mỗi role
export const ROLE_PERMISSIONS = {
  admin: ['view_dashboard', 'manage_users', 'manage_staff', 'manage_content'],
  staff: ['view_dashboard', 'manage_artisans'],
  artisan: ['view_profile', 'manage_services'],
  customer: ['view_content', 'book_services'],
};

/**
 * Kiểm tra xem user có phải role được yêu cầu không
 * @param {string} userRole - Role của user
 * @param {string|array} requiredRoles - Role hoặc array roles được yêu cầu
 * @returns {boolean}
 */
export const hasRole = (userRole, requiredRoles) => {
  if (!userRole || !requiredRoles) return false;

  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
  return roles.includes(userRole);
};

/**
 * Kiểm tra xem user có permission không
 * @param {string} userRole - Role của user
 * @param {string} permission - Permission cần kiểm tra
 * @returns {boolean}
 */
export const hasPermission = (userRole, permission) => {
  if (!userRole || !permission) return false;

  const permissions = ROLE_PERMISSIONS[userRole] || [];
  return permissions.includes(permission);
};

/**
 * Kiểm tra xem user có phải admin không
 * @param {string} userRole - Role của user
 * @returns {boolean}
 */
export const isAdmin = (userRole) => {
  return userRole === ROLES.ADMIN;
};

/**
 * Kiểm tra xem user có phải staff không
 * @param {string} userRole - Role của user
 * @returns {boolean}
 */
export const isStaff = (userRole) => {
  return userRole === ROLES.STAFF || userRole === ROLES.ADMIN;
};

/**
 * Kiểm tra xem user có phải artisan không
 * @param {string} userRole - Role của user
 * @returns {boolean}
 */
export const isArtisan = (userRole) => {
  return userRole === ROLES.ARTISAN;
};

/**
 * Kiểm tra xem user có phải customer không
 * @param {string} userRole - Role của user
 * @returns {boolean}
 */
export const isCustomer = (userRole) => {
  return userRole === ROLES.CUSTOMER;
};
