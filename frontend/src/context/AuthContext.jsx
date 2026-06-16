import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, student } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [studentProfile, setStudentProfile] = useState(null);

  // Load user from local storage or verify on startup
  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (savedToken && savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setToken(savedToken);
          setUser(parsedUser);
          
          if (parsedUser.role === 'student') {
            const profileRes = await student.getProfile();
            setStudentProfile(profileRes.data);
          }
        } catch (error) {
          console.error('Failed to initialize session:', error);
          logout();
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, []);

  // Student Login
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await auth.login({ email, password });
      const { token: userToken, ...userData } = res.data;
      
      localStorage.setItem('token', userToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setToken(userToken);
      setUser(userData);

      // Fetch profile data
      const profileRes = await student.getProfile();
      setStudentProfile(profileRes.data);
      
      setLoading(false);
      return userData;
    } catch (error) {
      setLoading(false);
      throw error.response?.data?.message || 'Login failed';
    }
  };

  // Coordinator Login
  const loginCoord = async (email, password) => {
    setLoading(true);
    try {
      const res = await auth.coordinatorLogin({ email, password });
      const { token: userToken, ...userData } = res.data;

      localStorage.setItem('token', userToken);
      localStorage.setItem('user', JSON.stringify(userData));

      setToken(userToken);
      setUser(userData);
      setStudentProfile(null);
      
      setLoading(false);
      return userData;
    } catch (error) {
      setLoading(false);
      throw error.response?.data?.message || 'Coordinator Login failed';
    }
  };

  // Student Registration
  const register = async (signUpData) => {
    setLoading(true);
    try {
      const res = await auth.register(signUpData);
      const { token: userToken, ...userData } = res.data;

      localStorage.setItem('token', userToken);
      localStorage.setItem('user', JSON.stringify(userData));

      setToken(userToken);
      setUser(userData);

      // Fetch profile details
      const profileRes = await student.getProfile();
      setStudentProfile(profileRes.data);

      setLoading(false);
      return userData;
    } catch (error) {
      setLoading(false);
      throw error.response?.data?.message || 'Registration failed';
    }
  };

  // Logout session
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setStudentProfile(null);
  };

  // Refresh student profile cache
  const refreshProfile = async () => {
    if (user && user.role === 'student') {
      try {
        const profileRes = await student.getProfile();
        setStudentProfile(profileRes.data);
      } catch (error) {
        console.error('Error refreshing profile:', error);
      }
    }
  };

  const value = {
    user,
    token,
    loading,
    studentProfile,
    login,
    loginCoord,
    register,
    logout,
    refreshProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export default AuthContext;
