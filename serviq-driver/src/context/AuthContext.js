import React, { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../services/api';
import { authStorage } from '../services/authStorage';
import { socketService } from '../services/socketService';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [driverProfile, setDriverProfile] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Auto-restore session on launch
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const savedToken = await authStorage.getToken();
        const savedUser = await authStorage.getUserData();

        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(savedUser);
          api.setToken(savedToken);

          // Verify token and fetch fresh driver data
          try {
            const meRes = await api.getMe();
            if (meRes.success && meRes.user) {
              // Ensure user is DRIVER
              if (meRes.user.role !== 'driver') {
                throw new Error('Access restricted: Only Driver accounts can access this application');
              }
              setUser(meRes.user);
              setDriverProfile(meRes.user.driverProfile || null);
              await authStorage.saveUserData(meRes.user);

              // Connect Socket.IO
              const orgId = meRes.user.organization?._id || meRes.user.organization;
              if (orgId) {
                socketService.connect(orgId);
              }
            }
          } catch (profileErr) {
            console.warn('Session verification notice:', profileErr.message);
            // If 401 or invalid, clear session
            if (profileErr.message.includes('expired') || profileErr.status === 401) {
              await logout();
            }
          }
        }
      } catch (err) {
        console.error('Failed to restore session:', err);
      } finally {
        setIsLoading(false);
      }
    };

    api.setOnUnauthorized(() => {
      logout();
    });

    restoreSession();
  }, []);

  const login = async (identifier, password) => {
    setIsLoading(true);
    try {
      const res = await api.login(identifier, password);

      if (!res.success) {
        throw new Error(res.message || 'Login failed');
      }

      if (res.user.role !== 'driver') {
        throw new Error('Access denied: This mobile application is for drivers only.');
      }

      setToken(res.token);
      setUser(res.user);
      setDriverProfile(res.user.driverProfile || null);
      api.setToken(res.token);

      await authStorage.saveToken(res.token);
      await authStorage.saveUserData(res.user);

      // Connect Socket.IO
      const orgId = res.user.organization?._id || res.user.organization;
      if (orgId) {
        socketService.connect(orgId);
      }

      return { success: true };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const orgId = user?.organization?._id || user?.organization;
      if (orgId) {
        socketService.disconnect(orgId);
      }
      api.setToken(null);
      setToken(null);
      setUser(null);
      setDriverProfile(null);
      await authStorage.clearAll();
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  const refreshProfile = async () => {
    try {
      const profileRes = await api.getDriverProfile();
      if (profileRes.success && profileRes.driver) {
        setDriverProfile(profileRes.driver);
        if (profileRes.driver.user) {
          setUser((prev) => ({ ...prev, ...profileRes.driver.user }));
        }
      }
    } catch (err) {
      console.warn('Failed to refresh profile:', err.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        driverProfile,
        token,
        isAuthenticated: !!token && user?.role === 'driver',
        isLoading,
        login,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
