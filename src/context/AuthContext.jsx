import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  authService,
  getStoredToken,
  getStoredUser,
  clearStoredAuth,
} from '../services';

const AuthContext = createContext(null);

function getUserFromResponse(data) {
  return data?.user || data?.data?.user || data?.data || data;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser());
  const [token, setToken] = useState(getStoredToken());
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Refresh user data from GET /api/auth/me
  const refreshUserData = useCallback(async () => {
    const currentToken = getStoredToken();
    if (!currentToken) {
      setUser(null);
      setIsLoading(false);
      return null;
    }

    try {
      const data = await authService.getMe();
      const userData = getUserFromResponse(data);
      setUser(userData);
      if (userData) {
        localStorage.setItem('ecobridge_user', JSON.stringify(userData));
      }
      return userData;
    } catch (err) {
      console.warn('Session verification error:', err.message);
      // If token is expired or unauthorized, clear storage
      if (err.status === 401 && currentToken === getStoredToken()) {
        clearStoredAuth();
        setUser(null);
        setToken(null);
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    refreshUserData();

    // Listen for global auth expired events from apiClient
    const handleAuthExpired = (event) => {
      // Do not clear a newer login because an older verification request failed.
      if (event.detail?.token && event.detail.token !== getStoredToken()) {
        return;
      }
      clearStoredAuth();
      setUser(null);
      setToken(null);
    };

    window.addEventListener('ecobridge:auth-expired', handleAuthExpired);
    return () => {
      window.removeEventListener('ecobridge:auth-expired', handleAuthExpired);
    };
  }, [refreshUserData]);

  // Login handler
  const login = async (credentials) => {
    setAuthError(null);
    try {
      const data = await authService.login(credentials);
      const response = data?.data || data;
      const authToken = response?.token || data?.token || response?.accessToken || data?.accessToken;

      if (!authToken) {
        throw new Error('Login succeeded but the server did not return an authentication token.');
      }

      const profile = await authService.getMe();
      const userData = getUserFromResponse(profile) || response?.user || data?.user;
      setToken(authToken);
      setUser(userData);
      return { success: true, user: userData, token: authToken };
    } catch (err) {
      const msg = err.message || 'Login failed. Please check your credentials.';
      setAuthError(msg);
      throw err;
    }
  };

  // Register handler
  const register = async (userData) => {
    setAuthError(null);
    try {
      const data = await authService.register(userData);
      const authToken = data.token;
      const userObj = data.user || data;
      setToken(authToken);
      setUser(userObj);
      return { success: true, user: userObj, token: authToken };
    } catch (err) {
      const msg = err.message || 'Registration failed. Please try again.';
      setAuthError(msg);
      throw err;
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      clearStoredAuth();
      setUser(null);
      setToken(null);
    }
  };

  // Profile update handler
  const updateUserProfile = async (profileData) => {
    try {
      const data = await authService.updateProfile(profileData);
      const updated = getUserFromResponse(data) || data.user || data;

      setUser((prev) => {
        const merged = { ...(prev || {}), ...updated };
        if (merged) {
          localStorage.setItem('ecobridge_user', JSON.stringify(merged));
        }
        return merged;
      });

      return updated;
    } catch (err) {
      throw err;
    }
  };

  const hasRole = (...roles) => {
    if (!user || !user.role) return false;
    return roles.includes(user.role.toUpperCase());
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    authError,
    setAuthError,
    login,
    register,
    logout,
    refreshUserData,
    updateUserProfile,
    hasRole,
    isAdmin: hasRole('ADMIN'),
    isCollector: hasRole('COLLECTOR'),
    isStaff: hasRole('ADMIN', 'COLLECTOR'),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
