import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';

/**
 * Custom hook để sử dụng Auth context
 * @returns {Object} - { user, isLoading, isAuthenticated, login, logout, register }
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    // Fallback nếu AuthContext chưa được provide
    return {
      user: null,
      isLoading: false,
      isAuthenticated: false,
      login: () => Promise.reject(new Error('AuthContext not provided')),
      logout: () => {},
      register: () => Promise.reject(new Error('AuthContext not provided')),
    };
  }

  return context;
};

export default useAuth;
