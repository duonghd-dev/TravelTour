import { createContext, useState, useCallback, useEffect } from 'react';

export const AuthContext = createContext();

/**
 * AuthProvider - Cung cấp Authentication context cho ứng dụng
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check localStorage when app loads
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('user');
      }
    }

    if (savedToken) {
      setToken(savedToken);
    }

    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    // Clear user data
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('rememberMe');
  }, []);

  const value = {
    user,
    setUser,
    token,
    setToken,
    isLoading,
    isAuthenticated: !!user,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
