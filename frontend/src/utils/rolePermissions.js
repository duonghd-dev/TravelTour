


export const ROLES = {
  ADMIN: 'admin',
  STAFF: 'staff',
  ARTISAN: 'artisan',
  CUSTOMER: 'customer',
};


export const ROLE_PERMISSIONS = {
  admin: ['view_dashboard', 'manage_users', 'manage_staff', 'manage_content'],
  staff: ['view_dashboard', 'manage_artisans'],
  artisan: ['view_profile', 'manage_services'],
  customer: ['view_content', 'book_services'],
};


export const hasRole = (userRole, requiredRoles) => {
  if (!userRole || !requiredRoles) return false;

  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
  return roles.includes(userRole);
};


export const hasPermission = (userRole, permission) => {
  if (!userRole || !permission) return false;

  const permissions = ROLE_PERMISSIONS[userRole] || [];
  return permissions.includes(permission);
};


export const isAdmin = (userRole) => {
  return userRole === ROLES.ADMIN;
};


export const isStaff = (userRole) => {
  return userRole === ROLES.STAFF || userRole === ROLES.ADMIN;
};


export const isArtisan = (userRole) => {
  return userRole === ROLES.ARTISAN;
};


export const isCustomer = (userRole) => {
  return userRole === ROLES.CUSTOMER;
};
