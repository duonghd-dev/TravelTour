import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';


export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    
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
