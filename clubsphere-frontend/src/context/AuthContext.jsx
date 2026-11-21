import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(authService.getStoredUser());
  const [token, setToken] = useState(authService.getToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = authService.getToken();
      if (storedToken) {
        try {
          const freshUser = await authService.getCurrentUser();
          setUser((prev) => ({ ...prev, ...freshUser }));
        } catch {
          // Token expired or server restarted
          authService.logout();
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    setUser(data);
    setToken(data.token);
    return data;
  };

  const register = async (formData) => {
    const data = await authService.register(formData);
    setUser(data);
    setToken(data.token);
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  const roles = user?.roles || [];
  const isAdmin = roles.includes('ROLE_ADMIN');
  const isStaff = roles.includes('ROLE_STAFF');
  const isMember = roles.includes('ROLE_MEMBER');
  const isAuthenticated = !!token && !!user;

  const setAuthUser = (authData) => {
    if (authData) {
      setUser(authData);
      setToken(authData.token || authService.getToken());
    } else {
      setUser(null);
      setToken(null);
    }
  };

  const refreshUser = async () => {
    try {
      const freshUser = await authService.getCurrentUser();
      setUser((prev) => ({ ...prev, ...freshUser }));
      return freshUser;
    } catch {
      return null;
    }
  };

  const value = {
    user,
    token,
    roles,
    isAuthenticated,
    isAdmin,
    isStaff,
    isMember,
    login,
    register,
    setAuthUser,
    refreshUser,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
