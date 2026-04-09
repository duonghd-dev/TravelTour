import { useAuth } from './useAuth';
import {
  hasRole,
  hasPermission,
  isAdmin,
  isStaff,
  isArtisan,
  isCustomer,
} from '@/utils/rolePermissions';


export const usePermission = () => {
  const { user } = useAuth();
  const userRole = user?.role;

  return {
    
    hasRole: (requiredRoles) => hasRole(userRole, requiredRoles),
    hasPermission: (permission) => hasPermission(userRole, permission),

    
    isAdmin: () => isAdmin(userRole),
    isStaff: () => isStaff(userRole),
    isArtisan: () => isArtisan(userRole),
    isCustomer: () => isCustomer(userRole),

    
    role: userRole,
  };
};

export default usePermission;
