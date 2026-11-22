import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

const normalizeRoles = (u) => {
  if (!u) return [];
  if (Array.isArray(u.roles) && u.roles.length > 0) return u.roles;
  if (Array.isArray(u.authorities) && u.authorities.length > 0) {
    return u.authorities.map(a => typeof a === 'string' ? a : (a.authority || a.role || '')).filter(Boolean);
  }
  return [];
};

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
          const stored = authService.getStoredUser() || {};
          const roles = normalizeRoles(freshUser).length > 0
            ? normalizeRoles(freshUser)
            : normalizeRoles(stored);
          const merged = { ...stored, ...freshUser, roles };
          setUser(merged);
          localStorage.setItem('user', JSON.stringify(merged));
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
    const roles = normalizeRoles(data);
    const fullUser = { ...data, roles };
    setUser(fullUser);
    setToken(data.token);
    localStorage.setItem('user', JSON.stringify(fullUser));
    return fullUser;
  };

  const register = async (formData) => {
    const data = await authService.register(formData);
    const roles = normalizeRoles(data);
    const fullUser = { ...data, roles };
    setUser(fullUser);
    setToken(data.token);
    localStorage.setItem('user', JSON.stringify(fullUser));
    return fullUser;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  const roles = normalizeRoles(user);
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
