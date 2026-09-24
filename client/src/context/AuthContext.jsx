import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('studytwin_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state on app start
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('studytwin_token');
      if (storedToken) {
        try {
          const res = await API.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.data);
            setToken(storedToken);
          }
        } catch (err) {
          console.error('[Auth Init Error]', err);
          localStorage.removeItem('studytwin_token');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await API.post('/auth/login', { email, password });
      if (res.data.success) {
        const { token: newToken, user: userData } = res.data.data;
        localStorage.setItem('studytwin_token', newToken);
        setToken(newToken);
        setUser(userData);
        return { success: true, message: res.data.message };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed. Please verify credentials.';
      return { success: false, message: msg };
    }
  };

  const register = async (userData) => {
    try {
      const res = await API.post('/auth/register', userData);
      if (res.data.success) {
        const { token: newToken, user: newUserData } = res.data.data;
        localStorage.setItem('studytwin_token', newToken);
        setToken(newToken);
        setUser(newUserData);
        return { success: true, message: res.data.message };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed.';
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('studytwin_token');
    setUser(null);
    setToken(null);
  };

  const updateProfileState = (updatedUser) => {
    setUser(prev => ({ ...prev, ...updatedUser }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        register,
        logout,
        updateProfileState
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
