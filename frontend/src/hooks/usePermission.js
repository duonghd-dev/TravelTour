import { useAuth } from './useAuth';
import {
  hasRole,
  hasPermission,
  isAdmin,
  isStaff,
  isArtisan,
  isCustomer,
} from '@/utils/rolePermissions';

/**
 * Custom hook để kiểm tra role và permission
 */
export const usePermission = () => {
  const { user } = useAuth();
  const userRole = user?.role;

  return {
    // Kiểm tra role
    hasRole: (requiredRoles) => hasRole(userRole, requiredRoles),
    hasPermission: (permission) => hasPermission(userRole, permission),

    // Quick role checks
    isAdmin: () => isAdmin(userRole),
    isStaff: () => isStaff(userRole),
    isArtisan: () => isArtisan(userRole),
    isCustomer: () => isCustomer(userRole),

    // Lấy role hiện tại
    role: userRole,
  };
};

export default usePermission;
