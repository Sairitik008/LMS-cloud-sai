import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('userInfo')) || null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (user) {
        try {
          const { data } = await api.get('/auth/me');
          const updatedUser = { ...data, token: user.token };
          setUser(updatedUser);
          localStorage.setItem('userInfo', JSON.stringify(updatedUser));
        } catch (err) {
          // Only clear session if token is explicitly rejected (401 Unauthorized)
          // During server cold-starts, network timeouts, or 503 database reconnects, preserve local session
          if (err.response?.status === 401) {
            localStorage.removeItem('userInfo');
            setUser(null);
          } else {
            console.warn('Backend server cold-start or temporary network hiccup; retaining cached session.');
          }
        }
      }
      setLoading(false);
    };
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    setUser(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
    toast.success(`Welcome back, ${data.name}!`);
    return data; // Return data so callers can redirect based on role
  };

  const register = async (name, email, password, extraData = {}) => {
    const payload = { name, email, password, ...extraData };
    const { data } = await api.post('/auth/register', payload);
    setUser(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
    toast.success(`Welcome to SaiCloud LMS, ${data.name}! Let's start learning.`);
  };

  const updateProfile = async (formData) => {
    // using multi-part form data for image upload
    const { data } = await api.put('/auth/me', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    setUser(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
    toast.success('Profile updated successfully!');
    return data;
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
